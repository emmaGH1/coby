import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { RankedItem } from '../domain/ranking';
import { reasonText } from '../domain/ranking';
import type { CobyItem } from '../domain/types';
import { CobyOrb, type OrbState } from './CobyOrb';
import { ArrowIcon, CheckIcon, MicIcon, PencilIcon, SettingsIcon, StopIcon } from './icons';
import { BottomNav } from './BottomNav';
import { colors, radius, type } from './theme';
import type { VoicePhase } from '../voice/session';

type Props = {
  dump: string;
  onChangeDump: (value: string) => void;
  onUnderstand: () => void;
  onKeepUnparsed?: () => void;
  onToggleVoice: () => void;
  listening: boolean;
  voicePhase: VoicePhase;
  inputLevel: number;
  voiceNotice?: string | null;
  preparingVoice?: boolean;
  onPrepareOfflineVoice?: () => void;
  busy: boolean;
  error: string | null;
  now?: RankedItem;
  next: RankedItem[];
  earlierCount: number;
  onReviewEarlier: () => void;
  onEdit: (item: CobyItem) => void;
  showReason: boolean;
  onToggleReason: () => void;
  onStartFocus: (item: CobyItem) => void;
  onComplete: () => void;
  onGentle: (item: CobyItem) => void;
  onPersistent: (item: CobyItem) => void;
  onOpenPlan: () => void;
  onOpenSettings: () => void;
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

function CaptureComposer({ dump, onChangeDump, onUnderstand, onKeepUnparsed, onToggleVoice, listening, voicePhase, busy, error, onPrepareOfflineVoice, voiceNotice, preparingVoice }: Pick<Props, 'dump' | 'onChangeDump' | 'onUnderstand' | 'onKeepUnparsed' | 'onToggleVoice' | 'listening' | 'voicePhase' | 'busy' | 'error' | 'onPrepareOfflineVoice' | 'voiceNotice' | 'preparingVoice'>) {
  const [focused, setFocused] = useState(false);
  const canUnderstand = dump.trim().length > 0 && !busy && voicePhase === 'idle';
  const voiceTransition = voicePhase === 'preparing' || voicePhase === 'starting' || voicePhase === 'stopping';
  const voiceLabel = voicePhase === 'stopping' ? 'Finishing…' : voiceTransition ? 'Starting…' : listening ? 'Stop' : 'Speak';
  return <View style={styles.dock}>
    {onKeepUnparsed && <Pressable accessibilityRole="button" disabled={busy || listening || voicePhase !== 'idle'} onPress={onKeepUnparsed} style={styles.reasonButton}><Text style={styles.reasonLink}>Keep as one item</Text></Pressable>}
    {voiceNotice && <Text accessibilityLiveRegion="polite" style={styles.voiceNotice}>{voiceNotice}</Text>}
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    {onPrepareOfflineVoice && <Pressable accessibilityRole="button" disabled={busy || preparingVoice || voicePhase !== 'idle'} onPress={onPrepareOfflineVoice} style={styles.voiceRecovery}><Text style={styles.reasonLink}>{preparingVoice ? 'Preparing English voice…' : 'Enable offline English voice'}</Text></Pressable>}
    <View style={styles.composer}>
      <TextInput accessibilityLabel="Brain dump" editable={!busy && voicePhase === 'idle'} multiline
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onChangeText={onChangeDump}
        placeholder={listening ? 'Your words will appear here…' : 'What’s on your mind?'}
        placeholderTextColor={colors.muted} style={[styles.input, (focused || dump.length > 0 || listening) && styles.inputExpanded]}
        textAlignVertical="top" value={dump} />
      <View style={[styles.composerActions,listening && styles.speakingActions]}>
        <Pressable accessibilityRole="button" accessibilityLabel={voiceLabel === 'Speak' ? 'Start voice dump' : voiceLabel === 'Stop' ? 'Finish voice dump' : voiceLabel} disabled={busy || voiceTransition || preparingVoice} onPress={onToggleVoice}
          style={({ pressed }) => [styles.micButton, listening && styles.micButtonActive, (busy || voiceTransition || preparingVoice) && styles.disabled, pressed && styles.pressed]}>
          {listening ? <StopIcon/> : <MicIcon/>}<Text style={[styles.micLabel, listening && styles.micLabelActive]}>{voiceLabel}</Text>
        </Pressable>
        {!listening && <><Text style={styles.dockHint}>Messy is fine.</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Let Coby understand this" disabled={!canUnderstand} onPress={onUnderstand}
          style={({ pressed }) => [styles.sendButton, !canUnderstand && styles.sendDisabled, pressed && canUnderstand && styles.pressed]}>
          <ArrowIcon color={canUnderstand ? colors.white : colors.muted} />
        </Pressable></>}
      </View>
    </View>
  </View>;
}

export function HomeScreen(props: Props) {
  const hasItems = Boolean(props.now || props.next.length);
  const orbState: OrbState = props.listening ? 'listening' : props.busy ? 'thinking' : props.dump.trim() ? 'settled' : 'idle';
  return <View style={styles.screen}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
    <View style={styles.header}>
      <Text style={styles.wordmark}>coby</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Settings" hitSlop={4} onPress={props.onOpenSettings} style={styles.settingsButton}>
        <SettingsIcon />
      </Pressable>
    </View>

    <View style={[styles.companion, (!hasItems || props.listening) && styles.companionEmpty]}>
      <CobyOrb size={hasItems && !props.listening ? 180 : 268} state={orbState} inputLevel={props.inputLevel} />
      <Text style={styles.companionTitle}>{props.listening ? 'I’m listening.' : props.busy ? 'Making sense of it…' : hasItems ? 'One thing at a time.' : 'Out of your head.'}</Text>
      <Text style={styles.companionHint}>{props.listening ? 'Say it as it comes.' : hasItems ? 'The rest is held.' : 'Into good hands.'}</Text>
    </View>

    {!props.listening && <>
    {hasItems && <View style={styles.rule} />}
    {props.now && <Text style={styles.sectionLabel}>NOW</Text>}
    {props.now ? <>
      <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${props.now.item.title}`} disabled={props.busy} onPress={() => props.onEdit(props.now!.item)} style={styles.itemDetails}>
        <View style={styles.nowCopy}><Text style={styles.nowTitle}>{props.now.item.title}</Text>
        {(props.now.item.dueAt || props.now.item.dueDate) && <Text style={styles.due}>Due {props.dueText(props.now.item)}</Text>}</View><PencilIcon />
      </Pressable>
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
      <Text style={styles.clearCopy}>Say it or type it below. Coby will hold it from here.</Text>
    </View>}

    {props.next.length > 0 && <View style={styles.nextSection}>
      <Text style={styles.sectionLabel}>NEXT</Text>
      {props.next.map(({ item }, index) => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Edit ${item.title}`} disabled={props.busy} onPress={() => props.onEdit(item)} style={[styles.nextRow, index === props.next.length - 1 && styles.nextRowLast]}>
        <Text style={styles.nextNumber}>0{index + 1}</Text>
        <View style={styles.nextCopy}><Text style={styles.nextTitle}>{item.title}</Text>{(item.dueAt || item.dueDate) && <Text style={styles.nextDue}>{props.dueText(item)}</Text>}</View>
        <PencilIcon />
      </Pressable>)}
      <Text style={styles.heldCopy}>Everything else is safe in Plan.</Text>
    </View>}

    {props.earlierCount > 0 && <Pressable accessibilityRole="button" onPress={props.onReviewEarlier} style={styles.earlierReview}><Text style={styles.reasonLink}>{props.earlierCount} {props.earlierCount === 1 ? 'item from earlier needs' : 'items from earlier need'} a new plan</Text><Text style={styles.heldCopy}>Still held. Review when you’re ready.</Text></Pressable>}
    </>}
  </ScrollView><CaptureComposer {...props} /><BottomNav current="home" onHome={() => {}} onPlan={props.onOpenPlan} /></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  page: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 18, paddingBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  wordmark: { color: colors.ink, fontFamily: type.bold, fontSize: 30, letterSpacing: -1.5, lineHeight: 31 },
  settingsButton: { minHeight:48, width:48, alignItems:'center', justifyContent:'center' },
  itemDetails: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', minHeight: 48 }, nowCopy: { flex: 1 },
  earlierReview: { marginTop: 24, minHeight: 48, paddingVertical: 12 },
  motto: { color: colors.muted, fontFamily: type.medium, fontSize: 14, letterSpacing: 0.1, marginTop: 2 },
  planButton: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 7, paddingLeft: 16, paddingRight: 13, borderRadius: radius.pill, backgroundColor: colors.violetMist },
  planButtonText: { color: colors.violetDeep, fontFamily: type.semibold, fontSize: 14 },
  companion: { alignItems: 'center', paddingVertical: 12 },
  companionEmpty: { flex: 1, justifyContent: 'center', paddingTop: 24, paddingBottom: 24 },
  companionTitle: { color: colors.ink, fontFamily: type.semibold, fontSize: 26, lineHeight: 34, letterSpacing: -0.7, textAlign: 'center', marginTop: 14 },
  companionHint: { color: colors.muted, fontFamily: type.regular, fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: 4 },
  voiceNotice: { color: colors.violetDeep, fontFamily: type.medium, fontSize: 14, lineHeight: 18, marginBottom: 10 },
  voiceRecovery: { minHeight: 48, justifyContent: 'center', alignSelf: 'flex-start' },
  dock: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 18, backgroundColor: colors.paper },
  composer: { backgroundColor: colors.paperRaised, borderRadius: 24, padding: 12, borderWidth: 1, borderColor: colors.hairline },
  input: { minHeight: 42, maxHeight: 130, color: colors.ink, fontFamily: type.regular, fontSize: 16, lineHeight: 24, paddingHorizontal: 8, paddingTop: 8, paddingBottom: 8 },
  inputExpanded: { minHeight: 80 },
  composerActions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  micButton: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: radius.pill, paddingHorizontal: 14, backgroundColor: colors.violetSoft },
  micButtonActive: { backgroundColor: colors.violet, width:64, height:64, borderRadius:32, flexDirection:'column', justifyContent:'center', gap:3 },
  speakingActions: { justifyContent:'center' },
  micLabel: { color: colors.ink, fontFamily: type.semibold, fontSize: 16 },
  micLabelActive: { color: colors.white },
  dockHint: { flex: 1, color: colors.muted, fontFamily: type.regular, fontSize: 14, textAlign: 'center' },
  sendButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill, backgroundColor: colors.ink },
  sendDisabled: { backgroundColor: colors.paper },
  error: { color: colors.error, fontFamily: type.medium, fontSize: 14, lineHeight: 18, marginBottom: 10 },
  rule: { height: 1, backgroundColor: colors.hairline, marginTop: 18, marginBottom: 20 },
  sectionLabel: { color: colors.violetDeep, fontFamily: type.bold, fontSize: 14, letterSpacing: 2.1, marginBottom: 14 },
  nowTitle: { color: colors.ink, fontFamily: type.semibold, fontSize: 31, lineHeight: 37, letterSpacing: -1.3, maxWidth: '94%' },
  due: { color: colors.muted, fontFamily: type.regular, fontSize: 14, marginTop: 10 },
  reasonButton: { minHeight: 48, alignSelf: 'flex-start', justifyContent: 'center', marginTop: 4 },
  reasonLink: { color: colors.violetDeep, fontFamily: type.semibold, fontSize: 14, textDecorationLine: 'underline', textDecorationColor: '#B9ADD9' },
  reason: { color: colors.muted, fontFamily: type.regular, fontSize: 14, lineHeight: 19, marginTop: 9 },
  nowActions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  actionButton: { minHeight: 50, flex: 1, borderRadius: radius.pill, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, paddingHorizontal: 18 },
  actionQuiet: { backgroundColor: colors.violetSoft },
  actionLabel: { color: colors.white, fontFamily: type.semibold, fontSize: 16 },
  actionQuietLabel: { color: colors.ink },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.4 },
  reminderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 15 },
  reminderButton: { minHeight: 48, justifyContent: 'center' },
  reminderLink: { color: colors.violetDeep, fontFamily: type.medium, fontSize: 14 },
  reminderState: { minHeight: 48, color: colors.muted, fontFamily: type.medium, fontSize: 14, textAlignVertical: 'center' },
  clearState: { paddingVertical: 8, paddingBottom: 12 },
  clearTitle: { color: colors.ink, fontFamily: type.semibold, fontSize: 28, letterSpacing: -1 },
  clearCopy: { textAlign: 'center', alignSelf: 'center', color: colors.muted, fontFamily: type.regular, fontSize: 15, lineHeight: 22, marginTop: 8, maxWidth: 290 },
  nextSection: { marginTop: 36 },
  nextRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.hairline },
  nextRowLast: { borderBottomWidth: 0 },
  nextNumber: { width: 35, color: colors.violetDeep, fontFamily: type.semibold, fontSize: 14, marginTop: 3 },
  nextCopy: { flex: 1 },
  nextTitle: { color: colors.ink, fontFamily: type.medium, fontSize: 16, lineHeight: 22 },
  nextDue: { color: colors.muted, fontFamily: type.regular, fontSize: 14, marginTop: 4 },
  heldCopy: { color: colors.muted, fontFamily: type.regular, fontSize: 14, marginTop: 10 },
  labLink: { color: colors.muted, fontFamily: type.medium, fontSize: 14, textAlign: 'center', marginTop: 8 },
});
