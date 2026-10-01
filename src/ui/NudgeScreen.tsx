import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CobyItem } from '../domain/types';
import { REMINDER_DELAYS } from '../domain/nudges';
import { colors, radius, type } from './theme';
import { ActionButton, BackLink } from './controls';

type Props = {
  item: CobyItem; busy: boolean; message: string | null; dueText: (item: CobyItem) => string;
  onBack: () => void; onFocus: () => void; onDone: () => void;
  onDelay: (minutes: number) => void; onEdit: () => void;
  backLabel: string;
};

export function NudgeScreen({ item, busy, message, dueText, onBack, onFocus, onDone, onDelay, onEdit, backLabel }: Props) {
  return <View style={styles.screen}>
    <BackLink label={backLabel} onPress={onBack} disabled={busy} />
    <View style={styles.message}><Text style={styles.intro}>A little check-in.</Text><Text style={styles.title}>{item.title}</Text>
      {dueText(item) ? <Text style={styles.body}>Due {dueText(item)}</Text> : null}</View>
    {message && <Text accessibilityLiveRegion="polite" style={styles.status}>{message}</Text>}
    <ActionButton label="I’ve done this" disabled={busy} onPress={onDone} />
    <ActionButton label="Start focus" kind="quiet" disabled={busy} onPress={onFocus} />
    <Text style={styles.label}>Remind me in</Text>
    <View style={styles.delays}>{REMINDER_DELAYS.map(minutes => <Pressable key={minutes} accessibilityRole="button" disabled={busy || item.commitmentMode === 'none' || !item.dueAt} onPress={() => onDelay(minutes)} style={[styles.delay,(item.commitmentMode === 'none'||!item.dueAt)&&styles.disabled]}>
      <Text style={styles.link}>{minutes === 60 ? '1 hour' : `${minutes} min`}</Text></Pressable>)}</View>
    <Text style={styles.note}>This postpones the reminder. Your due time stays unchanged.</Text>
    <Pressable accessibilityRole="button" disabled={busy} onPress={onEdit} style={styles.secondary}><Text style={styles.link}>Change details</Text></Pressable>
  </View>;
}

const styles=StyleSheet.create({
  screen:{gap:16},
  message:{padding:22,borderRadius:radius.medium,backgroundColor:colors.paperRaised,gap:12},intro:{fontFamily:type.medium,fontSize:14,color:colors.muted},
  title:{fontFamily:type.semibold,fontSize:25,lineHeight:33,color:colors.ink},body:{fontFamily:type.regular,fontSize:15,lineHeight:23,color:colors.muted},
  status:{fontFamily:type.medium,fontSize:14,lineHeight:22,color:colors.violetDeep},label:{fontFamily:type.medium,fontSize: 14,color:colors.muted,marginTop:8},
  delays:{flexDirection:'row',gap:8},delay:{flex:1,minHeight:48,alignItems:'center',justifyContent:'center',borderRadius:radius.pill,backgroundColor:colors.violetMist},disabled:{opacity:.4},
  link:{fontFamily:type.semibold,fontSize:14,color:colors.violetDeep},note:{fontFamily:type.regular,fontSize: 14,lineHeight:19,color:colors.muted},
  secondary:{minHeight:48,alignItems:'center',justifyContent:'center'},
});
