import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { correctReceipt, receiptFields } from '../domain/receipt';
import type { ItemKind, ParsedItem } from '../domain/types';
import { CobyOrb } from './CobyOrb';
import { colors, radius, type } from './theme';

export function ReceiptScreen({ draft, busy, onEditDump, onHold, mode = 'receipt' }: { draft: ParsedItem[]; busy: boolean; onEditDump: () => void; onHold: (items: ParsedItem[]) => void; mode?: 'receipt' | 'edit' }) {
  const editing = mode === 'edit';
  const [entries, setEntries] = useState(() => draft.map((item) => ({ item, fields: receiptFields(item), expanded: editing || item.needsClarification })));
  const [attempted, setAttempted] = useState(false);
  const results = entries.map(({ item, fields }) => correctReceipt(item, fields));
  const update = (index: number, patch: Partial<(typeof entries)[number]['fields']>) => setEntries((current) => current.map((entry, i) => i === index ? { ...entry, fields: { ...entry.fields, ...patch } } : entry));
  function hold() {
    setAttempted(true);
    if (results.some((result) => !result.item) || !results.length) return;
    onHold(results.map((result) => result.item!));
  }
  return <View style={styles.page}>
    <Pressable accessibilityRole="button" disabled={busy} onPress={onEditDump} style={styles.back}><Text style={styles.link}>{editing ? '← Cancel' : 'Edit what I said'}</Text></Pressable>
    <CobyOrb size={64} state="settled" />
    <Text style={styles.title}>{editing ? 'Edit details.' : 'I’ve got it.'}</Text>
    <Text style={styles.copy}>{editing ? 'Change what you need. Coby will update your reminders.' : 'Here’s what I heard. Check it before I hold it.'}</Text>
    {entries.map((entry, index) => <View key={index} style={styles.card}>
      <TextInput accessibilityLabel={`Item ${index + 1} title`} editable={!busy} multiline value={entry.fields.title} onChangeText={(title) => update(index, { title })} style={styles.itemTitle} />
      <Text style={styles.meta}>{entry.item.kind} · {entry.fields.date || 'No date'}{entry.fields.time ? ` at ${entry.fields.time}` : ''}{entry.fields.duration ? ` · ${entry.fields.duration} min` : ''}</Text>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: entry.expanded }} disabled={busy} onPress={() => setEntries((current) => current.map((value, i) => i === index ? { ...value, expanded: !value.expanded } : value))} style={styles.detailButton}><Text style={styles.link}>{entry.expanded ? 'Close details' : 'Correct details'}</Text></Pressable>
      {entry.expanded && <View style={styles.details}>
        <Text style={styles.label}>Kind</Text>
        <View style={styles.kinds}>{(['task', 'event', 'reminder'] as ItemKind[]).map((kind) => <Pressable key={kind} accessibilityRole="button" accessibilityState={{ selected: entry.item.kind === kind }} disabled={busy} onPress={() => setEntries((current) => current.map((value, i) => i === index ? { ...value, item: { ...value.item, kind } } : value))} style={[styles.kind, entry.item.kind === kind && styles.selected]}><Text style={styles.kindText}>{kind}</Text></Pressable>)}</View>
        <Text style={styles.label}>Date · optional</Text>
        <TextInput accessibilityLabel={`Item ${index + 1} date`} editable={!busy} value={entry.fields.date} placeholder="YYYY-MM-DD" onChangeText={(date) => update(index, { date })} style={styles.input} />
        <Text style={styles.label}>Time · optional, local 24-hour time</Text>
        <TextInput accessibilityLabel={`Item ${index + 1} time`} editable={!busy} value={entry.fields.time} placeholder="HH:MM" onChangeText={(time) => update(index, { time })} style={styles.input} />
        <Text style={styles.label}>Duration · optional, in minutes</Text>
        <TextInput accessibilityLabel={`Item ${index + 1} duration`} editable={!busy} keyboardType="number-pad" value={entry.fields.duration} placeholder="Leave blank if unknown" onChangeText={(duration) => update(index, { duration })} style={styles.input} />
        <Text style={styles.source}>From your words: “{entry.item.sourceFragment}”</Text>
      </View>}
      {entry.item.needsClarification && <View style={styles.clarification}><Text style={styles.copy}>{entry.item.clarificationQuestion || 'Something here was uncertain. Check the details above.'}</Text><Pressable accessibilityRole="checkbox" accessibilityState={{ checked: entry.fields.clarified }} disabled={busy} onPress={() => update(index, { clarified: !entry.fields.clarified })} style={styles.detailButton}><Text style={styles.link}>{entry.fields.clarified ? 'Checked — this is right' : 'I’ve checked this detail'}</Text></Pressable></View>}
      {attempted && results[index].error && <Text accessibilityRole="alert" style={styles.error}>{results[index].error}</Text>}
    </View>)}
    <Pressable accessibilityRole="button" disabled={busy || !entries.length} onPress={hold} style={[styles.save, busy && styles.disabled]}><Text style={styles.saveText}>{editing ? busy ? 'Saving…' : 'Save changes' : busy ? 'Holding…' : 'Looks right. Hold it.'}</Text></Pressable>
  </View>;
}

const styles = StyleSheet.create({
  page: { gap: 16, paddingBottom: 24 }, back: { minHeight: 48, justifyContent: 'center', alignSelf: 'flex-start' }, link: { fontFamily: type.semibold, color: colors.violetDeep, fontSize: 14 },
  title: { fontFamily: type.bold, fontSize: 36, letterSpacing: -1.2, color: colors.ink }, copy: { fontFamily: type.regular, color: colors.muted, fontSize: 16, lineHeight: 24 },
  card: { backgroundColor: colors.paperRaised, borderRadius: radius.medium, padding: 18 }, itemTitle: { fontFamily: type.semibold, color: colors.ink, fontSize: 22, minHeight: 48 }, meta: { fontFamily: type.regular, color: colors.muted, fontSize: 13, marginTop: 4 },
  detailButton: { minHeight: 48, justifyContent: 'center', marginTop: 4 }, details: { gap: 8 }, label: { fontFamily: type.medium, color: colors.muted, fontSize: 13, marginTop: 8 }, input: { minHeight: 48, fontFamily: type.regular, fontSize: 16, color: colors.ink, borderWidth: 1, borderColor: colors.hairline, borderRadius: radius.small, paddingHorizontal: 12 },
  kinds: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, kind: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 12, borderRadius: radius.small, backgroundColor: colors.paper }, selected: { backgroundColor: colors.violetSoft }, kindText: { fontFamily: type.medium, color: colors.ink, fontSize: 14 },
  source: { fontFamily: type.regular, fontSize: 13, lineHeight: 20, color: colors.muted, marginTop: 8 }, clarification: { borderTopWidth: 1, borderTopColor: colors.hairline, marginTop: 12, paddingTop: 12 }, error: { color: colors.error, fontFamily: type.medium, fontSize: 14, lineHeight: 20, marginTop: 8 },
  save: { minHeight: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.ink, borderRadius: radius.pill }, saveText: { color: colors.white, fontFamily: type.semibold, fontSize: 16 }, disabled: { opacity: 0.5 },
});
