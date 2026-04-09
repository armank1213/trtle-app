import { TrtleColors } from '@/constants/theme';
import { TrendDataPoint } from '@/types/plant';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

interface TrendChartProps {
  data: TrendDataPoint[];
  title: string;
  color?: string;
  unit?: string;
  delay?: number;
  showHeader?: boolean;
}

const { width } = Dimensions.get('window');

export function TrendChart({
  data,
  title,
  color = TrtleColors.primaryDark,
  unit = '%',
  delay = 0,
  showHeader = true,
}: TrendChartProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 600 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Format data for chart
  const chartData = {
    labels: data.filter((_, i) => i % 4 === 0).map((_, i) => `${i * 4}h`),
    datasets: [
      {
        data: data.map(d => d.value),
        color: () => color,
        strokeWidth: 2,
      },
    ],
  };

  const currentValue = data[data.length - 1]?.value ?? 0;
  const minValue = Math.min(...data.map(d => d.value));
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {showHeader && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.valueContainer}>
            <Text style={[styles.currentValue, { color }]}>{currentValue.toFixed(1)}</Text>
            <Text style={styles.unit}>{unit}</Text>
          </View>
        </View>
      )}
      
      <View style={styles.statsRow}>
        <Text style={styles.statText}>Min: {minValue.toFixed(1)}{unit}</Text>
        <Text style={styles.statText}>Max: {maxValue.toFixed(1)}{unit}</Text>
      </View>

      <LineChart
        data={chartData}
        width={width - 80}
        height={140}
        chartConfig={{
          backgroundColor: TrtleColors.white,
          backgroundGradientFrom: TrtleColors.white,
          backgroundGradientTo: TrtleColors.white,
          decimalPlaces: 0,
          color: () => color,
          labelColor: () => TrtleColors.textMuted,
          style: { borderRadius: 16 },
          propsForDots: {
            r: '0',
          },
          propsForBackgroundLines: {
            strokeDasharray: '5,5',
            stroke: TrtleColors.inputBorder,
            strokeWidth: 1,
          },
        }}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withHorizontalLabels={true}
        withVerticalLabels={true}
        fromZero={false}
      />
      
      <Text style={styles.timeLabel}>Last 24 hours</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: TrtleColors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: TrtleColors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: TrtleColors.textDark,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currentValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  unit: {
    fontSize: 14,
    color: TrtleColors.textMuted,
    marginBottom: 3,
    marginLeft: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statText: {
    fontSize: 12,
    color: TrtleColors.textMuted,
  },
  chart: {
    marginLeft: -16,
    borderRadius: 16,
  },
  timeLabel: {
    fontSize: 12,
    color: TrtleColors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
});
