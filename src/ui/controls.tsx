import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, type } from './theme';

export function ActionButton({ label, onPress, kind = 'primary', disabled = false, icon, style }: {
  label: string; onPress: () => void; kind?: 'primary' | 'quiet'; disabled?: boolean;
  icon?: ReactNode; style?: StyleProp<ViewStyle>;
}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [styles.button, kind === 'quiet' && styles.quiet, style, disabled && styles.disabled, pressed && styles.pressed]}>
    {icon}<Text style={[styles.buttonText, kind === 'quiet' && styles.quietText]}>{label}</Text>
  </Pressable>;
}

export function BackLink({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Back to ${label}`} disabled={disabled} onPress={onPress} style={styles.back}>
    <Ionicons name="chevron-back" size={22} color={colors.violetDeep} /><Text style={styles.backText}>{label}</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: radius.pill, backgroundColor: colors.ink, paddingHorizontal: 18,
    paddingVertical: 12, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  quiet: { backgroundColor: colors.violetSoft }, buttonText: { fontFamily: type.semibold, fontSize: 16, color: colors.white },
  quietText: { color: colors.ink }, disabled: { opacity: 0.4 }, pressed: { opacity: 0.76 },
  back: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  backText: { fontFamily: type.semibold, fontSize: 14, color: colors.violetDeep },
});
