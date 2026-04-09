import { TrtleColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

type ControlType = 'water' | 'spray';

interface ControlButtonProps {
  type: ControlType;
  onConfirm: () => void | Promise<void>;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const controlConfig: Record<ControlType, {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  confirmTitle: string;
  confirmMessage: string;
}> = {
  water: {
    icon: 'water',
    label: 'Water Now',
    color: TrtleColors.waterBlueDark,
    confirmTitle: 'Start Watering?',
    confirmMessage: 'This will trigger manual watering for the selected plant.',
  },
  spray: {
    icon: 'flask',
    label: 'Spray Pesticide',
    color: TrtleColors.primaryDark,
    confirmTitle: 'Spray Pesticide?',
    confirmMessage: 'This will dilute and spray pesticide solution on the selected plant.',
  },
};

export function ControlButton({ type, onConfirm, disabled = false }: ControlButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const scale = useSharedValue(1);
  const config = controlConfig[type];

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setLoading(false);
      setShowModal(false);
    } catch (error) {
      setLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';
      Alert.alert(`${config.label} failed`, errorMessage);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <>
      <AnimatedPressable
        style={[
          styles.button,
          { backgroundColor: config.color },
          disabled && styles.disabled,
          animatedStyle,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <Ionicons name={config.icon} size={22} color={TrtleColors.white} />
        <Text style={styles.buttonText}>{config.label}</Text>
      </AnimatedPressable>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalIcon, { backgroundColor: config.color + '20' }]}>
              <Ionicons name={config.icon} size={40} color={config.color} />
            </View>
            <Text style={styles.modalTitle}>{config.confirmTitle}</Text>
            <Text style={styles.modalMessage}>{config.confirmMessage}</Text>
            
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmButton, { backgroundColor: config.color }]}
                onPress={handleConfirm}
                disabled={loading}
              >
                {loading ? (
                  <Text style={styles.confirmButtonText}>Processing...</Text>
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: TrtleColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: TrtleColors.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TrtleColors.textDark,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: TrtleColors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: TrtleColors.offWhite,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TrtleColors.textMuted,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TrtleColors.white,
  },
});
