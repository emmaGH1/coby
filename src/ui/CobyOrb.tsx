import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';

export type OrbState = 'idle' | 'listening' | 'thinking' | 'settled';

export function CobyOrb({ size = 68, state = 'idle', inputLevel = 0 }: { size?: number; state?: OrbState; inputLevel?: number }) {
  const [motion] = useState(() => new Animated.Value(0));
  const [level] = useState(() => new Animated.Value(0));
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    motion.stopAnimation(); motion.setValue(0);
    if (reduceMotion) return;
    const duration = state === 'thinking' ? 1300 : state === 'listening' ? 1800 : 4200;
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(motion, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(motion, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    animation.start(); return () => animation.stop();
  }, [motion, reduceMotion, state]);
  useEffect(() => {
    const animation = Animated.timing(level, { toValue: state === 'listening' && !reduceMotion ? inputLevel : 0, duration: 140, useNativeDriver: true });
    animation.start(); return () => animation.stop();
  }, [level, inputLevel, reduceMotion, state]);
  const breathing = motion.interpolate({ inputRange: [0, 1], outputRange: [0.994, 1.006] });
  const response = level.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05], extrapolate: 'clamp' });
  const rotation = motion.interpolate({ inputRange: [0, 1], outputRange: state === 'thinking' ? ['-2deg', '2deg'] : ['-1.4deg', '1.4deg'] });
  return <View accessibilityLabel={`Coby is ${state}`} style={[styles.frame, { width: size, height: size }]}>
    <Animated.Image source={require('../../assets/coby-companion.png')} resizeMode="contain" style={{ width: size * 1.2, height: size * 1.2, transform: [{ scale: Animated.multiply(breathing, response) }, { rotate: rotation }] }} />
  </View>;
}
const styles = StyleSheet.create({ frame: { alignItems: 'center', justifyContent: 'center' } });
