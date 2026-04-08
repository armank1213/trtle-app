import { TrtleColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

interface CameraFeedCardProps {
  isLive?: boolean;
  lastSnapshot?: string;
  recentSnapshots?: string[];
  delay?: number;
}

export function CameraFeedCard({
  isLive = false,
  lastSnapshot = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
  recentSnapshots = [],
  delay = 0,
}: CameraFeedCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const livePulse = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500 }));
    
    if (isLive) {
      livePulse.value = withRepeat(
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [isLive]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const liveIndicatorStyle = useAnimatedStyle(() => ({
    opacity: livePulse.value,
  }));

  const defaultSnapshots = [
    'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=200',
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=200',
    'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=200',
    'https://images.unsplash.com/photo-1563288958-7e9a08479e3e?w=200',
  ];

  const snapshots = recentSnapshots.length > 0 ? recentSnapshots : defaultSnapshots;

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="videocam" size={20} color={TrtleColors.primaryDark} />
          <Text style={styles.title}>Camera Feed</Text>
        </View>
        {isLive && (
          <View style={styles.liveContainer}>
            <Animated.View style={[styles.liveDot, liveIndicatorStyle]} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      <Pressable style={styles.mainFeedContainer}>
        <Image source={{ uri: lastSnapshot }} style={styles.mainFeed} />
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Ionicons name="play" size={32} color={TrtleColors.white} />
          </View>
        </View>
        <View style={styles.feedInfo}>
          <Text style={styles.feedLabel}>OAK-D Lite • Greenhouse A</Text>
        </View>
      </Pressable>

      <Text style={styles.snapshotsLabel}>Recent Snapshots</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.snapshotsContainer}
      >
        {snapshots.map((snapshot, index) => (
          <Pressable key={index} style={styles.snapshotItem}>
            <Image source={{ uri: snapshot }} style={styles.snapshotImage} />
          </Pressable>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: TrtleColors.white,
    borderRadius: 20,
    padding: 16,
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
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: TrtleColors.textDark,
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TrtleColors.alertHighBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TrtleColors.alertHigh,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: TrtleColors.alertHigh,
  },
  mainFeedContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  mainFeed: {
    width: '100%',
    height: 180,
    backgroundColor: TrtleColors.offWhite,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  feedInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  feedLabel: {
    color: TrtleColors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  snapshotsLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: TrtleColors.textMuted,
    marginTop: 16,
    marginBottom: 10,
  },
  snapshotsContainer: {
    gap: 10,
  },
  snapshotItem: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  snapshotImage: {
    width: 70,
    height: 70,
    backgroundColor: TrtleColors.offWhite,
  },
});
