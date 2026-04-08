import { TrtleColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface AlertBadgeProps {
  count: number;
  onPress?: () => void;
}

export function AlertBadge({ count, onPress }: AlertBadgeProps) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (count > 0) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(1);
    }
  }, [count]);

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const hasAlerts = count > 0;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.iconContainer, hasAlerts && styles.iconContainerActive]}>
        <Ionicons
          name={hasAlerts ? 'notifications' : 'notifications-outline'}
          size={24}
          color={hasAlerts ? TrtleColors.alertHigh : TrtleColors.textMuted}
        />
      </View>
      {hasAlerts && (
        <Animated.View style={[styles.badge, animatedBadgeStyle]}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TrtleColors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: TrtleColors.alertHighBg,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: TrtleColors.alertHigh,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: TrtleColors.white,
  },
  badgeText: {
    color: TrtleColors.white,
    fontSize: 11,
    fontWeight: '700',
  },
});
