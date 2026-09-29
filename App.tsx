import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { DemoClock, SystemClock, type Clock } from './src/domain/clock';
import { DEMO_DUMP, FixtureBrainDumpParser } from './src/domain/parser';
import { rankItems, reasonText } from './src/domain/ranking';
import type { CobyItem, ParsedItem } from './src/domain/types';
import { clearItems, completeItem, listItems, saveItems } from './src/data/items';
import { clearAllCobyNudges, syncItemNudges, triggerLabNudge } from './src/notifications/scheduler';

type Screen = 'arrival' | 'home' | 'capture' | 'receipt' | 'plan' | 'focus' | 'lab';
const clock = new SystemClock();
const parser = new FixtureBrainDumpParser();

function CobyOrb({ size = 112 }: { size?: number }) {
  return <View style={[styles.orbOuter, { width: size, height: size, borderRadius: size / 2 }]}>
    <View style={[styles.orbInner, { width: size * .65, height: size * .65, borderRadius: size }]} />
  </View>;
}

function Button({ label, onPress, kind = 'primary', disabled = false }: { label: string; onPress: () => void; kind?: 'primary' | 'quiet'; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress}
    style={[styles.button, kind === 'quiet' && styles.quietButton, disabled && styles.disabledButton]}>
    <Text style={[styles.buttonText, kind === 'quiet' && styles.quietButtonText]}>{label}</Text>
  </Pressable>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('arrival');
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

  useEffect(() => {
    listItems().then((stored) => { setItems(stored); setScreen(stored.length ? 'home' : 'arrival'); })
      .catch(() => setError('Coby could not open local storage. Please restart the app.'))
      .finally(() => setLoading(false));
  }, []);

  const ranked = useMemo(() => rankItems(items, activeClock), [items, activeClock]);
  const now = ranked[0];
  const next = ranked.slice(1, 3);

  async function understand() {
    setError(null);
    setBusy(true);
    try {
      const result = await parser.parse(dump, { clock: activeClock, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
      if (!result.items.length) { setError('Write what is on your mind first.'); return; }
      setDraft(result.items);
      setScreen('receipt');
    } catch { setError('Coby could not understand that yet. Your words are still here.'); }
    finally { setBusy(false); }
  }

  async function holdItems() {
    setError(null);
    setBusy(true);
    try {
      const timestamp = activeClock.now().toISOString();
      const captured = draft.map((entry, index): CobyItem => ({
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
    try { await completeItem(now.item, activeClock.now().toISOString()); await syncItemNudges({ ...now.item, status: 'completed' }, activeClock); setItems(await listItems()); setShowReason(false); }
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
      await syncItemNudges({ ...focusItem, status: 'completed' }, activeClock);
      setItems(await listItems()); setFocusItem(null); setScreen('home'); setShowReason(false);
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

  async function setGentle(item: CobyItem) {
    setError(null); setBusy(true);
    try {
      const changed: CobyItem = { ...item, commitmentMode: 'gentle' };
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
      const result = await parser.parse(DEMO_DUMP, { clock: activeClock, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
      const timestamp = activeClock.now().toISOString();
      const seeded = result.items.map((entry, index): CobyItem => ({ ...entry,
        id: `demo-${activeClock.now().getTime()}-${index}`, sourceText: DEMO_DUMP,
        createdAt: timestamp, status: 'captured', commitmentMode: 'none', completedAt: null,
      }));
      await saveItems(seeded); setItems(await listItems()); setLabMessage('Demo items seeded.');
    } catch { setError('Could not seed demo data.'); }
    finally { setBusy(false); }
  }

  async function clearLab() {
    setBusy(true); setError(null);
    try { await clearItems(); await clearAllCobyNudges(); setItems([]); setLabMessage('Local items cleared.'); }
    catch { setError('Could not clear local items.'); }
    finally { setBusy(false); }
  }

  async function nudgeLab() {
    if (!now) { setLabMessage('Seed an item first.'); return; }
    try { await triggerLabNudge(now.item); setLabMessage('A local nudge is queued for two seconds from now.'); }
    catch { setLabMessage('Notification permission is needed on an Android device.'); }
  }

  if (loading) return <View style={styles.loading}><ActivityIndicator color={colors.violet} /></View>;

  return <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      {screen === 'arrival' && <View style={styles.arrival}>
        <Text style={styles.wordmark}>coby</Text>
        <CobyOrb size={150} />
        <Text style={styles.hero}>carry less.</Text>
        <Text style={styles.subhead}>Out of your head. Into good hands.</Text>
        <Button label="Come in" onPress={() => setScreen('home')} />
      </View>}

      {screen === 'home' && <>
        <View style={styles.topline}><Text style={styles.wordmark}>coby</Text><Text style={styles.motto}>carry less.</Text></View>
        <View style={styles.homeOrb}><CobyOrb /></View>
        <Text style={styles.kicker}>NOW</Text>
        {now ? <>
          <Text style={styles.nowTitle}>{now.item.title}</Text>
          {now.item.dueAt && <Text style={styles.meta}>Due {new Date(now.item.dueAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</Text>}
          <Pressable accessibilityRole="button" onPress={() => setShowReason(!showReason)}><Text style={styles.reasonLink}>Why this now?</Text></Pressable>
          {showReason && <Text style={styles.reason}>{reasonText(now.reasonCodes)}</Text>}
          <Button label={busy ? 'Starting…' : 'Start focus'} disabled={busy} onPress={() => startFocus(now.item)} />
          <Button label="Mark complete" kind="quiet" disabled={busy} onPress={finishNow} />
          {now.item.commitmentMode === 'none' && now.item.dueAt && <Pressable accessibilityRole="button" onPress={() => setGentle(now.item)}><Text style={styles.reminderLink}>Keep me gently on track</Text></Pressable>}
          {now.item.commitmentMode === 'gentle' && <Text style={styles.reminderState}>Gentle reminders are on.</Text>}
        </> : <>
          <Text style={styles.nowTitle}>You’re clear for now.</Text>
          <Text style={styles.support}>Coby is ready when something comes to mind.</Text>
        </>}
        {next.length > 0 && <View style={styles.nextArea}>
          <Text style={styles.kicker}>NEXT</Text>
          {next.map(({ item }) => <Text key={item.id} style={styles.nextItem}>·  {item.title}</Text>)}
          <Text style={styles.support}>Everything else is safe with Coby.</Text>
        </View>}
        <View style={styles.bottomAction}><Button label="Get it out of my head" onPress={() => { setError(null); setScreen('capture'); }} />
          <Pressable accessibilityRole="button" onPress={() => setScreen('plan')}><Text style={styles.planLink}>See your plan →</Text></Pressable>
          {__DEV__ && <Pressable accessibilityRole="button" onPress={() => setScreen('lab')}><Text style={styles.labLink}>Coby Lab</Text></Pressable>}
        </View>
      </>}

      {screen === 'lab' && __DEV__ && <>
        <Pressable onPress={() => setScreen('home')} accessibilityRole="button"><Text style={styles.back}>← Home</Text></Pressable>
        <Text style={[styles.pageTitle, styles.planTitle]}>Coby Lab</Text>
        <Text style={styles.support}>Local demo controls. Nothing here is sent online.</Text>
        <Text style={styles.labStatus}>{labMessage}</Text>
        <Text style={styles.support}>Clock: {activeClock.now().toLocaleString()}</Text>
        <Button label="Seed demo data" disabled={busy} onPress={seedLab} />
        <Button label="Advance time by 60 minutes" disabled={busy} kind="quiet" onPress={() => { const demo = new DemoClock(activeClock.now()); demo.advanceMinutes(60); setActiveClock(demo); setLabMessage('Demo clock advanced by one hour.'); }} />
        <Button label="Trigger next nudge" disabled={busy} kind="quiet" onPress={nudgeLab} />
        <Button label="Use fixture parser" kind="quiet" onPress={() => setLabMessage('Fixture parser is active.')} />
        <Button label="RevenueCat state" kind="quiet" onPress={() => setLabMessage('RevenueCat is not connected yet.')} />
        <Button label="Clear local data" disabled={busy} kind="quiet" onPress={clearLab} />
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
          const shown = planMode === 'list' ? openItems : openItems.filter((item) => item.dueAt && new Date(item.dueAt).toDateString() === selectedDay);
          return shown.length ? shown.map((item) => <View key={item.id} style={styles.planRow}>
            <Text style={styles.planItemTitle}>{item.title}</Text>
            <Text style={styles.receiptMeta}>{item.dueAt ? new Date(item.dueAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'No time set'}</Text>
            <Pressable accessibilityRole="button" onPress={() => startFocus(item)}><Text style={styles.reasonLink}>Focus on this →</Text></Pressable>
          </View>) : <Text style={styles.planEmpty}>Nothing here. Coby is holding the rest.</Text>;
        })()}
        {planMode === 'calendar' && <Text style={styles.support}>Items without a time are in List.</Text>}
        <View style={styles.bottomAction}><Button label="Add more" onPress={() => setScreen('capture')} /></View>
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

      {screen === 'capture' && <>
        <Pressable onPress={() => setScreen('home')} accessibilityRole="button"><Text style={styles.back}>← Home</Text></Pressable>
        <View style={styles.captureOrb}><CobyOrb size={88} /></View>
        <Text style={styles.pageTitle}>What’s on your mind?</Text>
        <Text style={styles.support}>Put it all here. Coby will hold it.</Text>
        <TextInput style={styles.dumpInput} multiline placeholder="I need to finish my assignment tomorrow…"
          placeholderTextColor="#8E8B92" value={dump} onChangeText={setDump} accessibilityLabel="Brain dump" textAlignVertical="top" />
        <Button label={busy ? 'Understanding…' : 'Understand'} onPress={understand} disabled={busy} />
        <Pressable accessibilityRole="button" onPress={() => setDump(DEMO_DUMP)}><Text style={styles.demoLink}>Use a sample dump</Text></Pressable>
      </>}

      {screen === 'receipt' && <>
        <Pressable onPress={() => setScreen('capture')} accessibilityRole="button"><Text style={styles.back}>← Edit dump</Text></Pressable>
        <View style={styles.receiptOrb}><CobyOrb size={72} /></View>
        <Text style={styles.pageTitle}>I’ve got it.</Text>
        <Text style={styles.support}>I’m holding {draft.length} {draft.length === 1 ? 'thing' : 'things'}. Tap a title to correct it.</Text>
        <View style={styles.receiptList}>{draft.map((entry, index) => <View style={styles.receiptRow} key={index}>
          <TextInput style={styles.receiptTitle} value={entry.title} accessibilityLabel={`Item ${index + 1} title`}
            onChangeText={(title) => setDraft((current) => current.map((item, i) => i === index ? { ...item, title } : item))} />
          <Text style={styles.receiptMeta}>{entry.dueAt ? new Date(entry.dueAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'No time set'}</Text>
        </View>)}</View>
        <Button label={busy ? 'Saving…' : 'Looks right'} onPress={holdItems} disabled={busy || draft.some((entry) => !entry.title.trim())} />
        <Button label="Edit what I said" kind="quiet" onPress={() => setScreen('capture')} />
      </>}

      {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    </ScrollView>
  </KeyboardAvoidingView>;
}

const colors = { background: '#F7F6F2', ink: '#1A1A19', violet: '#7464B5', violetSoft: '#E9E4F6', muted: '#77727A' };
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background }, loading: { flex: 1, justifyContent: 'center', backgroundColor: colors.background },
  page: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 58, paddingBottom: 42 },
  wordmark: { color: colors.ink, fontSize: 31, fontWeight: '700', letterSpacing: -2 },
  motto: { fontSize: 14, color: colors.muted }, topline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  arrival: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 25 },
  hero: { color: colors.ink, fontSize: 42, fontWeight: '700', letterSpacing: -2.2, marginTop: 10 },
  subhead: { color: colors.muted, fontSize: 16, textAlign: 'center', marginBottom: 28 },
  orbOuter: { backgroundColor: '#DFD7F3', alignItems: 'center', justifyContent: 'center', shadowColor: colors.violet, shadowOpacity: .14, shadowRadius: 22, elevation: 6 },
  orbInner: { backgroundColor: '#A898D1' }, homeOrb: { alignItems: 'center', marginTop: 64, marginBottom: 58 },
  kicker: { fontSize: 12, fontWeight: '700', color: colors.violet, letterSpacing: 2.2, marginBottom: 15 },
  nowTitle: { fontSize: 34, lineHeight: 40, fontWeight: '600', color: colors.ink, letterSpacing: -1.4, marginBottom: 13 },
  meta: { fontSize: 15, color: colors.muted, marginBottom: 17 }, reasonLink: { color: colors.violet, fontSize: 14, fontWeight: '600', marginBottom: 14 },
  reason: { color: colors.muted, fontSize: 14, marginBottom: 15 }, support: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  nextArea: { marginTop: 44 }, nextItem: { color: colors.ink, fontSize: 16, marginBottom: 14 }, bottomAction: { marginTop: 'auto', paddingTop: 44 },
  button: { minHeight: 56, backgroundColor: colors.ink, borderRadius: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22, marginTop: 14 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' }, quietButton: { backgroundColor: colors.violetSoft }, quietButtonText: { color: colors.ink }, disabledButton: { opacity: .45 },
  back: { color: colors.muted, fontSize: 15 }, captureOrb: { alignSelf: 'center', marginTop: 68, marginBottom: 38 }, receiptOrb: { alignSelf: 'center', marginTop: 36, marginBottom: 34 },
  pageTitle: { color: colors.ink, fontSize: 34, fontWeight: '700', letterSpacing: -1.3, marginBottom: 12 },
  dumpInput: { minHeight: 210, borderRadius: 26, backgroundColor: '#FFFFFF', padding: 20, fontSize: 18, color: colors.ink, marginTop: 30, marginBottom: 10, lineHeight: 26 },
  demoLink: { color: colors.violet, fontSize: 14, alignSelf: 'center', marginTop: 22 },
  receiptList: { marginTop: 28, marginBottom: 8 }, receiptRow: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 20, marginBottom: 10 },
  receiptTitle: { fontSize: 17, fontWeight: '600', color: colors.ink, minHeight: 32 }, receiptMeta: { fontSize: 13, color: colors.muted, marginTop: 3 },
  error: { color: '#A24D48', fontSize: 14, marginTop: 18 },
  reminderLink: { color: colors.violet, textAlign: 'center', fontSize: 14, marginTop: 15 }, reminderState: { color: colors.muted, fontSize: 13, marginTop: 15 },
  labLink: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 25 }, labStatus: { color: colors.violet, fontSize: 16, marginTop: 30, marginBottom: 20 },
  planLink: { color: colors.violet, fontSize: 15, fontWeight: '600', textAlign: 'center', marginTop: 22 },
  planTitle: { marginTop: 55 }, modeBar: { flexDirection: 'row', backgroundColor: '#EBE8E4', borderRadius: 18, padding: 4, marginTop: 30, marginBottom: 25 },
  modeButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 15 }, modeSelected: { backgroundColor: '#FFFFFF' }, modeText: { color: colors.ink, fontSize: 15, fontWeight: '600' },
  dayStrip: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 }, dayButton: { alignItems: 'center', paddingVertical: 10, width: '13%', borderRadius: 15 },
  daySelected: { backgroundColor: colors.violetSoft }, dayText: { color: colors.muted, fontSize: 11 }, dayNumber: { color: colors.ink, fontSize: 16, fontWeight: '600', marginTop: 5 },
  planRow: { borderBottomWidth: 1, borderBottomColor: '#E6E2DD', paddingVertical: 18 }, planItemTitle: { color: colors.ink, fontSize: 18, fontWeight: '600', marginBottom: 4 },
  planEmpty: { color: colors.muted, fontSize: 16, marginVertical: 30 }, focusScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 620 },
  focusTitle: { textAlign: 'center', marginTop: 16 }, focusActions: { alignSelf: 'stretch', marginTop: 70 },
});

