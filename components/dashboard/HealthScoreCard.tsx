import { TrtleColors } from '@/constants/theme';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface HealthScoreCardProps {
  score: number;
  plantName: string;
  delay?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function HealthScoreCard({ score, plantName, delay = 0 }: HealthScoreCardProps) {
  const progress = useSharedValue(0);
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(score / 100, { duration: 1500, easing: Easing.out(Easing.cubic) })
    );
  }, [score]);

  const animatedCircleStyle = useAnimatedStyle(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  const animatedScoreStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 0.3, 1], [0, 1, 1]),
    };
  });

  const getScoreColor = () => {
    if (score >= 80) return TrtleColors.primaryDark;
    if (score >= 60) return TrtleColors.alertMedium;
    return TrtleColors.alertHigh;
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <View style={styles.container}>
      {/* Decorative elements */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />
      <View style={styles.decorCircle3} />
      
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <View style={styles.titleDot} />
          <Text style={styles.title}>Plant Health</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getScoreColor() + '20' }]}>
          <Text style={[styles.statusBadgeText, { color: getScoreColor() }]}>{getScoreLabel()}</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={TrtleColors.primaryDark} />
              <Stop offset="100%" stopColor={TrtleColors.primaryMedium} />
            </LinearGradient>
          </Defs>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={TrtleColors.offWhite}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress circle */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={score >= 60 ? "url(#scoreGradient)" : getScoreColor()}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeLinecap="round"
              style={animatedCircleStyle}
            />
          </G>
        </Svg>
        <Animated.View style={[styles.scoreContainer, animatedScoreStyle]}>
          <Text style={[styles.scoreText, { color: getScoreColor() }]}>{score}</Text>
          <Text style={styles.percentText}>%</Text>
        </Animated.View>
      </View>

      <View style={styles.plantInfo}>
        <Text style={styles.plantName}>{plantName}</Text>
        <Text style={styles.lastUpdated}>Updated just now</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: TrtleColors.white,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: TrtleColors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TrtleColors.inputBorder + '30',
  },
  decorCircle1: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: TrtleColors.primaryLight,
    opacity: 0.15,
  },
  decorCircle2: {
    position: 'absolute',
    top: 20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: TrtleColors.waterBlue,
    opacity: 0.1,
  },
  decorCircle3: {
    position: 'absolute',
    bottom: -40,
    right: 40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: TrtleColors.primaryMedium,
    opacity: 0.08,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TrtleColors.primaryDark,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: TrtleColors.textDark,
    letterSpacing: -0.3,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: -2,
  },
  percentText: {
    fontSize: 22,
    fontWeight: '600',
    color: TrtleColors.textMuted,
    marginBottom: 10,
    marginLeft: 2,
  },
  plantInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  plantName: {
    fontSize: 20,
    fontWeight: '700',
    color: TrtleColors.textDark,
    letterSpacing: -0.3,
  },
  lastUpdated: {
    fontSize: 13,
    color: TrtleColors.textMuted,
    marginTop: 4,
  },
});
