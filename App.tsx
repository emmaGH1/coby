import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, BackHandler, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import * as Notifications from 'expo-notifications';
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { DemoClock, SystemClock, type Clock } from './src/domain/clock';
import { DEMO_DUMP, FixtureBrainDumpParser, unparsedReceipt } from './src/domain/parser';
import { createGeminiBrainDumpParser } from './src/domain/parserFactory';
import { selectHomeItems } from './src/domain/ranking';
import { planNudges, postponeNudge } from './src/domain/nudges';
import type { CobyItem, ItemStatus, ParsedItem } from './src/domain/types';
import { applyItemEdit, leaveFocusItem, initialCommitment } from './src/domain/itemActions';
import { clearItems, completeItem, deleteItem, deleteItems, listItems, saveItems } from './src/data/items';
import { cancelItemNudges, clearAllCobyNudges, NUDGE_ACTIONS, prepareNudgeNotifications, syncItemNudges, triggerLabNudge } from './src/notifications/scheduler';
import { loadBilling, purchaseMonthly, restoreBilling, type BillingState } from './src/billing/revenuecat';
import { HomeScreen } from './src/ui/HomeScreen';
import { ReceiptScreen } from './src/ui/ReceiptScreen';
import { NudgeScreen } from './src/ui/NudgeScreen';
import { PlanScreen, type PlanView } from './src/ui/PlanScreen';
import { CobyOrb } from './src/ui/CobyOrb';
import { BottomNav } from './src/ui/BottomNav';
import { iconFonts } from './src/ui/icons';
import { colors as palette, type } from './src/ui/theme';
import { speechErrorMessage } from './src/voice/speech';
import { offlineVoiceAvailable } from './src/voice/offline';
import { VoiceSession, type VoicePhase } from './src/voice/session';
import { androidVoiceOptions } from './src/voice/options';

