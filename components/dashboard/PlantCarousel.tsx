import { TrtleColors } from '@/constants/theme';
import { Plant } from '@/types/plant';
import React, { useEffect, useRef } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';

interface PlantCarouselProps {
  plants: Plant[];
  selectedId: string;
  onSelect: (plant: Plant) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_MARGIN = 12;

function PlantCard({
  plant,
  isSelected,
  onPress,
  index,
  scrollX,
}: {
  plant: Plant;
  isSelected: boolean;
  onPress: () => void;
  index: number;
  scrollX: Animated.SharedValue<number>;
}) {
  const inputRange = [
    (index - 1) * (CARD_WIDTH + CARD_MARGIN * 2),
    index * (CARD_WIDTH + CARD_MARGIN * 2),
    (index + 1) * (CARD_WIDTH + CARD_MARGIN * 2),
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const getHealthColor = () => {
    if (plant.healthScore >= 80) return TrtleColors.primaryDark;
    if (plant.healthScore >= 60) return TrtleColors.alertMedium;
    return TrtleColors.alertHigh;
  };

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <Pressable
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={onPress}
      >
        <Image source={{ uri: plant.image }} style={styles.image} />
        <View style={styles.gradient} />
        <View style={styles.cardContent}>
          <View style={styles.topRow}>
            <View style={[styles.healthBadge, { backgroundColor: getHealthColor() }]}>
              <Text style={styles.healthText}>{plant.healthScore}%</Text>
            </View>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
            <Text style={styles.plantLocation}>{plant.location}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function PlantCarousel({ plants, selectedId, onSelect }: PlantCarouselProps) {
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Scroll to selected plant on mount
  useEffect(() => {
    const selectedIndex = plants.findIndex(p => p.id === selectedId);
    if (selectedIndex > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: selectedIndex * (CARD_WIDTH + CARD_MARGIN * 2),
          animated: true,
        });
      }, 100);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>My Plants</Text>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {plants.map((plant, index) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            isSelected={plant.id === selectedId}
            onPress={() => onSelect(plant)}
            index={index}
            scrollX={scrollX}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TrtleColors.textDark,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  scrollContent: {
    paddingHorizontal: (width - CARD_WIDTH) / 2 - CARD_MARGIN,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
  },
  card: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: TrtleColors.offWhite,
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: TrtleColors.primaryDark,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  healthBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  healthText: {
    color: TrtleColors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  bottomRow: {
    gap: 4,
  },
  plantName: {
    color: TrtleColors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  plantLocation: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
});
