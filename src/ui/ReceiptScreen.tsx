import { useRef, useState } from 'react';
import { AccessibilityInfo, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { correctReceipt, pickedDateFields, pickedTimeFields, pickerDate, receiptFields, reviewReceipt } from '../domain/receipt';
import type { Clock } from '../domain/clock';
import type { ItemKind, ParsedItem } from '../domain/types';
import { CobyOrb } from './CobyOrb';
import { CheckIcon, PlanIcon } from './icons';
import { colors, radius, type } from './theme';
import { ActionButton, BackLink } from './controls';
import { dueText } from '../domain/dateText';
import type { ReminderMode } from '../domain/itemActions';

export function ReceiptScreen({ draft, busy, onEditDump, onHold, onDelete, clock, onReviewLocation, reminder, mode = 'receipt' }: { draft: ParsedItem[]; busy: boolean; onEditDump: () => void; onHold: (items: ParsedItem[]) => void; onDelete?: () => void; clock: Clock; onReviewLocation: (y: number) => void; mode?: 'receipt' | 'edit'; reminder?: { mode: ReminderMode; plus: boolean; onChange: (mode: ReminderMode) => void; onPersistent: () => void } }) {
  const editing = mode === 'edit';
  const [entries, setEntries] = useState(() => draft.map((item) => ({ item, fields: receiptFields(item), expanded: editing || item.needsClarification })));
  const [attempted, setAttempted] = useState(false);
  const [manual, setManual] = useState<number[]>([]);
  const [picker, setPicker] = useState<{ index: number; mode: 'date' | 'time'; value: Date } | null>(null);
  const cardPositions = useRef<Record<number, number>>({});
  const pagePosition = useRef(0);
  const results = entries.map(({ item, fields }) => correctReceipt(item, fields));
  const update = (index: number, patch: Partial<(typeof entries)[number]['fields']>) => setEntries((current) => current.map((entry, i) => i === index ? { ...entry, fields: { ...entry.fields, ...patch } } : entry));
  function hold() {
    setAttempted(true);
    const review = reviewReceipt(entries);
    if (review.issues.length) {
      const first = review.issues[0];
      setEntries(current => current.map((entry, index) => review.issues.some(issue => issue.index === index) ? { ...entry, expanded: true } : entry));
      AccessibilityInfo.announceForAccessibility(`Item ${first.index + 1} needs review. ${first.error}`);
      Keyboard.dismiss();
      requestAnimationFrame(() => onReviewLocation(Math.max(0, pagePosition.current + (cardPositions.current[first.index] ?? 0) - 12)));
      return;
    }
    if (review.items.length) onHold(review.items);
  }
  function openPicker(index: number, mode: 'date' | 'time') {
    Keyboard.dismiss();
    const value = pickerDate(entries[index].fields, clock.now());
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({ value, mode, display: 'default', onValueChange: (_event, selected) => update(index, mode === 'date' ? pickedDateFields(selected) : pickedTimeFields(selected)) });
    } else setPicker({ index, mode, value });
  }
  const firstIssue = attempted ? results.findIndex(result => result.error) : -1;
  return <View style={styles.page} onLayout={event => { pagePosition.current = event.nativeEvent.layout.y; }}>
    {editing ? <BackLink label="Cancel" disabled={busy} onPress={onEditDump} /> : <Pressable accessibilityRole="button" disabled={busy} onPress={onEditDump} style={styles.back}><Text style={styles.link}>Edit what I said</Text></Pressable>}
    <CobyOrb size={64} state="settled" />
    <Text style={styles.title}>{editing ? 'Edit details.' : `I’ve got ${entries.length} ${entries.length === 1 ? 'thing' : 'things'}.`}</Text>
    <Text style={styles.copy}>{editing ? 'Changes take effect when you save.' : 'Check it before I hold it.'}</Text>
    {!editing && <Text style={styles.meta}>Items with a future date and time get Gentle reminders. You can change this in Plan.</Text>}
    {entries.map((entry, index) => <View key={index} onLayout={event => { cardPositions.current[index] = event.nativeEvent.layout.y; }} style={[styles.card, attempted && results[index].error && styles.cardError]}>
      {(entry.item.needsClarification || (attempted && results[index].error)) && <Text style={styles.itemNumber}>Item {index + 1} · Needs review</Text>}
      {attempted && results[index].error && <Text accessibilityRole="alert" style={styles.error}>{results[index].error}</Text>}
      <TextInput accessibilityLabel={`Item ${index + 1} title`} editable={!busy} multiline value={entry.fields.title} onChangeText={(title) => update(index, { title })} style={styles.itemTitle} />
      <Text style={styles.meta}>{[entry.item.kind.toUpperCase(), results[index].item ? dueText(results[index].item!, clock) : entry.fields.date, entry.fields.duration ? `${entry.fields.duration} min` : ''].filter(Boolean).join(' · ')}</Text>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: entry.expanded }} disabled={busy} onPress={() => setEntries((current) => current.map((value, i) => i === index ? { ...value, expanded: !value.expanded } : value))} style={styles.detailButton}><Text style={styles.link}>{entry.expanded ? 'Close details' : 'Correct details'}</Text></Pressable>
      {entry.expanded && <View style={styles.details}>
        <Text style={styles.label}>Kind</Text>
        <View style={styles.kinds}>{(['task', 'event', 'reminder'] as ItemKind[]).map((kind) => <Pressable key={kind} accessibilityRole="button" accessibilityState={{ selected: entry.item.kind === kind }} disabled={busy} onPress={() => setEntries((current) => current.map((value, i) => i === index ? { ...value, item: { ...value.item, kind } } : value))} style={[styles.kind, entry.item.kind === kind && styles.selected]}><Text style={styles.kindText}>{kind}</Text></Pressable>)}</View>
        <Text style={styles.label}>Date · optional</Text>
        <View style={styles.dateRow}><Pressable accessibilityRole="button" accessibilityLabel={`Choose date for item ${index + 1}`} disabled={busy} onPress={() => openPicker(index, 'date')} style={styles.pickerButton}><PlanIcon /><Text style={styles.pickerText}>{entry.fields.date || 'Choose date'}</Text></Pressable>{entry.fields.date && <Pressable accessibilityRole="button" disabled={busy} onPress={() => update(index, { date: '', time: '' })} style={styles.clearDate}><Text style={styles.link}>Clear</Text></Pressable>}</View>
        <Text style={styles.label}>Time · optional</Text>
        <View style={styles.dateRow}><Pressable accessibilityRole="button" accessibilityLabel={`Choose time for item ${index + 1}`} disabled={busy} onPress={() => openPicker(index, 'time')} style={styles.pickerButton}><Text style={styles.pickerText}>{entry.fields.time || 'Choose time'}</Text></Pressable>{entry.fields.time && <Pressable accessibilityRole="button" disabled={busy} onPress={() => update(index, { time: '' })} style={styles.clearDate}><Text style={styles.link}>Clear</Text></Pressable>}</View>
        {!entry.fields.date && entry.fields.time && <Text style={styles.copy}>Choose a date for this time, or clear the time.</Text>}
        <Pressable accessibilityRole="button" onPress={() => setManual(current => current.includes(index) ? current.filter(i => i !== index) : [...current, index])} style={styles.detailButton}><Text style={styles.link}>{manual.includes(index) ? 'Hide manual entry' : 'Type date or time instead'}</Text></Pressable>
        {manual.includes(index) && <><TextInput accessibilityLabel={`Item ${index + 1} date`} editable={!busy} value={entry.fields.date} placeholder="YYYY-MM-DD" onChangeText={(date) => update(index, { date })} style={styles.input} /><TextInput accessibilityLabel={`Item ${index + 1} time`} editable={!busy} value={entry.fields.time} placeholder="HH:MM (24-hour)" onChangeText={(time) => update(index, { time })} style={styles.input} /></>}
        <Text style={styles.label}>Duration · optional, in minutes</Text>
        <TextInput accessibilityLabel={`Item ${index + 1} duration`} editable={!busy} keyboardType="number-pad" value={entry.fields.duration} placeholder="Leave blank if unknown" onChangeText={(duration) => update(index, { duration })} style={styles.input} />
        {editing && reminder && <>
          <Text style={styles.label}>Reminder</Text>
          {results[index].item?.dueAt ? <View style={styles.kinds}>{(['none', 'gentle', 'persistent'] as const).map(value => <Pressable key={value} accessibilityRole="button" accessibilityLabel={value === 'none' ? 'Reminder Off' : value === 'gentle' ? 'Reminder Gentle' : 'Reminder Persistent'} accessibilityState={{ selected: reminder.mode === value }} disabled={busy} onPress={() => { Keyboard.dismiss(); if (value === 'persistent' && !reminder.plus) reminder.onPersistent(); else reminder.onChange(value); }} style={[styles.kind, reminder.mode === value && styles.selected]}><Text style={styles.kindText}>{value === 'none' ? 'Off' : value === 'gentle' ? 'Gentle' : 'Persistent · Plus'}</Text></Pressable>)}</View> : <Text style={styles.meta}>Add a date and time to get a reminder.</Text>}
        </>}
        <Text style={styles.source}>From your words: “{entry.item.sourceFragment}”</Text>
      </View>}
      {entry.item.needsClarification && <View style={styles.clarification}><Text style={styles.copy}>{entry.item.clarificationQuestion || 'Something here was uncertain. Review the details or leave unknown timing blank.'}</Text><Pressable accessibilityRole="checkbox" accessibilityLabel={`I reviewed the details for item ${index + 1}`} accessibilityState={{ checked: entry.fields.clarified }} disabled={busy} onPress={() => update(index, { clarified: !entry.fields.clarified })} style={styles.reviewCheckbox}><View style={[styles.checkbox, entry.fields.clarified && styles.checkboxChecked]}>{entry.fields.clarified && <CheckIcon color={colors.white} />}</View><Text style={styles.link}>{entry.fields.clarified ? 'Details reviewed' : 'I reviewed these details'}</Text></Pressable></View>}
    </View>)}
    {firstIssue >= 0 && <View accessibilityLiveRegion="polite" style={styles.validationSummary}><Text accessibilityRole="alert" style={styles.error}>Item {firstIssue + 1} needs review: {results[firstIssue].error}</Text><Pressable accessibilityRole="button" onPress={() => onReviewLocation(Math.max(0, pagePosition.current + (cardPositions.current[firstIssue] ?? 0) - 12))} style={styles.detailButton}><Text style={styles.link}>Review item {firstIssue + 1}</Text></Pressable></View>}
    <ActionButton disabled={busy || !entries.length} onPress={hold} label={editing ? busy ? 'Saving…' : 'Save changes' : busy ? 'Holding…' : 'Looks right. Hold it.'} />
    {picker && <DateTimePicker value={picker.value} mode={picker.mode} onValueChange={(_event, value) => { update(picker.index, picker.mode === 'date' ? pickedDateFields(value) : pickedTimeFields(value)); setPicker(null); }} onDismiss={() => setPicker(null)} />}
    {editing && onDelete && <Pressable accessibilityRole="button" disabled={busy} onPress={onDelete} style={styles.detailButton}><Text style={styles.error}>Delete item</Text></Pressable>}
  </View>;
}

