import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, AppState, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { DemoClock, SystemClock, type Clock } from './src/domain/clock';
import { DEMO_DUMP, FixtureBrainDumpParser } from './src/domain/parser';
import { createGeminiBrainDumpParser } from './src/domain/parserFactory';
import { rankItems } from './src/domain/ranking';
import { planNudges } from './src/domain/nudges';
import type { CobyItem, ParsedItem } from './src/domain/types';
import { clearItems, completeItem, listItems, saveItems } from './src/data/items';
import { clearAllCobyNudges, syncItemNudges, triggerLabNudge } from './src/notifications/scheduler';
import { loadBilling, purchaseMonthly, restoreBilling, type BillingState } from './src/billing/revenuecat';
import { HomeScreen } from './src/ui/HomeScreen';
import { ReceiptScreen } from './src/ui/ReceiptScreen';
import { CobyOrb } from './src/ui/CobyOrb';
import { speechErrorMessage } from './src/voice/speech';
import { offlineVoiceAvailable } from './src/voice/offline';
import { VoiceSession, type VoicePhase } from './src/voice/session';

type Screen = 'home' | 'receipt' | 'plan' | 'focus' | 'lab' | 'paywall';
const clock = new SystemClock();
const fixtureParser = new FixtureBrainDumpParser();
const configuredParser = createGeminiBrainDumpParser();
const releaseDemoMode = process.env.EXPO_PUBLIC_COBY_DEMO_MODE === 'true';
const demoToolsEnabled = __DEV__;

function Button({ label, onPress, kind = 'primary', disabled = false }: { label: string; onPress: () => void; kind?: 'primary' | 'quiet'; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress}
    style={[styles.button, kind === 'quiet' && styles.quietButton, disabled && styles.disabledButton]}>
    <Text style={[styles.buttonText, kind === 'quiet' && styles.quietButtonText]}>{label}</Text>
  </Pressable>;
}

