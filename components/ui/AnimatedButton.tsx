import { TrtleColors } from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'text';
  style?: ViewStyle;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AnimatedButton({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  style,
  disabled = false,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const buttonStyles = [
    styles.button,
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    variant === 'text' && styles.textButton,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'text' && styles.textButtonText,
  ];

  return (
    <AnimatedPressable
      style={[buttonStyles, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? TrtleColors.white : TrtleColors.primaryDark}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: TrtleColors.primaryDark,
    shadowColor: TrtleColors.primaryDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: TrtleColors.primaryDark,
  },
  textButton: {
    backgroundColor: 'transparent',
    height: 'auto',
    paddingVertical: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  primaryText: {
    color: TrtleColors.white,
  },
  secondaryText: {
    color: TrtleColors.primaryDark,
  },
  textButtonText: {
    color: TrtleColors.primaryDark,
    fontSize: 16,
  },
});
