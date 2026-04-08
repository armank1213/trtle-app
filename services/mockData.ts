import {
    Alert,
    DetectionEvent,
    HealthMetrics,
    Plant,
    PlantTrends,
    SprayLog,
    TrendDataPoint,
} from '@/types/plant';

// Generate 24h trend data with realistic fluctuations
function generateTrendData(baseValue: number, variance: number, points: number = 24): TrendDataPoint[] {
  const now = new Date();
  const data: TrendDataPoint[] = [];
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const fluctuation = (Math.random() - 0.5) * variance;
    const value = Math.max(0, Math.min(100, baseValue + fluctuation));
    data.push({ timestamp, value: Math.round(value * 10) / 10 });
  }
  
  return data;
}

// Mock Plants
export const mockPlants: Plant[] = [
  {
    id: 'plant-1',
    name: 'Tomato Garden',
    species: 'Solanum lycopersicum',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400',
    location: 'Greenhouse A',
    healthScore: 87,
    lastWatered: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastSprayed: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'plant-2',
    name: 'Rose Bed',
    species: 'Rosa gallica',
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400',
    location: 'Garden Section B',
    healthScore: 72,
    lastWatered: new Date(Date.now() - 4 * 60 * 60 * 1000),
    lastSprayed: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: 'plant-3',
    name: 'Herb Garden',
    species: 'Mixed Herbs',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400',
    location: 'Kitchen Window',
    healthScore: 94,
    lastWatered: new Date(Date.now() - 1 * 60 * 60 * 1000),
    lastSprayed: new Date(Date.now() - 72 * 60 * 60 * 1000),
  },
  {
    id: 'plant-4',
    name: 'Pepper Plants',
    species: 'Capsicum annuum',
    image: 'https://images.unsplash.com/photo-1563288958-7e9a08479e3e?w=400',
    location: 'Greenhouse A',
    healthScore: 65,
    lastWatered: new Date(Date.now() - 6 * 60 * 60 * 1000),
    lastSprayed: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];

// Mock Health Metrics (per plant)
export const mockHealthMetrics: Record<string, HealthMetrics> = {
  'plant-1': { soilMoisture: 68, temperature: 24, humidity: 65, lightLevel: 82 },
  'plant-2': { soilMoisture: 45, temperature: 22, humidity: 58, lightLevel: 75 },
  'plant-3': { soilMoisture: 72, temperature: 21, humidity: 70, lightLevel: 60 },
  'plant-4': { soilMoisture: 38, temperature: 26, humidity: 55, lightLevel: 88 },
};

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    plantId: 'plant-2',
    type: 'pest',
    severity: 'high',
    title: 'Aphids Detected',
    description: 'Aphid infestation detected on rose leaves. Immediate treatment recommended.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: false,
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
  },
  {
    id: 'alert-2',
    plantId: 'plant-4',
    type: 'disease',
    severity: 'medium',
    title: 'Early Blight Signs',
    description: 'Early signs of blight detected on pepper leaves. Monitor closely.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
  },
  {
    id: 'alert-3',
    plantId: 'plant-4',
    type: 'water',
    severity: 'medium',
    title: 'Low Soil Moisture',
    description: 'Soil moisture below optimal level. Watering recommended.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: 'alert-4',
    plantId: 'plant-1',
    type: 'pest',
    severity: 'low',
    title: 'Minor Pest Activity',
    description: 'Small number of whiteflies detected. Monitoring situation.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isRead: true,
  },
];

// Mock Detection Events
export const mockDetectionEvents: DetectionEvent[] = [
  {
    id: 'det-1',
    plantId: 'plant-2',
    type: 'pest',
    label: 'Aphids',
    confidence: 0.94,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
  },
  {
    id: 'det-2',
    plantId: 'plant-1',
    type: 'healthy',
    label: 'Healthy Leaf',
    confidence: 0.98,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400',
  },
  {
    id: 'det-3',
    plantId: 'plant-4',
    type: 'disease',
    label: 'Early Blight',
    confidence: 0.82,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1563288958-7e9a08479e3e?w=400',
  },
  {
    id: 'det-4',
    plantId: 'plant-3',
    type: 'healthy',
    label: 'Healthy Growth',
    confidence: 0.96,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400',
  },
  {
    id: 'det-5',
    plantId: 'plant-1',
    type: 'pest',
    label: 'Whiteflies',
    confidence: 0.76,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400',
  },
  {
    id: 'det-6',
    plantId: 'plant-2',
    type: 'healthy',
    label: 'Healthy Bloom',
    confidence: 0.91,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400',
  },
];

// Mock Spray Logs
export const mockSprayLogs: SprayLog[] = [
  {
    id: 'spray-1',
    plantId: 'plant-2',
    type: 'pesticide',
    amount: 150,
    dilutionRatio: '1:100',
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    triggeredBy: 'auto',
  },
  {
    id: 'spray-2',
    plantId: 'plant-1',
    type: 'water',
    amount: 500,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    triggeredBy: 'auto',
  },
  {
    id: 'spray-3',
    plantId: 'plant-3',
    type: 'water',
    amount: 300,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    triggeredBy: 'manual',
  },
];

// Mock Trends (24h data)
export const mockPlantTrends: Record<string, PlantTrends> = {
  'plant-1': {
    healthScore: generateTrendData(87, 8),
    soilMoisture: generateTrendData(68, 15),
    temperature: generateTrendData(24, 3),
    humidity: generateTrendData(65, 10),
  },
  'plant-2': {
    healthScore: generateTrendData(72, 12),
    soilMoisture: generateTrendData(45, 20),
    temperature: generateTrendData(22, 4),
    humidity: generateTrendData(58, 12),
  },
  'plant-3': {
    healthScore: generateTrendData(94, 5),
    soilMoisture: generateTrendData(72, 10),
    temperature: generateTrendData(21, 2),
    humidity: generateTrendData(70, 8),
  },
  'plant-4': {
    healthScore: generateTrendData(65, 15),
    soilMoisture: generateTrendData(38, 18),
    temperature: generateTrendData(26, 4),
    humidity: generateTrendData(55, 14),
  },
};

// Helper functions
export function getPlantById(id: string): Plant | undefined {
  return mockPlants.find(p => p.id === id);
}

export function getAlertsForPlant(plantId: string): Alert[] {
  return mockAlerts.filter(a => a.plantId === plantId);
}

export function getUnreadAlertCount(): number {
  return mockAlerts.filter(a => !a.isRead).length;
}

export function getDetectionsForPlant(plantId: string): DetectionEvent[] {
  return mockDetectionEvents.filter(d => d.plantId === plantId);
}

export function getRecentDetections(limit: number = 10): DetectionEvent[] {
  return [...mockDetectionEvents]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
