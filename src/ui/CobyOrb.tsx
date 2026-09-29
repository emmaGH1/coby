import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';
import { colors } from './theme';

export type OrbState = 'idle' | 'listening' | 'thinking' | 'settled';

export function CobyOrb({ size = 68, state = 'idle' }: { size?: number; state?: OrbState }) {
  const [motion] = useState(() => new Animated.Value(0));
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    motion.stopAnimation();
    motion.setValue(0);
    if (reduceMotion || state === 'settled') return;
    const duration = state === 'listening' ? 760 : state === 'thinking' ? 920 : 2600;
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(motion, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(motion, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [motion, reduceMotion, state]);

  const scale = motion.interpolate({ inputRange: [0, 1], outputRange: state === 'listening' ? [0.96, 1.1] : [0.98, 1.04] });
  const ringScale = motion.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1.18] });
  const ringOpacity = motion.interpolate({ inputRange: [0, 1], outputRange: state === 'listening' ? [0.36, 0.08] : [0.2, 0.05] });
  const innerScale = state === 'settled' ? 0.82 : 1;

  return <View accessibilityLabel={`Coby is ${state}`} style={[styles.frame, { width: size, height: size }]}>
    <Animated.View style={[styles.ring, {
      width: size, height: size, borderRadius: size / 2,
      opacity: ringOpacity, transform: [{ scale: ringScale }],
    }]} />
    <Animated.View style={[styles.outer, {
      width: size * 0.78, height: size * 0.78, borderRadius: size,
      transform: [{ scale }], backgroundColor: state === 'listening' ? '#C9BCE9' : '#DDD4EF',
    }]}>
      <Animated.View style={[styles.inner, {
        width: size * 0.43, height: size * 0.43, borderRadius: size,
        transform: [{ scale: innerScale }],
        backgroundColor: state === 'thinking' ? colors.violetDeep : colors.violet,
      }]} />
    </Animated.View>
  </View>;
}

const styles = StyleSheet.create({
  frame: { alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', backgroundColor: colors.violetSoft },
  outer: { alignItems: 'center', justifyContent: 'center', shadowColor: colors.violetDeep, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 4 },
  inner: { shadowColor: colors.violetDeep, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
});
