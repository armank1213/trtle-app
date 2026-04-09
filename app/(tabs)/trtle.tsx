import { DecorativeBackground } from '@/components/ui/DecorativeBackground';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TrtleColors } from '@/constants/theme';
import { mockHealthMetrics, mockPlants } from '@/services/mockData';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

const quickPrompts = [
  'How often should I water today?',
  'Any pest prevention tip for this week?',
  'How can I improve health score quickly?',
  'Give me a morning checklist.',
];

const getRecommendation = (input: string): string => {
  const lower = input.toLowerCase();
  const focusPlant = mockPlants[0];
  const metrics = mockHealthMetrics[focusPlant.id];

  if (lower.includes('water')) {
    return `${focusPlant.name} soil moisture is ${metrics.soilMoisture}%. Keep it around 55-70%. Water lightly now and recheck in 2-3 hours.`;
  }

  if (lower.includes('pest') || lower.includes('spray')) {
    return `For ${focusPlant.name}, inspect leaf undersides tonight and spray only at dusk to avoid leaf burn. Keep airflow strong after spraying.`;
  }

  if (lower.includes('health')) {
    return `Quick health boost: maintain moisture near 65%, keep temperature stable near ${metrics.temperature}°C, and remove any damaged leaves to reduce stress.`;
  }

  if (lower.includes('checklist')) {
    return 'Morning checklist: 1) Check soil moisture 2) Scan top and undersides of leaves 3) Verify humidity and temperature 4) Note any yellowing or spots.';
  }

  return `For ${focusPlant.name}, today focus on stable moisture (${metrics.soilMoisture}%), gentle airflow, and a quick visual pest scan before sunset.`;
};

export default function TrtleChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hi, I’m Trtle 🌱 I can help with watering, pest prevention, and daily care recommendations based on your plant data.',
    },
  ]);

  const suggestionChips = useMemo(() => quickPrompts.slice(0, 3), []);

  const sendMessage = (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
    };
    const assistantMessage: ChatMessage = {
      id: `a-${Date.now() + 1}`,
      role: 'assistant',
      text: getRecommendation(text),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  return (
    <GradientBackground>
      <DecorativeBackground />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Ionicons name="leaf" size={18} color={TrtleColors.primaryDeep} />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>Trtle Assistant</Text>
              <Text style={styles.headerSubtitle}>Plant care recommendations</Text>
            </View>
          </View>

          <View style={styles.chipsRow}>
            {suggestionChips.map((prompt) => (
              <Pressable key={prompt} style={styles.chip} onPress={() => sendMessage(prompt)}>
                <Text style={styles.chipText}>{prompt}</Text>
              </Pressable>
            ))}
          </View>

          <ScrollView contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <View
                  key={message.id}
                  style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.assistantBubble,
                  ]}>
                  <Text style={[styles.messageText, isUser && styles.userMessageText]}>{message.text}</Text>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask Trtle about your plants..."
              placeholderTextColor={TrtleColors.placeholder}
              style={styles.input}
              multiline
            />
            <Pressable style={styles.sendButton} onPress={() => sendMessage()}>
              <Ionicons name="arrow-up" size={18} color={TrtleColors.white} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 96,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TrtleColors.primaryLight + '50',
    marginRight: 10,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: TrtleColors.textDark,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: TrtleColors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: TrtleColors.white,
    borderWidth: 1,
    borderColor: TrtleColors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  chipText: {
    color: TrtleColors.textMedium,
    fontSize: 12,
    fontWeight: '600',
  },
  chatContent: {
    paddingBottom: 16,
    gap: 10,
  },
  messageBubble: {
    maxWidth: '86%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: TrtleColors.white,
    borderWidth: 1,
    borderColor: TrtleColors.inputBorder,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: TrtleColors.primaryDark,
  },
  messageText: {
    color: TrtleColors.textDark,
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: TrtleColors.white,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    backgroundColor: TrtleColors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: TrtleColors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    minHeight: 24,
    maxHeight: 90,
    fontSize: 15,
    color: TrtleColors.textDark,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TrtleColors.primaryDark,
    marginBottom: 2,
  },
});
