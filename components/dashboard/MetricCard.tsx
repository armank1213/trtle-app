import { TrtleColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

type MetricType = 'moisture' | 'temperature' | 'humidity' | 'light';

interface MetricCardProps {
  type: MetricType;
  value: number;
  delay?: number;
}

const metricConfig: Record<MetricType, {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  unit: string;
  color: string;
  bgColor: string;
  maxValue: number;
}> = {
  moisture: {
    icon: 'water',
    label: 'Soil Moisture',
    unit: '%',
    color: TrtleColors.waterBlueDark,
    bgColor: TrtleColors.white,
    maxValue: 100,
  },
  temperature: {
    icon: 'thermometer',
    label: 'Temperature',
    unit: '°C',
    color: TrtleColors.primaryDeep,
    bgColor: TrtleColors.offWhite,
    maxValue: 50,
  },
  humidity: {
    icon: 'cloud',
    label: 'Humidity',
    unit: '%',
    color: TrtleColors.primaryDark,
    bgColor: TrtleColors.offWhite,
    maxValue: 100,
  },
  light: {
    icon: 'sunny',
    label: 'Light Level',
    unit: '%',
    color: TrtleColors.primaryMedium,
    bgColor: TrtleColors.white,
    maxValue: 100,
  },
};

export function MetricCard({ type, value, delay = 0 }: MetricCardProps) {
  const config = metricConfig[type];
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    progress.value = withDelay(
      delay + 200,
      withTiming(value / config.maxValue, { duration: 1000, easing: Easing.out(Easing.cubic) })
    );
  }, [value]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: 0.95 + opacity.value * 0.05 }],
  }));

  return (
    <Animated.View style={[styles.container, { backgroundColor: config.bgColor }, containerAnimatedStyle]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: config.color + '15' }]}>
          <Ionicons name={config.icon} size={18} color={config.color} />
        </View>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: config.color }]}>{value}</Text>
          <Text style={styles.unit}>{config.unit}</Text>
        </View>
      </View>
      <Text style={styles.label}>{config.label}</Text>
      <View style={styles.progressBarBg}>
        <Animated.View
          style={[styles.progressBar, { backgroundColor: config.color }, animatedBarStyle]}
        />
      </View>
      {/* Decorative corner accent */}
      <View style={[styles.cornerAccent, { backgroundColor: config.color }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    flex: 1,
    minWidth: 150,
    shadowColor: TrtleColors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TrtleColors.inputBorder + '50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
  },
  unit: {
    fontSize: 13,
    fontWeight: '500',
    color: TrtleColors.textMuted,
    marginBottom: 4,
    marginLeft: 2,
  },
  label: {
    fontSize: 12,
    color: TrtleColors.textMuted,
    marginTop: 10,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: TrtleColors.inputBorder,
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  cornerAccent: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 50,
    height: 50,
    borderRadius: 25,
    opacity: 0.08,
  },
});
