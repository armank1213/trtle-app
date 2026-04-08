export interface Plant {
  id: string;
  name: string;
  species: string;
  image: string;
  location: string;
  healthScore: number;
  lastWatered: Date;
  lastSprayed: Date;
}

export interface HealthMetrics {
  soilMoisture: number;      // 0-100 percentage
  temperature: number;        // Celsius
  humidity: number;           // 0-100 percentage
  lightLevel: number;         // 0-100 percentage
}

export interface Alert {
  id: string;
  plantId: string;
  type: 'disease' | 'pest' | 'water' | 'nutrient';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  imageUrl?: string;
}

export interface DetectionEvent {
  id: string;
  plantId: string;
  type: 'disease' | 'pest' | 'healthy';
  label: string;
  confidence: number;         // 0-1
  timestamp: Date;
  imageUrl: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SprayLog {
  id: string;
  plantId: string;
  type: 'water' | 'pesticide';
  amount: number;             // milliliters
  dilutionRatio?: string;     // e.g., "1:100"
  timestamp: Date;
  triggeredBy: 'auto' | 'manual';
}

export interface TrendDataPoint {
  timestamp: Date;
  value: number;
}

export interface PlantTrends {
  healthScore: TrendDataPoint[];
  soilMoisture: TrendDataPoint[];
  temperature: TrendDataPoint[];
  humidity: TrendDataPoint[];
}

export interface CameraFeed {
  isLive: boolean;
  lastSnapshot: string;
  recentSnapshots: string[];
}
