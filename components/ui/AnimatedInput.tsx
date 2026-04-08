import { TrtleColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface AnimatedInputProps extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function AnimatedInput({ icon, label, secureTextEntry, ...props }: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const focusAnimation = useSharedValue(0);

  const handleFocus = () => {
    setIsFocused(true);
    focusAnimation.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnimation.value = withTiming(0, { duration: 200 });
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        focusAnimation.value,
        [0, 1],
        [TrtleColors.inputBorder, TrtleColors.inputBorderFocus]
      ),
      transform: [{ scale: 1 + focusAnimation.value * 0.02 }],
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.5 + focusAnimation.value * 0.5,
    };
  });

  return (
    <AnimatedView style={[styles.container, animatedContainerStyle]}>
      {icon && (
        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? TrtleColors.primaryDark : TrtleColors.textMuted}
          />
        </Animated.View>
      )}
      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor={TrtleColors.placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry && !showPassword}
        {...props}
      />
      {secureTextEntry && (
        <Animated.View style={animatedIconStyle}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={TrtleColors.textMuted}
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          />
        </Animated.View>
      )}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TrtleColors.white,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    shadowColor: TrtleColors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: TrtleColors.textDark,
  },
  eyeIcon: {
    padding: 4,
  },
});
