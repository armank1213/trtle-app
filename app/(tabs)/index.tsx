import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Pressable,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

import { AlertBadge } from '@/components/dashboard/AlertBadge';
import { CameraFeedCard } from '@/components/dashboard/CameraFeedCard';
import { ControlButton } from '@/components/dashboard/ControlButton';
import { DetectionTimeline } from '@/components/dashboard/DetectionTimeline';
import { HealthScoreCard } from '@/components/dashboard/HealthScoreCard';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { PlantCarousel } from '@/components/dashboard/PlantCarousel';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { DecorativeBackground } from '@/components/ui/DecorativeBackground';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TrtleColors } from '@/constants/theme';
import {
    getRecentDetections,
    getUnreadAlertCount,
    mockHealthMetrics,
    mockPlants,
    mockPlantTrends,
} from '@/services/mockData';
import { sprayPesticide, waterPlant } from '@/services/controlApi';
import { Plant } from '@/types/plant';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [selectedPlant, setSelectedPlant] = useState<Plant>(mockPlants[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState<'sensors' | 'trend' | 'detections' | 'camera'>('sensors');
  
  const headerOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handlePlantSelect = (plant: Plant) => {
    setSelectedPlant(plant);
  };

  const handleWater = async () => {
    await waterPlant();
    console.log('Watering plant:', selectedPlant.name);
  };

  const handleSpray = async () => {
    await sprayPesticide();
    console.log('Spraying pesticide on:', selectedPlant.name);
  };

  const metrics = mockHealthMetrics[selectedPlant.id];
  const trends = mockPlantTrends[selectedPlant.id];
  const unreadAlerts = getUnreadAlertCount();
  const recentDetections = getRecentDetections(6);

  return (
    <GradientBackground>
      <DecorativeBackground />
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good Morning</Text>
            <View style={styles.subtitleRow}>
              <View style={styles.statusDot} />
              <Text style={styles.subtitle}>All systems healthy</Text>
            </View>
          </View>
          <AlertBadge count={unreadAlerts} onPress={() => console.log('Open alerts')} />
        </Animated.View>

        {/* Content */}
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={TrtleColors.primaryDark}
                colors={[TrtleColors.primaryDark]}
              />
            }
          >
            {/* Plant Carousel */}
            <View style={styles.carouselSection}>
              <PlantCarousel
                plants={mockPlants}
                selectedId={selectedPlant.id}
                onSelect={handlePlantSelect}
              />
            </View>

            {/* Health Score */}
            <View style={styles.healthSection}>
              <HealthScoreCard
                score={selectedPlant.healthScore}
                plantName={selectedPlant.name}
                delay={100}
              />
            </View>

            {/* Metrics Section */}
            <View style={styles.metricsSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Live Sensors</Text>
                <Text style={styles.sectionHint}>Real-time</Text>
              </View>
              <View style={styles.metricsGrid}>
                <MetricCard type="moisture" value={metrics.soilMoisture} delay={200} />
                <MetricCard type="temperature" value={metrics.temperature} delay={300} />
              </View>
              <View style={styles.metricsGrid}>
                <MetricCard type="humidity" value={metrics.humidity} delay={400} />
                <MetricCard type="light" value={metrics.lightLevel} delay={500} />
              </View>
            </View>

            <View style={styles.quickNavWrap}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickNavRow}
              >
                {[
                  { id: 'sensors', label: 'Sensors', icon: 'speedometer-outline' as const },
                  { id: 'trend', label: 'Trend', icon: 'analytics-outline' as const },
                  { id: 'detections', label: 'Detections', icon: 'scan-circle-outline' as const },
                  { id: 'camera', label: 'Camera', icon: 'videocam-outline' as const },
                ].map((item) => {
                  const selected = activeSection === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      style={[styles.quickChip, selected && styles.quickChipActive]}
                      onPress={() => setActiveSection(item.id as typeof activeSection)}
                    >
                      <Ionicons
                        name={item.icon}
                        size={14}
                        color={selected ? TrtleColors.white : TrtleColors.primaryDeep}
                      />
                      <Text style={[styles.quickChipText, selected && styles.quickChipTextActive]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Health Trend Chart */}
            <View style={styles.chartSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Plant Trend</Text>
                <Text style={styles.sectionHint}>24h</Text>
              </View>
              <TrendChart
                data={trends.healthScore}
                title="Health Score"
                color={TrtleColors.primaryDark}
                unit="%"
                delay={600}
                showHeader={false}
              />
            </View>

            {/* Detection Timeline */}
            <View style={styles.timelineSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Detections</Text>
                <Text style={styles.sectionHint}>Latest events</Text>
              </View>
              <DetectionTimeline detections={recentDetections} delay={700} showHeader={false} />
            </View>

            {/* Camera Feed */}
            <View style={styles.cameraSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Camera Feed</Text>
                <Text style={styles.sectionHint}>Live</Text>
              </View>
              <CameraFeedCard isLive={true} delay={800} showHeader={false} />
            </View>

            {/* Control Buttons */}
            <View style={styles.controlsSection}>
              <View style={styles.controlsHeader}>
                <Text style={styles.sectionTitle}>Manual Controls</Text>
                <View style={styles.controlsSubtitle}>
                  <View style={[styles.statusDot, styles.statusDotSmall]} />
                  <Text style={styles.controlsHint}>Tap to activate</Text>
                </View>
              </View>
              <View style={styles.controlsRow}>
                <ControlButton type="water" onConfirm={handleWater} />
                <ControlButton type="spray" onConfirm={handleSpray} />
              </View>
            </View>

            {/* Bottom Spacer for floating navbar */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: TrtleColors.textDark,
    letterSpacing: -0.5,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TrtleColors.primaryDark,
    marginRight: 8,
  },
  statusDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  subtitle: {
    fontSize: 14,
    color: TrtleColors.textMuted,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  carouselSection: {
    marginTop: 8,
  },
  healthSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  metricsSection: {
    paddingHorizontal: 24,
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TrtleColors.textDark,
    letterSpacing: -0.3,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHint: {
    backgroundColor: TrtleColors.primaryLight + '40',
    color: TrtleColors.primaryDeep,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  quickNavWrap: {
    marginTop: 2,
    marginBottom: 8,
  },
  quickNavRow: {
    paddingHorizontal: 24,
    gap: 10,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: TrtleColors.white,
    borderWidth: 1,
    borderColor: TrtleColors.inputBorder,
  },
  quickChipActive: {
    backgroundColor: TrtleColors.primaryDark,
    borderColor: TrtleColors.primaryDark,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: TrtleColors.primaryDeep,
  },
  quickChipTextActive: {
    color: TrtleColors.white,
  },
  chartSection: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  timelineSection: {
    paddingHorizontal: 24,
    marginTop: 28,
  },
  cameraSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  controlsSection: {
    paddingHorizontal: 24,
    marginTop: 28,
  },
  controlsHeader: {
    marginBottom: 16,
  },
  controlsSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  controlsHint: {
    fontSize: 13,
    color: TrtleColors.textMuted,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bottomSpacer: {
    height: 120,
  },
});