const styles = StyleSheet.create({
  itemNumber: { fontFamily: type.medium, fontSize: 14, color: colors.muted, marginBottom: 6 }, cardError: { borderWidth: 1.5, borderColor: colors.error },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 12 }, pickerButton: { flex: 1, minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.hairline, borderRadius: radius.small, paddingHorizontal: 12 }, pickerText: { fontFamily: type.medium, fontSize: 16, color: colors.ink }, clearDate: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 8 },
  reviewCheckbox: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10 }, checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: colors.violetDeep, alignItems: 'center', justifyContent: 'center' }, checkboxChecked: { backgroundColor: colors.violetDeep }, validationSummary: { padding: 14, borderRadius: radius.small, backgroundColor: colors.violetSoft },
  page: { gap: 16, paddingBottom: 24 }, back: { minHeight: 48, justifyContent: 'center', alignSelf: 'flex-start' }, link: { fontFamily: type.semibold, color: colors.violetDeep, fontSize: 14 },
  title: { fontFamily: type.bold, fontSize: 36, letterSpacing: -1.2, color: colors.ink }, copy: { fontFamily: type.regular, color: colors.muted, fontSize: 16, lineHeight: 24 },
  card: { backgroundColor: colors.paperRaised, borderRadius: radius.medium, padding: 18 }, itemTitle: { fontFamily: type.semibold, color: colors.ink, fontSize: 22, minHeight: 48 }, meta: { fontFamily: type.regular, color: colors.muted, fontSize: 14, marginTop: 4 },
  detailButton: { minHeight: 48, justifyContent: 'center', marginTop: 4 }, details: { gap: 8 }, label: { fontFamily: type.medium, color: colors.muted, fontSize: 14, marginTop: 8 }, input: { minHeight: 48, fontFamily: type.regular, fontSize: 16, color: colors.ink, borderWidth: 1, borderColor: colors.hairline, borderRadius: radius.small, paddingHorizontal: 12 },
  kinds: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, kind: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.paper }, selected: { backgroundColor: colors.violetSoft }, kindText: { fontFamily: type.medium, color: colors.ink, fontSize: 14 },
  source: { fontFamily: type.regular, fontSize: 14, lineHeight: 20, color: colors.muted, marginTop: 8 }, clarification: { borderTopWidth: 1, borderTopColor: colors.hairline, marginTop: 12, paddingTop: 12 }, error: { color: colors.error, fontFamily: type.medium, fontSize: 14, lineHeight: 20, marginTop: 8 },
});
