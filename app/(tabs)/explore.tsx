import { DecorativeBackground } from '@/components/ui/DecorativeBackground';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TrtleColors } from '@/constants/theme';
import { getRecentDetections, mockHealthMetrics, mockPlants } from '@/services/mockData';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const getStatusTone = (value: number, high: number, medium: number) => {
  if (value >= high) return { label: 'Good', color: TrtleColors.alertLow };
  if (value >= medium) return { label: 'Fair', color: TrtleColors.alertMedium };
  return { label: 'Needs attention', color: TrtleColors.alertHigh };
};

export default function AnalyticsScreen() {
  const recent = useMemo(() => getRecentDetections(4), []);

  const avgMoisture = Math.round(
    Object.values(mockHealthMetrics).reduce((sum, m) => sum + m.soilMoisture, 0) /
      Object.values(mockHealthMetrics).length
  );
  const avgHealth = Math.round(
    mockPlants.reduce((sum, plant) => sum + plant.healthScore, 0) / mockPlants.length
  );

  const moistureTone = getStatusTone(avgMoisture, 60, 45);
  const healthTone = getStatusTone(avgHealth, 80, 65);

  return (
    <GradientBackground>
      <DecorativeBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Analytics Overview</Text>
            <Text style={styles.subtitle}>Daily status and recent detections</Text>
          </View>

          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Avg Health Score</Text>
              <Text style={styles.kpiValue}>{avgHealth}%</Text>
              <Text style={[styles.kpiHint, { color: healthTone.color }]}>{healthTone.label}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Avg Soil Moisture</Text>
              <Text style={styles.kpiValue}>{avgMoisture}%</Text>
              <Text style={[styles.kpiHint, { color: moistureTone.color }]}>{moistureTone.label}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent detections</Text>
              <Text style={styles.sectionMeta}>Last 24 hours</Text>
            </View>
            {recent.map((item) => (
              <View key={item.id} style={styles.eventRow}>
                <View style={styles.eventIcon}>
                  <Ionicons
                    name={
                      item.type === 'healthy'
                        ? 'checkmark-circle'
                        : item.type === 'pest'
                          ? 'bug'
                          : 'alert-circle'
                    }
                    size={16}
                    color={
                      item.type === 'healthy'
                        ? TrtleColors.detectionHealthy
                        : item.type === 'pest'
                          ? TrtleColors.detectionPest
                          : TrtleColors.detectionDisease
                    }
                  />
                </View>
                <View style={styles.eventTextWrap}>
                  <Text style={styles.eventTitle}>{item.label}</Text>
                  <Text style={styles.eventSub}>Confidence {(item.confidence * 100).toFixed(0)}%</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 112,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TrtleColors.textDark,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: TrtleColors.textMuted,
    fontWeight: '500',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: TrtleColors.white,
    borderRadius: 18,
    padding: 16,
    shadowColor: TrtleColors.primaryDeep,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TrtleColors.textMuted,
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 26,
    fontWeight: '700',
    color: TrtleColors.textDark,
    letterSpacing: -0.5,
  },
  kpiHint: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    backgroundColor: TrtleColors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: TrtleColors.offWhite,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TrtleColors.textDark,
  },
  sectionMeta: {
    fontSize: 12,
    color: TrtleColors.textMuted,
    fontWeight: '600',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TrtleColors.inputBorder,
  },
  eventIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TrtleColors.offWhite,
  },
  eventTextWrap: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TrtleColors.textDark,
  },
  eventSub: {
    marginTop: 2,
    fontSize: 12,
    color: TrtleColors.textMuted,
  },
});