function dueText(item: { dueAt: string | null; dueDate: string | null }): string {
  if (item.dueAt) return new Date(item.dueAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  if (item.dueDate) return new Date(`${item.dueDate}T12:00:00`).toLocaleDateString(undefined, { dateStyle: 'medium' });
  return 'No date set';
}

function createDemoClock(): DemoClock {
  const start = clock.now();
  start.setHours(9, 0, 0, 0);
  return new DemoClock(start);
}

async function buildDemoItems(demoClock: DemoClock): Promise<CobyItem[]> {
  const result = await fixtureParser.parse(DEMO_DUMP, { clock: demoClock, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  const timestamp = demoClock.now().toISOString();
  return result.items.map((entry, index): CobyItem => ({ ...entry,
    id: `demo-${demoClock.now().getTime()}-${index}`, sourceText: DEMO_DUMP,
    createdAt: timestamp, status: 'captured', commitmentMode: index === 1 ? 'gentle' : 'none', completedAt: null,
  }));
}

export default function App() {
  const [fontsLoaded] = useFonts({ Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold });
  const [screen, setScreen] = useState<Screen>('home');
  const [items, setItems] = useState<CobyItem[]>([]);
  const [dump, setDump] = useState('');
  const [draft, setDraft] = useState<ParsedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReason, setShowReason] = useState(false);
  const [planMode, setPlanMode] = useState<'list' | 'calendar'>('list');
  const [selectedDay, setSelectedDay] = useState(() => clock.now().toDateString());
  const [focusItem, setFocusItem] = useState<CobyItem | null>(null);
  const [activeClock, setActiveClock] = useState<Clock>(() => new SystemClock());
  const [labMessage, setLabMessage] = useState('Fixture parser · RevenueCat not connected');
  const [parserMode, setParserMode] = useState<'fixture' | 'configured'>(process.env.EXPO_PUBLIC_COBY_AI_PROVIDER === 'gemini' ? 'configured' : 'fixture');
  const [listening, setListening] = useState(false);
  const [billing, setBilling] = useState<BillingState>({ configured: false, plus: false, monthlyPrice: null, message: 'Checking Coby Plus…' });
  const [pendingPersistentId, setPendingPersistentId] = useState<string | null>(null);
  const voice = useRef(new VoiceSession());
  const [voicePhase, setVoicePhase] = useState<VoicePhase>('idle');
  const voiceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [inputLevel, setInputLevel] = useState(0);
  const [voiceNetworkError, setVoiceNetworkError] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [preparingVoice, setPreparingVoice] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Voice has not been tested in this session.');

  const clearVoiceTimer = useCallback(() => { if (voiceTimer.current) clearTimeout(voiceTimer.current); voiceTimer.current = undefined; }, []);
  function voiceTimeout(message: string, timeoutMs: number) {
    clearVoiceTimer();
    voiceTimer.current = setTimeout(() => {
      voice.current.cancel(); setVoicePhase('idle'); setListening(false); setInputLevel(0);
      ExpoSpeechRecognitionModule.abort(); setError(message);
    }, timeoutMs);
  }
  const cancelVoice = useCallback(() => {
    clearVoiceTimer(); voice.current.cancel(); setVoicePhase('idle'); setListening(false); setInputLevel(0);
    ExpoSpeechRecognitionModule.abort();
  }, [clearVoiceTimer]);
  useSpeechRecognitionEvent('start', () => {
    if (voice.current.phase !== 'starting') return;
    clearVoiceTimer(); voice.current.ready(); setVoicePhase(voice.current.phase); setListening(true);
  });
  useSpeechRecognitionEvent('end', () => {
    const ended = voice.current.end();
    if (!ended) return;
    clearVoiceTimer(); setVoicePhase('idle'); setListening(false); setInputLevel(0); setDump(ended.text);
    if (ended.empty) setError((current) => current ?? "No words came through. Check microphone access, then try again or type below.");
  });
  useSpeechRecognitionEvent('volumechange', ({ value }) => {
    if (voice.current.phase === 'listening') setInputLevel(Math.max(0, Math.min(1, value / 10)));
  });
  useSpeechRecognitionEvent('result', (event) => {
    const text = voice.current.result(event.results[0]?.transcript ?? '', event.isFinal);
    if (text !== null) setDump(text);
  });
  useSpeechRecognitionEvent('nomatch', () => {
    if (voice.current.phase !== 'idle') setError("I didn't catch anything. Tap the mic and try again, or type below.");
  });
  useSpeechRecognitionEvent('error', (event) => {
    if (voice.current.phase === 'idle' || voice.current.phase === 'preparing') return;
    voice.current.fail(); setVoicePhase(voice.current.phase);
    setListening(false);
    setVoiceNetworkError(event.error === 'network' || event.code === 13);
    setVoiceStatus(`Speech failure: ${event.error} · Android code ${event.code ?? 'unknown'}`);
    const message = speechErrorMessage(event.error, event.code);
    if (message) setError(message);
    voiceTimeout(message || 'Voice has stopped. Tap Speak to start again.', 6000);
  });

  useEffect(() => {
    const session = voice.current;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active' && ['listening', 'stopping'].includes(voice.current.phase)) cancelVoice();
    });
    return () => { subscription.remove(); clearVoiceTimer(); session.cancel(); ExpoSpeechRecognitionModule.abort(); };
  }, [cancelVoice, clearVoiceTimer]);
  useEffect(() => { if (screen !== 'home' && voice.current.phase !== 'idle') cancelVoice(); }, [screen, cancelVoice]);

  useEffect(() => {
    async function hydrate() {
      try {
        let stored = await listItems();
        if (!stored.length && releaseDemoMode) {
          const demoClock = createDemoClock();
          await saveItems(await buildDemoItems(demoClock));
          stored = await listItems();
          setActiveClock(demoClock);
        }
        setItems(stored);
        setScreen('home');
      } catch { setError('Coby could not open local storage. Please restart the app.'); }
      finally { setLoading(false); }
    }
    void hydrate();
  }, []);

  useEffect(() => { loadBilling().then(setBilling); }, []);

  const ranked = useMemo(() => rankItems(items, activeClock), [items, activeClock]);
  const now = ranked[0];
  const next = ranked.slice(1, 3);

  async function cancelCompletedNudges(item: CobyItem): Promise<void> {
    try { await syncItemNudges({ ...item, status: 'completed' }, activeClock); }
    catch { setError('Done. A previously scheduled reminder may still appear.'); }
  }

  async function understand() {
    setError(null);
    setBusy(true);
    try {
      const selectedParser = parserMode === 'fixture' ? fixtureParser : configuredParser;
      const result = await selectedParser.parse(dump, { clock: activeClock, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
      if (!result.items.length) { setError('Write what is on your mind first.'); return; }
      setDraft(result.items);
      setScreen('receipt');
    } catch { setError('Coby could not understand that yet. Your words are still here.'); }
    finally { setBusy(false); }
  }

  async function startListening() {
    if (preparingVoice || !voice.current.begin(dump)) return;
    setVoicePhase(voice.current.phase);
    setError(null); setVoiceNotice(null); setVoiceNetworkError(false);
    try {
      if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
        setError('Android speech recognition is unavailable. Enable Speech Recognition & Synthesis, or type below.');
        return;
      }
      if (Platform.OS === 'android' && ExpoSpeechRecognitionModule.getSpeechRecognitionServices().length === 0) {
        setError('No Android speech service is enabled. Turn on Speech Recognition & Synthesis, or type below.');
        return;
      }
      const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permission.granted) { setError('Microphone access is off. Allow it in Android settings, or type below.'); return; }
      const offlineReady = Platform.OS === 'android' && await offlineVoiceAvailable(ExpoSpeechRecognitionModule);
      if (voice.current.phase !== 'preparing') return;
      const service = Platform.OS === 'android' ? ExpoSpeechRecognitionModule.getDefaultRecognitionService().packageName : 'system';
      setVoiceStatus(`${offlineReady ? 'On-device English' : 'Online English'} · ${offlineReady ? 'system on-device recognizer' : service}`);
      voice.current.starting(); setVoicePhase(voice.current.phase);
      setInputLevel(0);
      voiceTimeout('Android voice did not start. Your words are still here. Tap Speak to retry.', 12000);
      ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        requiresOnDeviceRecognition: offlineReady,
        interimResults: true,
        volumeChangeEventOptions: { enabled: true, intervalMillis: 120 },
        // Online recognizers use the standard microphone path; segmented audio needs offline support.
        continuous: Platform.OS === 'android' && offlineReady,
        androidIntentOptions: { EXTRA_LANGUAGE_MODEL: 'free_form' },
      });
    } catch { cancelVoice(); setError('Voice could not start. Check microphone access, then try again or type below.'); }
    finally { if (voice.current.phase === 'preparing') { voice.current.cancel(); setVoicePhase('idle'); } }
  }

  function stopListening() {
    if (!voice.current.stop()) return;
    setVoicePhase(voice.current.phase);
    voiceTimeout('Your words are still here. Android did not finish the voice attempt; tap Speak to retry.', 6000);
    ExpoSpeechRecognitionModule.stop();
  }

  async function prepareOfflineVoice() {
    if (preparingVoice || voice.current.phase !== 'idle') return;
    setPreparingVoice(true); setError(null); setVoiceNotice('Preparing offline English voice… You can keep typing.');
    try {
      if (!ExpoSpeechRecognitionModule.supportsOnDeviceRecognition()) {
        setVoiceNotice(null);
        setError('This Android speech service does not support offline voice. Try another connection, or type below.'); return;
      }
      if (!await offlineVoiceAvailable(ExpoSpeechRecognitionModule)) {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        try {
          await Promise.race([
            ExpoSpeechRecognitionModule.androidTriggerOfflineModelDownload({ locale: 'en-US' }),
            new Promise<void>((resolve) => { timeout = setTimeout(resolve, 60000); }),
          ]);
        } finally { if (timeout) clearTimeout(timeout); }
      }
      const ready = await offlineVoiceAvailable(ExpoSpeechRecognitionModule);
      setVoiceNetworkError(!ready);
      if (ready) setVoiceNotice('Offline English voice is ready. Tap Speak to try it.');
      else { setVoiceNotice(null); setError('Android has not finished installing English voice. Try again after the download, or type below.'); }
    } catch { setVoiceNetworkError(true); setVoiceNotice(null); setError('Android could not prepare offline English voice. You can retry setup or keep typing.'); }
    finally { setPreparingVoice(false); }
  }

  async function holdItems(accepted: ParsedItem[] = draft) {
    setError(null);
    setBusy(true);
    try {
      const timestamp = activeClock.now().toISOString();
      const captured = accepted.map((entry, index): CobyItem => ({
        ...entry, id: `${activeClock.now().getTime()}-${index}-${Math.random().toString(36).slice(2)}`,
        sourceText: dump, createdAt: timestamp, status: 'captured',
        commitmentMode: 'none', completedAt: null,
      }));
      await saveItems(captured);
      for (const item of captured) await syncItemNudges(item, activeClock);
      setItems(await listItems());
      setDump(''); setDraft([]); setScreen('home');
    } catch { setError('Coby could not save this. Please try again.'); }
    finally { setBusy(false); }
  }

  async function finishNow() {
    if (!now) return;
    setError(null); setBusy(true);
    try { await completeItem(now.item, activeClock.now().toISOString()); setItems(await listItems()); setShowReason(false); await cancelCompletedNudges(now.item); }
    catch { setError('Coby could not mark this complete. Please try again.'); }
    finally { setBusy(false); }
  }

  async function startFocus(item: CobyItem) {
    setError(null); setBusy(true);
    try {
      const active: CobyItem = { ...item, status: 'active' };
      await saveItems([active]);
      setItems(await listItems()); setFocusItem(active); setScreen('focus');
    } catch { setError('Coby could not start focus. Please try again.'); }
    finally { setBusy(false); }
  }

  async function finishFocus() {
    if (!focusItem) return;
    setError(null); setBusy(true);
    try {
      await completeItem(focusItem, activeClock.now().toISOString());
      setItems(await listItems()); setFocusItem(null); setScreen('home'); setShowReason(false);
      await cancelCompletedNudges(focusItem);
    } catch { setError('Coby could not mark this complete. Please try again.'); }
    finally { setBusy(false); }
  }

  async function endFocus() {
    if (!focusItem) return;
    setError(null); setBusy(true);
    try {
      await saveItems([{ ...focusItem, status: 'planned' }]);
      setItems(await listItems()); setFocusItem(null); setScreen('home');
    } catch { setError('Coby could not end focus. Please try again.'); }
    finally { setBusy(false); }
  }

  const openItems = items.filter((item) => item.status !== 'completed' && item.status !== 'archived');
  const calendarDays = Array.from({ length: 7 }, (_, offset) => {
    const day = activeClock.now(); day.setDate(day.getDate() + offset); return day;
  });

  async function setCommitment(item: CobyItem, mode: 'gentle' | 'persistent') {
    setError(null); setBusy(true);
    try {
      const changed: CobyItem = { ...item, commitmentMode: mode };
      await saveItems([changed]);
      const enabled = await syncItemNudges(changed, activeClock);
      setItems(await listItems());
      if (!enabled) setError('Notifications are off. Coby still has your item.');
    } catch { setError('Coby saved the item but could not schedule a reminder.'); }
    finally { setBusy(false); }
  }

  async function seedLab() {
    setBusy(true); setError(null);
    try {
      const demoClock = createDemoClock(); setActiveClock(demoClock);
      const seeded = await buildDemoItems(demoClock);
      await saveItems(seeded); setItems(await listItems()); setLabMessage('Demo items seeded.');
    } catch { setError('Could not seed demo data.'); }
    finally { setBusy(false); }
  }

  async function clearLab() {
    setBusy(true); setError(null);
    try { await clearItems(); await clearAllCobyNudges(); setItems([]); setActiveClock(new SystemClock()); setLabMessage('Local items cleared.'); }
    catch { setError('Could not clear local items.'); }
    finally { setBusy(false); }
  }

  async function nudgeLab() {
    if (!now) { setLabMessage('Seed an item first.'); return; }
    try { await triggerLabNudge(now.item); setLabMessage('A local nudge is queued for two seconds from now.'); }
    catch { setLabMessage('Notification permission is needed on an Android device.'); }
  }

  function requestPersistent(item: CobyItem) {
    if (billing.plus) { void setCommitment(item, 'persistent'); return; }
    setPendingPersistentId(item.id); setScreen('paywall');
  }

  async function buyPlus() {
    setBusy(true); setError(null);
    try {
      const updated = await purchaseMonthly(); setBilling(updated);
      if (updated.plus && pendingPersistentId) {
        const selected = items.find((item) => item.id === pendingPersistentId);
        if (selected) await setCommitment(selected, 'persistent');
      }
      setPendingPersistentId(null); setScreen('home');
    } catch { setError('The test purchase did not complete. You can keep using Gentle.'); }
    finally { setBusy(false); }
  }

  async function restorePlus() {
    setBusy(true); setError(null);
    try {
      const updated = await restoreBilling(); setBilling(updated);
      if (!updated.plus) { setError('No Coby Plus purchase found.'); return; }
      if (pendingPersistentId) {
        const selected = items.find((item) => item.id === pendingPersistentId);
        if (selected) await setCommitment(selected, 'persistent');
      }
      setPendingPersistentId(null); setScreen('home');
    }
    catch { setError('Could not restore purchases right now.'); }
    finally { setBusy(false); }
  }

  if (loading || !fontsLoaded) return <View style={styles.loading}><ActivityIndicator color={colors.violet} /></View>;

  return <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
    {screen === 'home' ? <HomeScreen
      busy={busy}
      dueText={dueText}
      dump={dump}
      error={error}
      listening={listening}
      voicePhase={voicePhase}
      inputLevel={inputLevel}
      voiceNotice={voiceNotice}
      preparingVoice={preparingVoice}
      onPrepareOfflineVoice={Platform.OS === 'android' && voiceNetworkError ? () => void prepareOfflineVoice() : undefined}
      next={next}
      now={now}
      onChangeDump={(value) => { setDump(value); if (error) setError(null); }}
      onComplete={finishNow}
      onGentle={(item) => void setCommitment(item, 'gentle')}
      onOpenLab={() => setScreen('lab')}
      onOpenPlan={() => setScreen('plan')}
      onPersistent={requestPersistent}
      onStartFocus={(item) => void startFocus(item)}
      onToggleReason={() => setShowReason(!showReason)}
      onToggleVoice={() => voice.current.phase === 'listening' ? stopListening() : void startListening()}
      onUnderstand={() => void understand()}
      showLab={demoToolsEnabled}
      showReason={showReason}
    /> : <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      {screen === 'lab' && demoToolsEnabled && <>
        <Pressable onPress={() => setScreen('home')} accessibilityRole="button"><Text style={styles.back}>← Home</Text></Pressable>
        <Text style={[styles.pageTitle, styles.planTitle]}>Coby Lab</Text>
        <Text style={styles.support}>Local demo controls. Nothing here is sent online.</Text>
        <Text style={styles.labStatus}>{labMessage}</Text>
        <Text style={styles.labStatus}>{voiceStatus}</Text>
        <Text style={styles.support}>Clock: {activeClock.now().toLocaleString()}</Text>
        <Button label="Check offline voice" kind="quiet" disabled={busy} onPress={async () => {
          const ready = await offlineVoiceAvailable(ExpoSpeechRecognitionModule);
          setLabMessage(ready ? 'English voice model installed. Speak will use on-device recognition.' : 'English offline voice model not available.');
        }} />
        <Button label={preparingVoice ? "Preparing English voice…" : "Prepare offline English voice"} kind="quiet" disabled={busy || preparingVoice} onPress={() => void prepareOfflineVoice()} />
        <Button label="Seed demo data" disabled={busy} onPress={seedLab} />
        <Button label="Advance time by 60 minutes" disabled={busy} kind="quiet" onPress={() => { const demo = new DemoClock(activeClock.now()); demo.advanceMinutes(60); setActiveClock(demo); setLabMessage('Demo clock advanced by one hour.'); }} />
        <Button label="Advance to next nudge" disabled={busy} kind="quiet" onPress={() => {
          const candidates = items.flatMap((item) => planNudges(item, activeClock)).sort((a, b) => a.at.getTime() - b.at.getTime());
          if (!candidates.length) { setLabMessage('No future nudge is scheduled in demo time.'); return; }
          setActiveClock(new DemoClock(candidates[0].at)); setLabMessage(`Demo clock moved to ${candidates[0].at.toLocaleTimeString()}.`);
        }} />
        <Button label="Trigger next nudge" disabled={busy} kind="quiet" onPress={nudgeLab} />
        <Button label="Use fixture parser" kind="quiet" onPress={() => { setParserMode('fixture'); setLabMessage('Fixture parser is active.'); }} />
        <Button label="Use configured parser" kind="quiet" onPress={() => { setParserMode('configured'); setLabMessage('Configured Gemini parser is active.'); }} />
        <Button label="RevenueCat state" kind="quiet" onPress={async () => { const updated = await loadBilling(); setBilling(updated); setLabMessage(`${updated.message} Plus: ${updated.plus ? 'active' : 'inactive'}.`); }} />
        <Button label="Clear local data" disabled={busy} kind="quiet" onPress={clearLab} />
      </>}

      {screen === 'paywall' && <>
        <Pressable onPress={() => setScreen('home')} accessibilityRole="button"><Text style={styles.back}>← Home</Text></Pressable>
        <View style={styles.captureOrb}><CobyOrb size={88} /></View>
        <Text style={styles.pageTitle}>A little more support.</Text>
        <Text style={styles.support}>Coby Plus adds Persistent reminders as a deadline gets close. Brain dumps, NOW, Plan and Gentle stay free.</Text>
        <Text style={styles.labStatus}>{billing.message}</Text>
        <Button label={billing.monthlyPrice ? `Try Plus monthly · ${billing.monthlyPrice}` : 'Monthly test product unavailable'} disabled={busy || !billing.configured || !billing.monthlyPrice} onPress={buyPlus} />
        <Button label="Restore purchase" kind="quiet" disabled={busy || !billing.configured} onPress={restorePlus} />
      </>}

      {screen === 'plan' && <>
        <Pressable onPress={() => setScreen('home')} accessibilityRole="button"><Text style={styles.back}>← Home</Text></Pressable>
        <Text style={[styles.pageTitle, styles.planTitle]}>Everything I’m holding.</Text>
        <Text style={styles.support}>Look around whenever you want. Coby has the rest.</Text>
        <View style={styles.modeBar}>
          <Pressable accessibilityRole="button" onPress={() => setPlanMode('list')} style={[styles.modeButton, planMode === 'list' && styles.modeSelected]}><Text style={styles.modeText}>List</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={() => setPlanMode('calendar')} style={[styles.modeButton, planMode === 'calendar' && styles.modeSelected]}><Text style={styles.modeText}>Calendar</Text></Pressable>
        </View>
        {planMode === 'calendar' && <View style={styles.dayStrip}>{calendarDays.map((day) =>
          <Pressable key={day.toDateString()} accessibilityRole="button" accessibilityLabel={day.toDateString()} onPress={() => setSelectedDay(day.toDateString())}
            style={[styles.dayButton, selectedDay === day.toDateString() && styles.daySelected]}>
            <Text style={styles.dayText}>{day.toLocaleDateString(undefined, { weekday: 'short' })}</Text>
            <Text style={styles.dayNumber}>{day.getDate()}</Text>
          </Pressable>)}</View>}
        {(() => {
          const shown = planMode === 'list' ? openItems : openItems.filter((item) => item.dueAt ? new Date(item.dueAt).toDateString() === selectedDay : item.dueDate ? new Date(`${item.dueDate}T12:00:00`).toDateString() === selectedDay : false);
          return shown.length ? shown.map((item) => <View key={item.id} style={styles.planRow}>
            <Text style={styles.planItemTitle}>{item.title}</Text>
            <Text style={styles.receiptMeta}>{dueText(item)}</Text>
            <Pressable accessibilityRole="button" onPress={() => startFocus(item)}><Text style={styles.reasonLink}>Focus on this →</Text></Pressable>
          </View>) : <Text style={styles.planEmpty}>Nothing here. Coby is holding the rest.</Text>;
        })()}
        {planMode === 'calendar' && <Text style={styles.support}>Items without a date are in List.</Text>}
        <View style={styles.bottomAction}><Button label="Add more" onPress={() => setScreen('home')} /></View>
      </>}

      {screen === 'focus' && focusItem && <View style={styles.focusScreen}>
        <CobyOrb size={88} />
        <Text style={styles.kicker}>ONE THING NOW</Text>
        <Text style={[styles.nowTitle, styles.focusTitle]}>{focusItem.title}</Text>
        <Text style={styles.support}>The rest can wait. Coby has it.</Text>
        <View style={styles.focusActions}>
          <Button label={busy ? 'Finishing…' : 'Complete'} disabled={busy} onPress={finishFocus} />
          <Button label="End focus" kind="quiet" disabled={busy} onPress={endFocus} />
        </View>
      </View>}

      {screen === 'receipt' && <ReceiptScreen draft={draft} busy={busy} onEditDump={() => setScreen('home')} onHold={(accepted) => void holdItems(accepted)} />}

      {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    </ScrollView>}
  </KeyboardAvoidingView>;
}

