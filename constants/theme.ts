/**
 * Trtle App Theme - Light green and white color scheme
 * Smart irrigation system with turtle, leaf, and water droplet motifs
 */

import { Platform } from 'react-native';

// Trtle brand colors
export const TrtleColors = {
  // Primary greens
  primaryLight: '#90EE90',      // Light green (main)
  primaryMedium: '#7CCD7C',     // Medium green
  primaryDark: '#32CD32',       // Lime green (accent)
  primaryDeep: '#228B22',       // Forest green (text/icons)
  
  // Secondary/Background whites
  white: '#FFFFFF',
  offWhite: '#F5FFF5',          // Slight green tint
  cream: '#F0FFF0',             // Honeydew
  
  // Accent colors
  waterBlue: '#87CEEB',         // Sky blue for water elements
  waterBlueDark: '#4A90D9',     // Darker blue for contrast
  
  // Text colors
  textDark: '#1A3D1A',          // Dark green text
  textMedium: '#2E5A2E',        // Medium green text
  textLight: '#4A7A4A',         // Light green text
  textMuted: '#6B8E6B',         // Muted green
  
  // UI colors
  inputBorder: '#B8E0B8',       // Light green border
  inputBorderFocus: '#32CD32',  // Focused input border
  placeholder: '#8FBC8F',       // Dark sea green
  error: '#DC3545',             // Error red
  
  // Alert severity colors
  alertHigh: '#DC3545',         // Red - high severity
  alertMedium: '#FFC107',       // Yellow/Amber - medium severity
  alertLow: '#28A745',          // Green - low severity
  alertHighBg: '#FFF5F5',       // Light red background
  alertMediumBg: '#FFFBEB',     // Light yellow background
  alertLowBg: '#F0FFF4',        // Light green background
  
  // Detection type colors
  detectionPest: '#E53E3E',     // Red for pests
  detectionDisease: '#DD6B20',  // Orange for disease
  detectionHealthy: '#38A169',  // Green for healthy
  
  // Gradient colors
  gradientStart: '#F0FFF0',     // Top of gradient
  gradientMiddle: '#E8FFE8',    // Middle
  gradientEnd: '#D0F0D0',       // Bottom of gradient
};

// Legacy Colors export for compatibility
const tintColorLight = TrtleColors.primaryDark;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: TrtleColors.textDark,
    background: TrtleColors.white,
    tint: tintColorLight,
    icon: TrtleColors.textMuted,
    tabIconDefault: TrtleColors.textMuted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
