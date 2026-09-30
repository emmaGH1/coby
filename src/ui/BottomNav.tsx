import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HomeIcon, PlanIcon } from './icons';
import { colors, type } from './theme';

export function BottomNav({ current, onHome, onPlan }: { current: 'home' | 'plan'; onHome: () => void; onPlan: () => void }) {
  return <View style={styles.nav}>
    <Pressable accessibilityRole="tab" accessibilityState={{ selected: current === 'home' }} onPress={onHome} style={styles.target}>
      <HomeIcon active={current === 'home'} /><Text style={[styles.label, current === 'home' && styles.active]}>Home</Text>
    </Pressable>
    <Pressable accessibilityRole="tab" accessibilityState={{ selected: current === 'plan' }} onPress={onPlan} style={styles.target}>
      <PlanIcon active={current === 'plan'} /><Text style={[styles.label, current === 'plan' && styles.active]}>Plan</Text>
    </Pressable>
  </View>;
}
const styles = StyleSheet.create({
  nav: { flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: colors.paper, paddingVertical: 4 },
  target: { minHeight: 56, minWidth: 100, gap: 3, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: type.medium, fontSize: 14, color: colors.muted }, active: { fontFamily: type.semibold, color: colors.violetDeep },
});
