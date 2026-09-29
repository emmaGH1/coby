import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { RankedItem } from '../domain/ranking';
import { reasonText } from '../domain/ranking';
import type { CobyItem } from '../domain/types';
import { CobyOrb, type OrbState } from './CobyOrb';
import { ArrowIcon, CheckIcon, MicIcon } from './icons';
import { colors, radius, type } from './theme';

type Props = {
  dump: string;
  onChangeDump: (value: string) => void;
  onUnderstand: () => void;
  onToggleVoice: () => void;
  listening: boolean;
  busy: boolean;
  error: string | null;
  now?: RankedItem;
  next: RankedItem[];
  showReason: boolean;
  onToggleReason: () => void;
  onStartFocus: (item: CobyItem) => void;
  onComplete: () => void;
  onGentle: (item: CobyItem) => void;
  onPersistent: (item: CobyItem) => void;
  onOpenPlan: () => void;
  onOpenLab: () => void;
  showLab: boolean;
  dueText: (item: { dueAt: string | null; dueDate: string | null }) => string;
};

function ActionButton({ label, onPress, quiet = false, disabled = false, icon }: { label: string; onPress: () => void; quiet?: boolean; disabled?: boolean; icon?: ReactNode }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [styles.actionButton, quiet && styles.actionQuiet, pressed && styles.pressed, disabled && styles.disabled]}>
    {icon}<Text style={[styles.actionLabel, quiet && styles.actionQuietLabel]}>{label}</Text>
  </Pressable>;
}

function CaptureComposer({ dump, onChangeDump, onUnderstand, onToggleVoice, listening, busy, error, expanded }: Pick<Props, 'dump' | 'onChangeDump' | 'onUnderstand' | 'onToggleVoice' | 'listening' | 'busy' | 'error'> & { expanded: boolean }) {
  const orbState: OrbState = listening ? 'listening' : busy ? 'thinking' : dump.trim() ? 'settled' : 'idle';
  const canUnderstand = dump.trim().length > 0 && !busy && !listening;
  return <View style={[styles.composer, expanded && styles.composerExpanded]}>
    <View style={styles.composerLead}>
      <CobyOrb size={expanded ? 72 : 54} state={orbState} />
      <View style={styles.composerCopy}>
        <Text style={styles.composerTitle}>{listening ? 'I’m listening.' : busy ? 'Making sense of it…' : 'What can I hold?'}</Text>
        <Text style={styles.composerHint}>{listening ? 'Say it as it comes. Tap Done when you’re finished.' : 'Say everything. Messy is fine.'}</Text>
      </View>
    </View>
    <TextInput
      accessibilityLabel="Brain dump"
      editable={!busy && !listening}
      multiline
      onChangeText={onChangeDump}
      placeholder="I need to call Mum, submit the form by Friday, and remember…"
      placeholderTextColor="#858079"
      style={[styles.input, expanded && styles.inputExpanded]}
      textAlignVertical="top"
      value={dump}
    />
    <View style={styles.composerActions}>
      <Pressable accessibilityRole="button" accessibilityLabel={listening ? 'Finish voice dump' : 'Start voice dump'} disabled={busy} onPress={onToggleVoice}
        style={({ pressed }) => [styles.micButton, listening && styles.micButtonActive, busy && styles.disabled, pressed && !busy && styles.pressed]}>
        <MicIcon active={listening} />
        <Text style={[styles.micLabel, listening && styles.micLabelActive]}>{listening ? 'Done' : 'Speak'}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Let Coby understand this" disabled={!canUnderstand} onPress={onUnderstand}
        style={({ pressed }) => [styles.sendButton, !canUnderstand && styles.sendDisabled, pressed && canUnderstand && styles.pressed]}>
        <Text style={[styles.sendLabel, !canUnderstand && styles.sendLabelDisabled]}>{busy ? 'Holding…' : 'Let Coby hold it'}</Text>
        <ArrowIcon color={canUnderstand ? colors.white : '#8A847C'} />
      </Pressable>
    </View>
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
  </View>;
}

