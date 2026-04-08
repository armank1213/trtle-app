import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

import { FloatingElements } from '@/components/animations/FloatingElements';
import { TurtleLogo } from '@/components/animations/TurtleLogo';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TrtleColors } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Staggered entrance animations
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(30);
  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(300, withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.5)) }));
    
    formOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    formTranslateY.value = withDelay(500, withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.5)) }));
    
    footerOpacity.value = withDelay(700, withTiming(1, { duration: 600 }));
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      // Handle password mismatch - you can add proper error handling here
      return;
    }
    
    setLoading(true);
    // Simulate signup - replace with actual auth logic
    setTimeout(() => {
      setLoading(false);
      // Navigate to main app after successful signup
      router.replace('/(tabs)');
    }, 1500);
  };

  const isFormValid = email && password && confirmPassword && password === confirmPassword;

  return (
    <GradientBackground>
      <StatusBar style="dark" />
      <FloatingElements />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <TurtleLogo />
            <Animated.View style={titleAnimatedStyle}>
              <Text style={styles.appName}>Trtle</Text>
              <Text style={styles.tagline}>Smart Irrigation System</Text>
            </Animated.View>
          </View>

          {/* Form Section */}
          <Animated.View style={[styles.formSection, formAnimatedStyle]}>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitle}>Join us in keeping your plants healthy</Text>

            <View style={styles.inputContainer}>
              <AnimatedInput
                icon="mail-outline"
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <AnimatedInput
                icon="lock-closed-outline"
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
              />

              <AnimatedInput
                icon="shield-checkmark-outline"
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
              />

              {password && confirmPassword && password !== confirmPassword && (
                <Text style={styles.errorText}>Passwords do not match</Text>
              )}
            </View>

            <AnimatedButton
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              disabled={!isFormValid}
            />
          </Animated.View>

          {/* Footer Section */}
          <Animated.View style={[styles.footer, footerAnimatedStyle]}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/(auth)/login" asChild>
              <AnimatedButton
                title="Sign In"
                onPress={() => {}}
                variant="text"
              />
            </Link>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.06,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  appName: {
    fontSize: 42,
    fontWeight: '700',
    color: TrtleColors.primaryDeep,
    textAlign: 'center',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: TrtleColors.textMedium,
    textAlign: 'center',
    marginTop: 4,
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: TrtleColors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: TrtleColors.textMuted,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 8,
  },
  errorText: {
    color: TrtleColors.error,
    fontSize: 14,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  footerText: {
    fontSize: 16,
    color: TrtleColors.textMuted,
  },
});