const colors = { background: '#F7F6F2', ink: '#1A1A19', violet: '#7464B5', violetSoft: '#E9E4F6', muted: '#77727A' };
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0 }, loading: { flex: 1, justifyContent: 'center', backgroundColor: colors.background },
  page: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 58, paddingBottom: 42 },
  homePage: { paddingTop: 34, paddingBottom: 24 },
  wordmark: { color: colors.ink, fontSize: 31, fontWeight: '700', letterSpacing: -2 },
  motto: { fontSize: 14, color: colors.muted }, topline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  arrival: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 25 },
  hero: { color: colors.ink, fontSize: 42, fontWeight: '700', letterSpacing: -2.2, marginTop: 10 },
  subhead: { color: colors.muted, fontSize: 16, textAlign: 'center', marginBottom: 28 },
  orbOuter: { backgroundColor: '#DFD7F3', alignItems: 'center', justifyContent: 'center', shadowColor: colors.violet, shadowOpacity: .14, shadowRadius: 22, elevation: 6 },
  orbInner: { backgroundColor: '#A898D1' }, homeOrb: { alignItems: 'center', marginTop: 30, marginBottom: 30 },
  kicker: { fontSize: 12, fontWeight: '700', color: colors.violet, letterSpacing: 2.2, marginBottom: 15 },
  nowTitle: { fontSize: 34, lineHeight: 40, fontWeight: '600', color: colors.ink, letterSpacing: -1.4, marginBottom: 13 },
  meta: { fontSize: 15, color: colors.muted, marginBottom: 17 }, reasonLink: { color: colors.violet, fontSize: 14, fontWeight: '600', marginBottom: 14 },
  reason: { color: colors.muted, fontSize: 14, marginBottom: 15 }, support: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  nextArea: { marginTop: 32 }, nextItem: { color: colors.ink, fontSize: 16, marginBottom: 10 }, bottomAction: { marginTop: 'auto', paddingTop: 24 },
  button: { minHeight: 56, backgroundColor: colors.ink, borderRadius: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22, marginTop: 14 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' }, quietButton: { backgroundColor: colors.violetSoft }, quietButtonText: { color: colors.ink }, disabledButton: { opacity: .45 },
  back: { color: colors.muted, fontSize: 15 }, captureOrb: { alignSelf: 'center', marginTop: 68, marginBottom: 38 }, receiptOrb: { alignSelf: 'center', marginTop: 36, marginBottom: 34 },
  pageTitle: { color: colors.ink, fontSize: 34, fontWeight: '700', letterSpacing: -1.3, marginBottom: 12 },
  dumpInput: { minHeight: 210, borderRadius: 26, backgroundColor: '#FFFFFF', padding: 20, fontSize: 18, color: colors.ink, marginTop: 30, marginBottom: 10, lineHeight: 26 },
  demoLink: { color: colors.violet, fontSize: 14, alignSelf: 'center', marginTop: 22 },
  receiptList: { marginTop: 28, marginBottom: 8 }, receiptRow: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 20, marginBottom: 10 },
  receiptTitle: { fontSize: 17, fontWeight: '600', color: colors.ink, minHeight: 32 }, receiptMeta: { fontSize: 13, color: colors.muted, marginTop: 3 },
  error: { color: '#A24D48', fontSize: 14, marginTop: 18 },
  reminderLink: { color: colors.violet, textAlign: 'center', fontSize: 14, marginTop: 12 }, reminderState: { color: colors.muted, fontSize: 13, marginTop: 12 },
  labLink: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 25 }, labStatus: { color: colors.violet, fontSize: 16, marginTop: 30, marginBottom: 20 },
  typeInstead: { color: colors.muted, fontSize: 13, textAlign: 'center', marginTop: 18 },
  planLink: { color: colors.violet, fontSize: 15, fontWeight: '600', textAlign: 'center', marginTop: 22 },
  planTitle: { marginTop: 55 }, modeBar: { flexDirection: 'row', backgroundColor: '#EBE8E4', borderRadius: 18, padding: 4, marginTop: 30, marginBottom: 25 },
  modeButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 15 }, modeSelected: { backgroundColor: '#FFFFFF' }, modeText: { color: colors.ink, fontSize: 15, fontWeight: '600' },
  dayStrip: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 }, dayButton: { alignItems: 'center', paddingVertical: 10, width: '13%', borderRadius: 15 },
  daySelected: { backgroundColor: colors.violetSoft }, dayText: { color: colors.muted, fontSize: 11 }, dayNumber: { color: colors.ink, fontSize: 16, fontWeight: '600', marginTop: 5 },
  planRow: { borderBottomWidth: 1, borderBottomColor: '#E6E2DD', paddingVertical: 18 }, planItemTitle: { color: colors.ink, fontSize: 18, fontWeight: '600', marginBottom: 4 },
  planEmpty: { color: colors.muted, fontSize: 16, marginVertical: 30 }, focusScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 620 },
  focusTitle: { textAlign: 'center', marginTop: 16 }, focusActions: { alignSelf: 'stretch', marginTop: 70 },
});

