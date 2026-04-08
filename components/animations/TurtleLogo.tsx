import { TrtleColors } from '@/constants/theme';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

// Cute turtle SVG
function TurtleSvg({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Shell */}
      <Ellipse cx="50" cy="55" rx="35" ry="28" fill={TrtleColors.primaryDark} />
      <Ellipse cx="50" cy="52" rx="30" ry="23" fill={TrtleColors.primaryLight} />
      
      {/* Shell pattern */}
      <Path
        d="M35 45 Q50 35 65 45"
        stroke={TrtleColors.primaryDark}
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M30 55 Q50 45 70 55"
        stroke={TrtleColors.primaryDark}
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M35 65 Q50 55 65 65"
        stroke={TrtleColors.primaryDark}
        strokeWidth="2"
        fill="none"
      />
      
      {/* Head */}
      <Circle cx="50" cy="25" r="12" fill={TrtleColors.primaryMedium} />
      
      {/* Eyes */}
      <Circle cx="45" cy="23" r="3" fill={TrtleColors.white} />
      <Circle cx="55" cy="23" r="3" fill={TrtleColors.white} />
      <Circle cx="46" cy="23" r="1.5" fill={TrtleColors.textDark} />
      <Circle cx="56" cy="23" r="1.5" fill={TrtleColors.textDark} />
      
      {/* Smile */}
      <Path
        d="M45 29 Q50 33 55 29"
        stroke={TrtleColors.textDark}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Legs */}
      <Ellipse cx="22" cy="50" rx="8" ry="6" fill={TrtleColors.primaryMedium} />
      <Ellipse cx="78" cy="50" rx="8" ry="6" fill={TrtleColors.primaryMedium} />
      <Ellipse cx="28" cy="72" rx="7" ry="5" fill={TrtleColors.primaryMedium} />
      <Ellipse cx="72" cy="72" rx="7" ry="5" fill={TrtleColors.primaryMedium} />
      
      {/* Tail */}
      <Ellipse cx="50" cy="82" rx="5" ry="4" fill={TrtleColors.primaryMedium} />
    </Svg>
  );
}

// Water droplet that appears periodically
function WaterDrop({ delay }: { delay: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    const animate = () => {
      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 500 })
        )
      );
      translateY.value = withDelay(
        delay,
        withSequence(
          withTiming(-10, { duration: 300 }),
          withTiming(-30, { duration: 1000, easing: Easing.out(Easing.quad) })
        )
      );
      scale.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.6, { duration: 1000 })
        )
      );
    };

    animate();
    const interval = setInterval(animate, 4000);
    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[styles.droplet, animatedStyle]}>
      <Svg width={16} height={20} viewBox="0 0 24 30">
        <Path
          d="M12,24A8,8 0 0,1 4,16C4,10 12,2 12,2C12,2 20,10 20,16A8,8 0 0,1 12,24Z"
          fill={TrtleColors.waterBlue}
        />
      </Svg>
    </Animated.View>
  );
}

export function TurtleLogo() {
  const bounceIn = useSharedValue(0);
  const floating = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Initial bounce in
    bounceIn.value = withSpring(1, {
      damping: 8,
      stiffness: 100,
      mass: 1,
    });

    // Continuous floating animation
    floating.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Subtle rotation
    rotation.value = withRepeat(
      withSequence(
        withTiming(3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: bounceIn.value },
        { translateY: floating.value * -8 },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <TurtleSvg size={140} />
      </Animated.View>
      {/* Water droplets emanating from turtle */}
      <WaterDrop delay={0} />
      <WaterDrop delay={1500} />
      <WaterDrop delay={3000} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  droplet: {
    position: 'absolute',
    top: 100,
  },
});
