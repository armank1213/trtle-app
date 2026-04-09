import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { TrtleColors } from '@/constants/theme';

function TabBarIcon({ name, color, focused }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: TrtleColors.primaryDark,
        tabBarInactiveTintColor: TrtleColors.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 28 : 16,
          left: 24,
          right: 24,
          backgroundColor: TrtleColors.white,
          borderRadius: 28,
          height: 72,
          borderTopWidth: 0,
          shadowColor: TrtleColors.primaryDeep,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
          paddingHorizontal: 14,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 10 : 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 3,
        },
        tabBarItemStyle: {
          borderRadius: 20,
          marginHorizontal: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'leaf' : 'leaf-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="trtle"
        options={{
          title: 'Trtle',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: TrtleColors.primaryLight + '40',
  },
});
