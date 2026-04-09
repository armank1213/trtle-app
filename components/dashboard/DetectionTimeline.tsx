import { TrtleColors } from '@/constants/theme';
import { formatTimeAgo } from '@/services/mockData';
import { DetectionEvent } from '@/types/plant';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

interface DetectionTimelineProps {
  detections: DetectionEvent[];
  delay?: number;
  showHeader?: boolean;
}

function DetectionCard({ detection, index }: { detection: DetectionEvent; index: number }) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 400 }));
    translateX.value = withDelay(index * 100, withTiming(0, { duration: 400 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const getTypeColor = () => {
    switch (detection.type) {
      case 'pest':
        return TrtleColors.detectionPest;
      case 'disease':
        return TrtleColors.detectionDisease;
      case 'healthy':
        return TrtleColors.detectionHealthy;
      default:
        return TrtleColors.textMuted;
    }
  };

  const getTypeIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (detection.type) {
      case 'pest':
        return 'bug';
      case 'disease':
        return 'alert-circle';
      case 'healthy':
        return 'checkmark-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Image source={{ uri: detection.imageUrl }} style={styles.image} />
      <View style={[styles.typeBadge, { backgroundColor: getTypeColor() }]}>
        <Ionicons name={getTypeIcon()} size={12} color={TrtleColors.white} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.label} numberOfLines={1}>{detection.label}</Text>
        <Text style={styles.confidence}>{Math.round(detection.confidence * 100)}%</Text>
        <Text style={styles.time}>{formatTimeAgo(detection.timestamp)}</Text>
      </View>
    </Animated.View>
  );
}

export function DetectionTimeline({ detections, delay = 0, showHeader = true }: DetectionTimelineProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 400 }));
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {showHeader && (
        <View style={styles.header}>
          <Text style={styles.title}>Recent Detections</Text>
          <Pressable>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {detections.map((detection, index) => (
          <DetectionCard key={detection.id} detection={detection} index={index} />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: TrtleColors.textDark,
  },
  seeAll: {
    fontSize: 14,
    color: TrtleColors.primaryDark,
    fontWeight: '500',
  },
  scrollContent: {
    paddingRight: 20,
  },
  card: {
    width: 120,
    backgroundColor: TrtleColors.white,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: TrtleColors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 80,
    backgroundColor: TrtleColors.offWhite,
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: TrtleColors.textDark,
  },
  confidence: {
    fontSize: 11,
    color: TrtleColors.textMuted,
    marginTop: 2,
  },
  time: {
    fontSize: 10,
    color: TrtleColors.textMuted,
    marginTop: 4,
  },
});