type Screen = 'home' | 'receipt' | 'plan' | 'focus' | 'lab' | 'paywall' | 'edit' | 'nudge' | 'settings';
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
  const [fontsLoaded] = useFonts({ Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, ...iconFonts });
  const [screen, setScreen] = useState<Screen>('home');
  const [items, setItems] = useState<CobyItem[]>([]);
  const [dump, setDump] = useState('');
  const [draft, setDraft] = useState<ParsedItem[]>([]);
  const [extractionFailed, setExtractionFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReason, setShowReason] = useState(false);
  const [focusItem, setFocusItem] = useState<CobyItem | null>(null);
  const [focusContext, setFocusContext] = useState<{ returnTo: 'home' | 'plan'; previousStatus: ItemStatus } | null>(null);
  const [editingItem, setEditingItem] = useState<CobyItem | null>(null);
  const [editReturnTo, setEditReturnTo] = useState<'home' | 'plan'>('plan');
  const [planInitialView, setPlanInitialView] = useState<PlanView>('list');
  const [, refreshTime] = useState(0);
  const pageScroll = useRef<ScrollView>(null);
  const [activeClock, setActiveClock] = useState<Clock>(() => new SystemClock());
  const [labMessage, setLabMessage] = useState('Fixture parser · RevenueCat not connected');
  const [parserMode, setParserMode] = useState<'fixture' | 'configured'>(process.env.EXPO_PUBLIC_COBY_AI_PROVIDER === 'gemini' ? 'configured' : 'fixture');
  const [listening, setListening] = useState(false);
  const [billing, setBilling] = useState<BillingState>({ configured: false, plus: false, monthlyPrice: null, message: 'Checking Coby Plus…' });
  const [pendingPersistentId, setPendingPersistentId] = useState<string | null>(null);
  const [nudgeItemId, setNudgeItemId] = useState<string | null>(null);
  const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);
  const [settingsNotice, setSettingsNotice] = useState<string | null>(null);
  const handledNudgeResponses = useRef(new Set<string>());
  const nudgeQueue = useRef(Promise.resolve());
  const voice = useRef(new VoiceSession());
  const [voicePhase, setVoicePhase] = useState<VoicePhase>('idle');
  const voiceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const voiceOptions = useRef<Parameters<typeof ExpoSpeechRecognitionModule.start>[0] | null>(null);
  const voiceStartedAt = useRef(0);
  const traceVoice = useCallback((event: string) => {
    if (__DEV__) console.info(`[CobyVoice] ${event} phase=${voice.current.phase} elapsedMs=${Math.round(performance.now() - voiceStartedAt.current)}`);
  }, []);
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
    traceVoice('native-start');
    if (voice.current.phase !== 'starting' && voice.current.phase !== 'restarting') return;
    clearVoiceTimer(); voice.current.ready(); setVoicePhase(voice.current.phase); setListening(true);
  });
  function finishVoiceCycle() {
    traceVoice('native-end');
    const ended = voice.current.end();
    if (!ended) return;
    clearVoiceTimer(); setInputLevel(0); setDump(ended.text);
    if (ended.restart) {
      setVoicePhase('restarting'); setListening(true);
      voiceTimer.current = setTimeout(() => {
        if (voice.current.phase !== 'restarting') return;
        if (AppState.currentState !== 'active' || !voiceOptions.current) { cancelVoice(); return; }
        voiceTimeout('Android voice did not resume. Your words are still here. Tap Speak to retry.', 12000);
        try { traceVoice('restart-request'); ExpoSpeechRecognitionModule.start(voiceOptions.current); }
        catch { cancelVoice(); setError('Voice could not resume. Your words are still here. Tap Speak to retry.'); }
      }, 0);
      return;
    }
    setVoicePhase('idle'); setListening(false);
    if (ended.empty) setError((current) => current ?? "No words came through. Check microphone access, then try again or type below.");
  }
  useSpeechRecognitionEvent('end', finishVoiceCycle);
  useSpeechRecognitionEvent('speechstart', () => { traceVoice('speech-start'); voice.current.speechStart(); });
  useSpeechRecognitionEvent('speechend', () => { traceVoice('speech-end'); voice.current.speechEnd(); });
  useSpeechRecognitionEvent('volumechange', ({ value }) => {
    if (voice.current.phase === 'listening') setInputLevel(Math.max(0, Math.min(1, value / 10)));
  });
  useSpeechRecognitionEvent('result', (event) => {
    if (event.isFinal) traceVoice('final-result');
    const text = voice.current.result(event.results[0]?.transcript ?? '', event.isFinal);
    if (text !== null) setDump(text);
  });
  useSpeechRecognitionEvent('nomatch', () => {
    if (voice.current.phase !== 'idle' && !voice.current.continues) {
      const message = speechErrorMessage('no-speech', undefined, voice.current.hasRecognizedWords);
      if (message) setError(message);
    }
  });
  useSpeechRecognitionEvent('error', (event) => {
    traceVoice(`error=${event.error} code=${event.code ?? 'unknown'}`);
    if (voice.current.phase === 'idle' || voice.current.phase === 'preparing') return;
    const silence = event.error === 'no-speech' || event.error === 'speech-timeout';
    if (silence && voice.current.continues) {
      voice.current.fail(true);
      // Native end follows this error; resume there, after the recognizer is released.
      voiceTimeout('Android voice did not resume. Your words are still here. Tap Speak to retry.', 6000);
      return;
    }
    voice.current.fail(); setVoicePhase(voice.current.phase);
    setListening(false);
    setVoiceNetworkError(event.error === 'network' || event.code === 13);
    setVoiceStatus(`Speech failure: ${event.error} · Android code ${event.code ?? 'unknown'}`);
    const message = speechErrorMessage(event.error, event.code, voice.current.hasRecognizedWords);
    if (message) setError(message);
    voiceTimeout(message || 'Voice has stopped. Tap Speak to start again.', 6000);
  });

  useEffect(() => {
    const session = voice.current;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active' && ['starting', 'listening', 'restarting', 'stopping'].includes(voice.current.phase)) cancelVoice();
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

  useEffect(() => {
    if (loading) return;
    void prepareNudgeNotifications().catch(() => setError('Coby could not prepare notification controls. Your items are still held.'));
    function enqueue(response: Notifications.NotificationResponse) {
      const key = `${response.notification.request.identifier}:${response.actionIdentifier}:${response.notification.date}`;
      if (handledNudgeResponses.current.has(key)) return;
      handledNudgeResponses.current.add(key);
      nudgeQueue.current = nudgeQueue.current.then(async () => {
        const id = response.notification.request.content.data?.itemId;
        if (typeof id !== 'string') return;
        const stored = await listItems();
        const item = stored.find(entry => entry.id === id);
        if (!item || item.status === 'completed' || item.status === 'archived') {
          const last = await Notifications.getLastNotificationResponseAsync();
          if (last?.notification.request.identifier === response.notification.request.identifier && last.actionIdentifier === response.actionIdentifier) {
            await Notifications.clearLastNotificationResponseAsync();
          }
          setItems(stored); setScreen('home'); setError('That item is already finished or no longer held.'); return;
        }
        setNudgeItemId(id); setNudgeMessage(null);
        const minutes = NUDGE_ACTIONS[response.actionIdentifier as keyof typeof NUDGE_ACTIONS];
        if (minutes) {
          const changed = postponeNudge(item, minutes, activeClock, key);
          const reminderItem = changed ?? (item.lastNudgeResponseId === key ? item : null);
          if (reminderItem) {
            if (changed) await saveItems([changed]);
            setItems(await listItems());
            if (!await syncItemNudges(reminderItem, activeClock)) setError('Your reminder choice is saved, but notifications are off.');
            else setNudgeMessage(`I’ll check in again in ${minutes === 60 ? '1 hour' : `${minutes} minutes`}. Your due time is unchanged.`);
          } else if (item.lastNudgeResponseId !== key) setError('Reminders are off for this item. Choose Gentle to turn them on.');
        } else setItems(stored);
        setScreen('nudge');
        const last = await Notifications.getLastNotificationResponseAsync();
        if (last?.notification.request.identifier === response.notification.request.identifier && last.actionIdentifier === response.actionIdentifier) {
          await Notifications.clearLastNotificationResponseAsync();
        }
      }).catch(() => { handledNudgeResponses.current.delete(key); setError('Coby could not update that reminder. Open the item and try again.'); });
    }
    const subscription = Notifications.addNotificationResponseReceivedListener(enqueue);
    void Notifications.getLastNotificationResponseAsync().then(response => { if (response) enqueue(response); });
    return () => subscription.remove();
  }, [loading, activeClock]);

  const nudgeItem = items.find(item => item.id === nudgeItemId);
  async function delayNudge(minutes: number) {
    if (!nudgeItem || busy) return;
    setBusy(true); setError(null);
    try {
      const latest = (await listItems()).find(item => item.id === nudgeItem.id);
      const changed = latest && postponeNudge(latest, minutes, activeClock, `in-app:${latest.id}:${activeClock.now().getTime()}:${minutes}`);
      if (!changed) { setError('Choose Gentle or Persistent before postponing a reminder.'); return; }
      await saveItems([changed]); setItems(await listItems());
      if (!await syncItemNudges(changed, activeClock)) setError('The reminder choice is saved, but notifications are off.');
      else setNudgeMessage(`I’ll check in again in ${minutes === 60 ? '1 hour' : `${minutes} minutes`}. Your due time is unchanged.`);
    } catch { setError('Coby could not postpone that reminder. Please try again.'); }
    finally { setBusy(false); }
  }

  async function finishNudge() {
    if (!nudgeItem || busy) return;
    setBusy(true); setError(null);
    try { await completeItem(nudgeItem, activeClock.now().toISOString()); await cancelCompletedNudges(nudgeItem); setItems(await listItems()); setNudgeItemId(null); setScreen('home'); }
    catch { setError('Coby could not finish this item. Please try again.'); }
    finally { setBusy(false); }
  }

  async function toggleComplete(item: CobyItem) {
    if (busy) return;
    setBusy(true); setError(null);
    try {
      const changed: CobyItem = item.status === 'completed'
        ? { ...item, status: 'planned', completedAt: null }
        : { ...item, status: 'completed', completedAt: activeClock.now().toISOString() };
      await saveItems([changed]); setItems(await listItems());
      try { await syncItemNudges(changed, activeClock); }
      catch { setError('The item is saved, but its reminders could not be updated.'); }
    } catch { setError('Coby could not update that item. Please try again.'); }
    finally { setBusy(false); }
  }

  useEffect(() => {
    const refresh = () => refreshTime(value => value + 1);
    const timer = setInterval(refresh, 60_000);
    const foreground = AppState.addEventListener('change', state => { if (state === 'active') refresh(); });
    return () => { clearInterval(timer); foreground.remove(); };
  }, [activeClock]);
  const { now, next, earlier } = selectHomeItems(items, activeClock);

  async function cancelCompletedNudges(item: CobyItem): Promise<void> {
    try { await syncItemNudges({ ...item, status: 'completed' }, activeClock); }
    catch { setError('Done. A previously scheduled reminder may still appear.'); }
  }

  async function understand() {
    setError(null);
    setExtractionFailed(false);
    setBusy(true);
    try {
      const selectedParser = parserMode === 'fixture' ? fixtureParser : configuredParser;
      const result = await selectedParser.parse(dump, { clock: activeClock, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
      if (!result.items.length) { setError('Write what is on your mind first.'); return; }
      setDraft(result.items);
      setScreen('receipt');
    } catch {
      setExtractionFailed(true);
      setError('Coby could not organize that right now. Retry, or keep your words as one item and add details yourself.');
    }
    finally { setBusy(false); }
  }

  async function startListening() {
    if (preparingVoice || !voice.current.begin(dump, Platform.OS === 'android')) return;
    voiceStartedAt.current = performance.now(); traceVoice('user-start');
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
      if (AppState.currentState !== 'active') { cancelVoice(); return; }
      const service = Platform.OS === 'android' ? ExpoSpeechRecognitionModule.getDefaultRecognitionService().packageName : 'system';
      setVoiceStatus(`${offlineReady ? 'On-device English' : 'Online English'} · ${offlineReady ? 'system on-device recognizer' : service}`);
      voice.current.starting(); setVoicePhase(voice.current.phase);
      setInputLevel(0);
      voiceTimeout('Android voice did not start. Your words are still here. Tap Speak to retry.', 12000);
      voiceOptions.current = {
        lang: 'en-US',
        requiresOnDeviceRecognition: offlineReady,
        interimResults: true,
        volumeChangeEventOptions: { enabled: true, intervalMillis: 120 },
        ...(Platform.OS === 'android' ? androidVoiceOptions(Number(Platform.Version), offlineReady) : { continuous: false }),
      };
      ExpoSpeechRecognitionModule.start(voiceOptions.current);
    } catch { cancelVoice(); setError('Voice could not start. Check microphone access, then try again or type below.'); }
    finally { if (voice.current.phase === 'preparing') { voice.current.cancel(); setVoicePhase('idle'); } }
  }

  function stopListening() {
    const betweenCycles = voice.current.phase === 'restarting';
    if (!voice.current.stop()) return;
    setVoicePhase(voice.current.phase);
    if (betweenCycles) { clearVoiceTimer(); ExpoSpeechRecognitionModule.abort(); finishVoiceCycle(); return; }
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
        commitmentMode: initialCommitment(entry, activeClock), completedAt: null,
      }));
      await saveItems(captured);
      setItems(current => [...current, ...captured]);
      setDump(''); setDraft([]); setScreen('home');
      let reminderFailure = false;
      for (const item of captured) {
        try { if (!await syncItemNudges(item, activeClock)) reminderFailure = true; }
        catch { reminderFailure = true; }
      }
      if (reminderFailure) setError('Your items are saved. Some reminders could not be enabled. Check notification access in Settings, then choose Gentle in Plan.');
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
      setFocusContext({ returnTo: screen === 'plan' ? 'plan' : 'home', previousStatus: item.status });
      setItems(await listItems()); setFocusItem(active); setScreen('focus');
    } catch { setError('Coby could not start focus. Please try again.'); }
    finally { setBusy(false); }
  }

  async function finishFocus() {
    if (!focusItem) return;
    setError(null); setBusy(true);
    try {
      await completeItem(focusItem, activeClock.now().toISOString());
      setItems(await listItems()); setFocusItem(null); setFocusContext(null); setScreen('home'); setShowReason(false);
      await cancelCompletedNudges(focusItem);
    } catch { setError('Coby could not mark this complete. Please try again.'); }
    finally { setBusy(false); }
  }

  const endFocus = useCallback(async () => {
    if (!focusItem) return;
    setError(null); setBusy(true);
    try {
      const context = focusContext;
      await saveItems([leaveFocusItem(focusItem, context?.previousStatus ?? 'planned')]);
      setItems(await listItems()); setFocusItem(null); setScreen(context?.returnTo ?? 'home');
      setFocusContext(null);
    } catch { setError('Coby could not end focus. Please try again.'); }
    finally { setBusy(false); }
  }, [focusItem, focusContext]);

  function openItemEdit(item: CobyItem) {
    setEditReturnTo(screen === 'home' ? 'home' : 'plan'); setEditingItem(item); setError(null); setScreen('edit');
  }
  const cancelEdit = useCallback(() => { setEditingItem(null); setError(null); setScreen(editReturnTo); }, [editReturnTo]);

  async function saveEditedItem(accepted: ParsedItem[]) {
    if (!editingItem || !accepted[0] || busy) return;
    setBusy(true); setError(null);
    const changed = applyItemEdit(editingItem, accepted[0]);
    try {
      await saveItems([changed]);
      setItems(await listItems()); setEditingItem(null); setScreen(editReturnTo);
      try {
        if (!await syncItemNudges(changed, activeClock)) setError('Changes saved. Notifications are off, so no reminder was scheduled.');
      } catch { setError('Changes saved, but Coby could not update the reminders. Please check notification access.'); }
    } catch { setError('Coby could not save your changes. Your edits are still here; try again.'); }
    finally { setBusy(false); }
  }

  async function removeHeldItem(item: CobyItem, returnTo: 'home' | 'plan' = 'plan') {
    setBusy(true); setError(null);
    try {
      await cancelItemNudges(item.id);
      await deleteItem(item.id);
      setItems((current) => current.filter((held) => held.id !== item.id));
      setEditingItem(null); setScreen(returnTo);
    } catch { setError('Coby could not delete this item. It is still held; try again.'); }
    finally { setBusy(false); }
  }

  function confirmDelete() {
    if (!editingItem || busy) return;
    const item = editingItem;
    Alert.alert('Delete this item?', 'It will be removed from Coby along with its reminders.', [
      { text: 'Keep it', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void removeHeldItem(item, editReturnTo) },
    ]);
  }

  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'home') return false;
      if (busy) return true;
      if (screen === 'focus') { void endFocus(); return true; }
      if (screen === 'edit') { cancelEdit(); return true; }
      setError(null); setScreen('home');
      return true;
    });
    return () => back.remove();
  }, [screen, busy, endFocus, cancelEdit]);

  const openItems = items.filter((item) => item.status !== 'completed' && item.status !== 'archived');
  async function clearHeldList(targets: CobyItem[]) {
    setBusy(true); setError(null);
    try {
      for (const item of targets) await cancelItemNudges(item.id);
      const ids = new Set(targets.map((item) => item.id));
      await deleteItems([...ids]);
      setItems((current) => current.filter((item) => !ids.has(item.id)));
      setShowReason(false);
    } catch { setError('Coby could not finish clearing your list. Your items remain, but some reminders may have stopped. Try again.'); }
    finally { setBusy(false); }
  }
  function confirmClearList() {
    if (busy || !openItems.length) return;
    const targets = [...openItems];
    Alert.alert('Clear your list?', `Delete all ${targets.length} held ${targets.length === 1 ? 'item' : 'items'} and their reminders? This includes every calendar day.`, [
      { text: 'Keep my list', style: 'cancel' },
      { text: 'Clear list', style: 'destructive', onPress: () => void clearHeldList(targets) },
    ]);
  }

  async function setCommitment(item: CobyItem, mode: 'none' | 'gentle' | 'persistent') {
    setError(null); setNudgeMessage(null); setBusy(true);
    try {
      const changed: CobyItem = { ...item, commitmentMode: mode, reminderAt: null };
      await saveItems([changed]);
      const enabled = await syncItemNudges(changed, activeClock);
      setItems(await listItems());
      if (!enabled) setError('Notifications are off. Coby still has your item.');
      else if (mode !== 'none' && !planNudges(changed, activeClock).length) setError('Choose a future date and time before Coby can schedule a nudge.');
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

  if (loading || !fontsLoaded) return <View style={styles.loading}><CobyOrb size={165} /><Text style={styles.arrivalName}>coby</Text><Text style={styles.arrivalCopy}>Unload your mind.</Text></View>;

  return <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
    {screen === 'home' ? <HomeScreen
      busy={busy}
      dueText={dueText}
      dump={dump}
      error={error}
      onKeepUnparsed={extractionFailed && dump.trim() ? () => {
        const result = unparsedReceipt(dump);
        setDraft(result.items); setExtractionFailed(false); setError(null); setScreen('receipt');
      } : undefined}
      listening={listening}
      voicePhase={voicePhase}
      inputLevel={inputLevel}
      voiceNotice={voiceNotice}
      preparingVoice={preparingVoice}
      onPrepareOfflineVoice={Platform.OS === 'android' && voiceNetworkError ? () => void prepareOfflineVoice() : undefined}
      next={next}
      now={now}
      earlierCount={earlier.length}
      onReviewEarlier={() => { setPlanInitialView('earlier'); setScreen('plan'); }}
      onEdit={openItemEdit}
      onChangeDump={(value) => { setDump(value); if (error) setError(null); }}
      onComplete={finishNow}
      onGentle={(item) => void setCommitment(item, 'gentle')}
      onOpenLab={() => setScreen('lab')}
      onOpenPlan={() => { setPlanInitialView('list'); setScreen('plan'); }}
      onOpenSettings={() => { setError(null); setSettingsNotice(null); setScreen('settings'); }}
      onPersistent={requestPersistent}
      onStartFocus={(item) => void startFocus(item)}
      onToggleReason={() => setShowReason(!showReason)}
      onToggleVoice={() => ['listening', 'restarting'].includes(voice.current.phase) ? stopListening() : void startListening()}
      onUnderstand={() => void understand()}
      showLab={demoToolsEnabled}
      showReason={showReason}
    /> : <ScrollView ref={pageScroll} key={screen} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
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
        <Text style={styles.labStatus}>{billing.plus ? 'Coby Plus is active. Persistent reminders are available.' : billing.message}</Text>
        <Button label={billing.plus ? 'Plus is active' : billing.monthlyPrice ? `Try Plus monthly · ${billing.monthlyPrice}` : 'Monthly test product unavailable'} disabled={busy || billing.plus || !billing.configured || !billing.monthlyPrice} onPress={buyPlus} />
        <Button label="Restore purchase" kind="quiet" disabled={busy || !billing.configured} onPress={restorePlus} />
      </>}

      {screen === 'plan' && <PlanScreen items={items} clock={activeClock} busy={busy} dueText={dueText} initialView={planInitialView} onViewChange={setPlanInitialView}
        onHome={() => setScreen('home')}
        onEdit={openItemEdit}
        onDelete={item => Alert.alert('Delete this item?', 'It will be removed from Coby along with its reminders.', [
          { text: 'Keep it', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => void removeHeldItem(item) }])}
        onFocus={item => void startFocus(item)} onToggleComplete={item => void toggleComplete(item)}
        onReminders={item => { setNudgeItemId(item.id); setNudgeMessage(null); setError(null); setScreen('nudge'); }}
        onClear={confirmClearList} />}

      {screen === 'settings' && <>
        <Pressable accessibilityRole="button" onPress={() => { setError(null); setScreen('home'); }} style={styles.actionLink}><Text style={styles.back}>← Home</Text></Pressable>
        <Text style={styles.pageTitle}>Settings</Text>
        <Text style={styles.support}>Gentle is one timely nudge. Persistent adds follow-through as a deadline approaches.</Text>
        <Button label="Notification access" kind="quiet" onPress={async () => {
          setError(null);
          try {
            const permission = await Notifications.requestPermissionsAsync();
            setSettingsNotice(permission.granted ? 'Notifications are allowed. Choose Gentle or Persistent from an item in Plan.' : 'Notifications are off. Enable them in Android app settings to receive nudges.');
          } catch { setSettingsNotice('Coby could not check notification access. Please try again.'); }
        }} />
        {settingsNotice && <Text accessibilityLiveRegion="polite" style={styles.support}>{settingsNotice}</Text>}
        <Button label="Plan and reminder choices" kind="quiet" onPress={() => setScreen('plan')} />
        <Button label="Coby Plus" kind="quiet" onPress={() => setScreen('paywall')} />
        {demoToolsEnabled && <Button label="Coby Lab" kind="quiet" onPress={() => setScreen('lab')} />}
      </>}

      {screen === 'nudge' && nudgeItem && <>
        <NudgeScreen item={nudgeItem} busy={busy} message={nudgeMessage} dueText={dueText}
          onBack={() => { setError(null); setScreen('home'); }} onFocus={() => void startFocus(nudgeItem)}
          onDone={() => void finishNudge()} onDelay={minutes => void delayNudge(minutes)}
          onEdit={() => openItemEdit(nudgeItem)}
          onGentle={() => void setCommitment(nudgeItem, 'gentle')}
          onPersistent={() => requestPersistent(nudgeItem)} onOff={() => void setCommitment(nudgeItem, 'none')} />
      </>}

      {screen === 'focus' && focusItem && <View style={styles.focusScreen}>
        <Pressable accessibilityRole="button" disabled={busy} onPress={endFocus} style={styles.actionLink}><Text style={styles.reasonLink}>← Back to {focusContext?.returnTo === 'plan' ? 'Plan' : 'Home'}</Text></Pressable>
        <CobyOrb size={88} />
        <Text style={styles.kicker}>ONE THING NOW</Text>
        <Text style={[styles.nowTitle, styles.focusTitle]}>{focusItem.title}</Text>
        <Text style={styles.support}>The rest can wait. Coby has it.</Text>
        <View style={styles.focusActions}>
          <Button label={busy ? 'Finishing…' : 'Complete'} disabled={busy} onPress={finishFocus} />
          <Button label="End focus" kind="quiet" disabled={busy} onPress={endFocus} />
        </View>
      </View>}

      {screen === 'receipt' && <ReceiptScreen clock={activeClock} onReviewLocation={y => pageScroll.current?.scrollTo({ y, animated: true })} draft={draft} busy={busy} onEditDump={() => setScreen('home')} onHold={(accepted) => void holdItems(accepted)} />}
      {screen === 'edit' && editingItem && <ReceiptScreen clock={activeClock} onReviewLocation={y => pageScroll.current?.scrollTo({ y, animated: true })} key={editingItem.id} mode="edit" draft={[editingItem]} busy={busy} onEditDump={cancelEdit} onHold={(accepted) => void saveEditedItem(accepted)} onDelete={confirmDelete} />}

      {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    </ScrollView>}
    {screen === 'plan' && <BottomNav current="plan" onHome={() => setScreen('home')} onPlan={() => {}} />}
  </KeyboardAvoidingView>;
}

const colors = { ...palette, background: palette.paper };
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0 }, loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  arrivalName: { fontFamily: type.bold, fontSize: 43, color: colors.ink, marginTop: 18 }, arrivalCopy: { fontFamily: type.regular, fontSize: 16, color: colors.muted, marginTop: 12 },
  page: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 42 },
  homePage: { paddingTop: 34, paddingBottom: 24 },
  wordmark: { color: colors.ink, fontSize: 31, fontWeight: '700', letterSpacing: -2 },
  motto: { fontSize: 14, color: colors.muted }, topline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  arrival: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 25 },
  hero: { color: colors.ink, fontSize: 42, fontWeight: '700', letterSpacing: -2.2, marginTop: 10 },
  subhead: { color: colors.muted, fontSize: 16, textAlign: 'center', marginBottom: 28 },
  orbOuter: { backgroundColor: '#DFD7F3', alignItems: 'center', justifyContent: 'center', shadowColor: colors.violet, shadowOpacity: .14, shadowRadius: 22, elevation: 6 },
  orbInner: { backgroundColor: '#A898D1' }, homeOrb: { alignItems: 'center', marginTop: 30, marginBottom: 30 },
  kicker: { fontFamily: type.semibold, fontSize: 12, color: colors.violet, letterSpacing: 2.2, marginBottom: 15 },
  nowTitle: { fontFamily: type.semibold, fontSize: 34, lineHeight: 42, color: colors.ink, letterSpacing: -1.4, marginBottom: 13 },
  meta: { fontSize: 15, color: colors.muted, marginBottom: 17 }, reasonLink: { fontFamily: type.semibold, color: colors.violet, fontSize: 14, marginBottom: 14 },
  reason: { color: colors.muted, fontSize: 14, marginBottom: 15 }, support: { fontFamily: type.regular, color: colors.muted, fontSize: 15, lineHeight: 24 },
  nextArea: { marginTop: 32 }, nextItem: { color: colors.ink, fontSize: 16, marginBottom: 10 }, bottomAction: { marginTop: 'auto', paddingTop: 24 },
  button: { minHeight: 56, backgroundColor: colors.ink, borderRadius: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22, marginTop: 14 },
  buttonText: { fontFamily: type.semibold, color: colors.white, fontSize: 16 }, quietButton: { backgroundColor: colors.violetSoft }, quietButtonText: { color: colors.ink }, disabledButton: { opacity: .45 },
  actionLink: { minHeight: 48, justifyContent: 'center', alignSelf: 'flex-start' }, back: { fontFamily: type.medium, color: colors.violetDeep, fontSize: 14 }, captureOrb: { alignSelf: 'center', marginTop: 68, marginBottom: 38 }, receiptOrb: { alignSelf: 'center', marginTop: 36, marginBottom: 34 },
  pageTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 34, letterSpacing: -1.3, marginBottom: 12 },
  dumpInput: { minHeight: 210, borderRadius: 26, backgroundColor: '#FFFFFF', padding: 20, fontSize: 18, color: colors.ink, marginTop: 30, marginBottom: 10, lineHeight: 26 },
  demoLink: { color: colors.violet, fontSize: 14, alignSelf: 'center', marginTop: 22 },
  receiptList: { marginTop: 28, marginBottom: 8 }, receiptRow: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 20, marginBottom: 10 },
  receiptTitle: { fontSize: 17, fontWeight: '600', color: colors.ink, minHeight: 32 }, receiptMeta: { fontSize: 13, color: colors.muted, marginTop: 3 },
  error: { fontFamily: type.medium, color: colors.error, fontSize: 14, lineHeight: 22, marginTop: 18 },
  reminderLink: { color: colors.violet, textAlign: 'center', fontSize: 14, marginTop: 12 }, reminderState: { color: colors.muted, fontSize: 13, marginTop: 12 },
  labLink: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 25 }, labStatus: { fontFamily: type.regular, color: colors.violet, fontSize: 16, lineHeight: 24, marginTop: 30, marginBottom: 20 },
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

