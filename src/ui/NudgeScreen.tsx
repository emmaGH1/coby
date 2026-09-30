import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CobyItem } from '../domain/types';
import { REMINDER_DELAYS } from '../domain/nudges';
import { colors, type } from './theme';

type Props = {
  item: CobyItem; busy: boolean; message: string | null; dueText: (item: CobyItem) => string;
  onBack: () => void; onFocus: () => void; onDone: () => void;
  onDelay: (minutes: number) => void; onEdit: () => void;
  onGentle: () => void; onPersistent: () => void; onOff: () => void;
};

export function NudgeScreen({ item, busy, message, dueText, onBack, onFocus, onDone, onDelay, onEdit, onGentle, onPersistent, onOff }: Props) {
  return <View style={styles.screen}>
    <Pressable accessibilityRole="button" onPress={onBack} disabled={busy} style={styles.back}><Text style={styles.link}>← Home</Text></Pressable>
    <Text style={styles.brand}>coby</Text>
    <View style={styles.message}><Text style={styles.intro}>A little check-in.</Text><Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.dueAt ? `Due ${dueText(item)}. How would you like to take this from here?` : 'Choose a date and time in task details so Coby knows when to reach out.'}</Text></View>
    <View style={styles.commitments}><Text style={styles.label}>Reminders: {item.commitmentMode === 'none' ? 'off' : item.commitmentMode}</Text>
      {item.commitmentMode !== 'gentle' && <Pressable accessibilityRole="button" disabled={busy} onPress={onGentle} style={styles.mode}><Text style={styles.link}>Gentle</Text></Pressable>}
      {item.commitmentMode !== 'persistent' && <Pressable accessibilityRole="button" disabled={busy} onPress={onPersistent} style={styles.mode}><Text style={styles.link}>Persistent · Plus</Text></Pressable>}
      {item.commitmentMode !== 'none' && <Pressable accessibilityRole="button" disabled={busy} onPress={onOff} style={styles.mode}><Text style={styles.link}>Off</Text></Pressable>}
    </View>
    {message && <Text accessibilityLiveRegion="polite" style={styles.status}>{message}</Text>}
    <Pressable accessibilityRole="button" disabled={busy} onPress={onFocus} style={styles.primary}><Text style={styles.primaryText}>Start focus</Text></Pressable>
    <Text style={styles.label}>Remind me in</Text>
    <View style={styles.delays}>{REMINDER_DELAYS.map(minutes => <Pressable key={minutes} accessibilityRole="button" disabled={busy || item.commitmentMode === 'none' || !item.dueAt} onPress={() => onDelay(minutes)} style={[styles.delay,(item.commitmentMode === 'none'||!item.dueAt)&&styles.disabled]}>
      <Text style={styles.link}>{minutes === 60 ? '1 hour' : `${minutes} min`}</Text></Pressable>)}</View>
    <Text style={styles.note}>This postpones the reminder. Your due time stays unchanged.</Text>
    <Pressable accessibilityRole="button" disabled={busy} onPress={onDone} style={styles.secondary}><Text style={styles.link}>I’ve done this</Text></Pressable>
    <Pressable accessibilityRole="button" disabled={busy} onPress={onEdit} style={styles.secondary}><Text style={styles.link}>Change task details</Text></Pressable>
  </View>;
}

const styles=StyleSheet.create({
  screen:{gap:16},back:{minHeight:44,justifyContent:'center'},brand:{fontFamily:type.bold,fontSize:30,color:colors.ink},
  message:{padding:22,borderRadius:24,backgroundColor:colors.paperRaised,gap:12},intro:{fontFamily:type.medium,fontSize:14,color:colors.muted},
  title:{fontFamily:type.semibold,fontSize:25,lineHeight:33,color:colors.ink},body:{fontFamily:type.regular,fontSize:15,lineHeight:23,color:colors.muted},
  status:{fontFamily:type.medium,fontSize:14,lineHeight:22,color:colors.violetDeep},label:{fontFamily:type.medium,fontSize: 14,color:colors.muted,marginTop:8},
  delays:{flexDirection:'row',gap:8},delay:{flex:1,minHeight:48,alignItems:'center',justifyContent:'center',borderRadius:24,backgroundColor:colors.violetMist},
  commitments:{flexDirection:'row',flexWrap:'wrap',gap:14,alignItems:'center'},mode:{minHeight:44,justifyContent:'center'},disabled:{opacity:.4},
  link:{fontFamily:type.semibold,fontSize:14,color:colors.violetDeep},note:{fontFamily:type.regular,fontSize: 14,lineHeight:19,color:colors.muted},
  primary:{minHeight:52,alignItems:'center',justifyContent:'center',borderRadius:24,backgroundColor:colors.violet},
  primaryText:{fontFamily:type.semibold,fontSize:15,color:colors.white},secondary:{minHeight:48,alignItems:'center',justifyContent:'center'},
});