export function HomeScreen(props: Props) {
  const hasItems = Boolean(props.now || props.next.length);
  return <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <View style={styles.header}>
      <View><Text style={styles.wordmark}>coby</Text><Text style={styles.motto}>carry less.</Text></View>
      <Pressable accessibilityRole="button" accessibilityLabel="Open Plan" hitSlop={4} onPress={props.onOpenPlan} style={styles.planButton}>
        <Text style={styles.planButtonText}>Plan</Text><ArrowIcon color={colors.violetDeep} />
      </Pressable>
    </View>

    {!hasItems && <View style={styles.arrivalCopy}>
      <Text style={styles.hero}>Out of your head.</Text>
      <Text style={styles.heroSoft}>Into good hands.</Text>
    </View>}

    <CaptureComposer {...props} expanded={!hasItems} />

    <View style={styles.rule} />
    <Text style={styles.sectionLabel}>NOW</Text>
    {props.now ? <>
      <Text style={styles.nowTitle}>{props.now.item.title}</Text>
      {(props.now.item.dueAt || props.now.item.dueDate) && <Text style={styles.due}>Due {props.dueText(props.now.item)}</Text>}
      <Pressable accessibilityRole="button" accessibilityLabel="Explain why this is now" onPress={props.onToggleReason} style={styles.reasonButton}>
        <Text style={styles.reasonLink}>{props.showReason ? 'Hide reason' : 'Why this now?'}</Text>
      </Pressable>
      {props.showReason && <Text style={styles.reason}>{reasonText(props.now.reasonCodes)}</Text>}
      <View style={styles.nowActions}>
        <ActionButton label={props.busy ? 'Starting…' : 'Start focus'} disabled={props.busy} onPress={() => props.onStartFocus(props.now!.item)} />
        <ActionButton label="Done" disabled={props.busy} quiet onPress={props.onComplete} icon={<CheckIcon />} />
      </View>
      {props.now.item.dueAt && <View style={styles.reminderRow}>
        {props.now.item.commitmentMode === 'none' && <Pressable accessibilityRole="button" onPress={() => props.onGentle(props.now!.item)} style={styles.reminderButton}><Text style={styles.reminderLink}>Keep me gently on track</Text></Pressable>}
        {props.now.item.commitmentMode === 'gentle' && <Text style={styles.reminderState}>Gentle reminders on</Text>}
        {props.now.item.commitmentMode !== 'persistent' && <Pressable accessibilityRole="button" onPress={() => props.onPersistent(props.now!.item)} style={styles.reminderButton}><Text style={styles.reminderLink}>Persistent · Plus</Text></Pressable>}
        {props.now.item.commitmentMode === 'persistent' && <Text style={styles.reminderState}>Persistent reminders on</Text>}
      </View>}
    </> : <View style={styles.clearState}>
      <Text style={styles.clearTitle}>You’re clear for now.</Text>
      <Text style={styles.clearCopy}>When something comes to mind, leave it with Coby above.</Text>
    </View>}

    {props.next.length > 0 && <View style={styles.nextSection}>
      <Text style={styles.sectionLabel}>NEXT</Text>
      {props.next.map(({ item }, index) => <View key={item.id} style={[styles.nextRow, index === props.next.length - 1 && styles.nextRowLast]}>
        <Text style={styles.nextNumber}>0{index + 1}</Text>
        <View style={styles.nextCopy}><Text style={styles.nextTitle}>{item.title}</Text>{(item.dueAt || item.dueDate) && <Text style={styles.nextDue}>{props.dueText(item)}</Text>}</View>
      </View>)}
      <Text style={styles.heldCopy}>Everything else is safe in Plan.</Text>
    </View>}

    {props.showLab && <Pressable accessibilityRole="button" onPress={props.onOpenLab}><Text style={styles.labLink}>Coby Lab</Text></Pressable>}
  </ScrollView>;
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 22, paddingBottom: 40, backgroundColor: colors.paper },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 34 },
  wordmark: { color: colors.ink, fontFamily: type.bold, fontSize: 30, letterSpacing: -1.5, lineHeight: 31 },
  motto: { color: colors.muted, fontFamily: type.medium, fontSize: 11, letterSpacing: 0.1, marginTop: 2 },
  planButton: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 7, paddingLeft: 16, paddingRight: 13, borderRadius: radius.pill, backgroundColor: colors.violetMist },
  planButtonText: { color: colors.violetDeep, fontFamily: type.semibold, fontSize: 14 },
  arrivalCopy: { marginTop: 10, marginBottom: 30 },
  hero: { color: colors.ink, fontFamily: type.bold, fontSize: 39, lineHeight: 44, letterSpacing: -1.8 },
  heroSoft: { color: colors.violetDeep, fontFamily: type.medium, fontSize: 39, lineHeight: 44, letterSpacing: -1.8 },
  composer: { backgroundColor: colors.paperRaised, borderRadius: radius.large, padding: 18, shadowColor: '#4A4035', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 4 },
  composerExpanded: { padding: 20 },
  composerLead: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  composerCopy: { flex: 1 },
  composerTitle: { color: colors.ink, fontFamily: type.semibold, fontSize: 19, letterSpacing: -0.4 },
  composerHint: { color: colors.muted, fontFamily: type.regular, fontSize: 13, lineHeight: 18, marginTop: 3 },
  input: { minHeight: 74, color: colors.ink, fontFamily: type.regular, fontSize: 16, lineHeight: 23, paddingHorizontal: 2, paddingTop: 16, paddingBottom: 12 },
  inputExpanded: { minHeight: 122, fontSize: 18, lineHeight: 26, paddingTop: 22 },
  composerActions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  micButton: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: radius.pill, paddingHorizontal: 15, backgroundColor: colors.violetSoft },
  micButtonActive: { backgroundColor: colors.violet },
  micLabel: { color: colors.ink, fontFamily: type.semibold, fontSize: 14 },
  micLabelActive: { color: colors.white },
  sendButton: { minHeight: 48, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: radius.pill, paddingLeft: 18, paddingRight: 14, backgroundColor: colors.ink },
  sendDisabled: { backgroundColor: colors.hairline },
  sendLabel: { color: colors.white, fontFamily: type.semibold, fontSize: 14 },
  sendLabelDisabled: { color: '#8A847C' },
  error: { color: colors.error, fontFamily: type.medium, fontSize: 13, lineHeight: 18, marginTop: 14 },
  rule: { height: 1, backgroundColor: colors.hairline, marginTop: 36, marginBottom: 28 },
  sectionLabel: { color: colors.violetDeep, fontFamily: type.bold, fontSize: 11, letterSpacing: 2.1, marginBottom: 14 },
  nowTitle: { color: colors.ink, fontFamily: type.semibold, fontSize: 31, lineHeight: 37, letterSpacing: -1.3, maxWidth: '94%' },
  due: { color: colors.muted, fontFamily: type.regular, fontSize: 14, marginTop: 10 },
  reasonButton: { minHeight: 48, alignSelf: 'flex-start', justifyContent: 'center', marginTop: 4 },
  reasonLink: { color: colors.violetDeep, fontFamily: type.semibold, fontSize: 13, textDecorationLine: 'underline', textDecorationColor: '#B9ADD9' },
  reason: { color: colors.muted, fontFamily: type.regular, fontSize: 13, lineHeight: 19, marginTop: 9 },
  nowActions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  actionButton: { minHeight: 50, flex: 1, borderRadius: radius.pill, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, paddingHorizontal: 18 },
  actionQuiet: { backgroundColor: colors.violetSoft },
  actionLabel: { color: colors.white, fontFamily: type.semibold, fontSize: 14 },
  actionQuietLabel: { color: colors.ink },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.4 },
  reminderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 15 },
  reminderButton: { minHeight: 48, justifyContent: 'center' },
  reminderLink: { color: colors.violetDeep, fontFamily: type.medium, fontSize: 12 },
  reminderState: { minHeight: 48, color: colors.muted, fontFamily: type.medium, fontSize: 12, textAlignVertical: 'center' },
  clearState: { paddingVertical: 8, paddingBottom: 12 },
  clearTitle: { color: colors.ink, fontFamily: type.semibold, fontSize: 28, letterSpacing: -1 },
  clearCopy: { color: colors.muted, fontFamily: type.regular, fontSize: 15, lineHeight: 22, marginTop: 8, maxWidth: 290 },
  nextSection: { marginTop: 36 },
  nextRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.hairline },
  nextRowLast: { borderBottomWidth: 0 },
  nextNumber: { width: 35, color: colors.violetDeep, fontFamily: type.semibold, fontSize: 11, marginTop: 3 },
  nextCopy: { flex: 1 },
  nextTitle: { color: colors.ink, fontFamily: type.medium, fontSize: 16, lineHeight: 22 },
  nextDue: { color: colors.muted, fontFamily: type.regular, fontSize: 12, marginTop: 4 },
  heldCopy: { color: colors.muted, fontFamily: type.regular, fontSize: 12, marginTop: 10 },
  labLink: { color: colors.muted, fontFamily: type.medium, fontSize: 11, textAlign: 'center', marginTop: 25 },
});
