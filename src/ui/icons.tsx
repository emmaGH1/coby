import { StyleSheet, View } from 'react-native';
import { colors } from './theme';

export function MicIcon({ active = false }: { active?: boolean }) {
  const color = active ? colors.white : colors.ink;
  return <View style={styles.icon}>
    <View style={[styles.micCapsule, { borderColor: color }]} />
    <View style={[styles.micArc, { borderColor: color }]} />
    <View style={[styles.micStem, { backgroundColor: color }]} />
    <View style={[styles.micBase, { backgroundColor: color }]} />
  </View>;
}

export function ArrowIcon({ color = colors.ink }: { color?: string }) {
  return <View style={styles.arrow}>
    <View style={[styles.arrowShaft, { backgroundColor: color }]} />
    <View style={[styles.arrowHead, { borderColor: color }]} />
  </View>;
}

export function CheckIcon({ color = colors.ink }: { color?: string }) {
  return <View style={[styles.check, { borderColor: color }]} />;
}

export function TrashIcon() {
  return <View style={{width:20,height:20,alignItems:'center'}}><View style={{width:13,height:1.5,backgroundColor:colors.muted,top:4}}/><View style={{position:'absolute',top:2,width:6,height:3,borderWidth:1.5,borderColor:colors.muted}}/><View style={{position:'absolute',top:6,width:10,height:12,borderWidth:1.5,borderColor:colors.muted,borderBottomLeftRadius:2,borderBottomRightRadius:2}}/></View>;
}

export function PencilIcon() {
  return <View style={{width:20,height:20,alignItems:'center',justifyContent:'center'}}><View style={{width:5,height:16,borderWidth:1.4,borderColor:colors.muted,transform:[{rotate:'40deg'}]}}/></View>;
}

export function StopIcon() {
  return <View style={{width:19,height:19,borderRadius:4,borderWidth:1.8,borderColor:colors.white}}/>;
}

const styles = StyleSheet.create({
  icon: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  micCapsule: { width: 9, height: 14, borderWidth: 1.8, borderRadius: 7, position: 'absolute', top: 1 },
  micArc: { width: 16, height: 13, borderWidth: 1.8, borderTopWidth: 0, borderRadius: 9, position: 'absolute', top: 6 },
  micStem: { width: 1.8, height: 4, position: 'absolute', top: 17 },
  micBase: { width: 9, height: 1.8, borderRadius: 2, position: 'absolute', top: 21 },
  arrow: { width: 20, height: 20, justifyContent: 'center' },
  arrowShaft: { width: 16, height: 1.5, borderRadius: 2 },
  arrowHead: { position: 'absolute', right: 1, width: 7, height: 7, borderTopWidth: 1.5, borderRightWidth: 1.5, transform: [{ rotate: '45deg' }] },
  check: { width: 13, height: 7, borderLeftWidth: 1.8, borderBottomWidth: 1.8, transform: [{ rotate: '-45deg' }, { translateY: -1 }] },
});
