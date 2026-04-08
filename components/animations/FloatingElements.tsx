import { TrtleColors } from '@/constants/theme';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Leaf SVG Component
function LeafIcon({ size = 24, color = TrtleColors.primaryLight }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
    </Svg>
  );
}

// Water Droplet SVG Component
function WaterDropIcon({ size = 20, color = TrtleColors.waterBlue }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z" />
    </Svg>
  );
}

// Single Floating Element
function FloatingElement({
  children,
  startX,
  startY,
  duration,
  delay,
}: {
  children: React.ReactNode;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
}) {
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: duration * 2, easing: Easing.linear }),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(progress.value, [0, 0.5, 1], [0, 30, 0]) },
        { translateY: interpolate(progress.value, [0, 0.5, 1], [0, -50, 0]) },
        { rotate: `${rotation.value}deg` },
        { scale: interpolate(progress.value, [0, 0.5, 1], [1, 1.1, 1]) },
      ],
      opacity: interpolate(progress.value, [0, 0.5, 1], [0.4, 0.7, 0.4]),
    };
  });

  return (
    <Animated.View
      style={[
        styles.floatingElement,
        { left: startX, top: startY },
        animatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function FloatingElements() {
  const elements = [
    { type: 'leaf', x: width * 0.1, y: height * 0.15, duration: 6000, delay: 0, size: 28 },
    { type: 'drop', x: width * 0.85, y: height * 0.1, duration: 5000, delay: 500, size: 22 },
    { type: 'leaf', x: width * 0.75, y: height * 0.25, duration: 7000, delay: 1000, size: 24 },
    { type: 'drop', x: width * 0.15, y: height * 0.35, duration: 5500, delay: 1500, size: 18 },
    { type: 'leaf', x: width * 0.9, y: height * 0.45, duration: 6500, delay: 2000, size: 26 },
    { type: 'drop', x: width * 0.05, y: height * 0.55, duration: 4500, delay: 2500, size: 20 },
    { type: 'leaf', x: width * 0.8, y: height * 0.65, duration: 7500, delay: 3000, size: 22 },
    { type: 'drop', x: width * 0.2, y: height * 0.75, duration: 5000, delay: 3500, size: 24 },
    { type: 'leaf', x: width * 0.6, y: height * 0.85, duration: 6000, delay: 4000, size: 28 },
  ];

  return (
    <View style={styles.container} pointerEvents="none">
      {elements.map((el, index) => (
        <FloatingElement
          key={index}
          startX={el.x}
          startY={el.y}
          duration={el.duration}
          delay={el.delay}
        >
          {el.type === 'leaf' ? (
            <LeafIcon size={el.size} color={TrtleColors.primaryMedium} />
          ) : (
            <WaterDropIcon size={el.size} color={TrtleColors.waterBlue} />
          )}
        </FloatingElement>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  floatingElement: {
    position: 'absolute',
  },
});
