import { TrtleColors } from '@/constants/theme';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export function DecorativeBackground() {
  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={TrtleColors.primaryLight} stopOpacity="0.15" />
            <Stop offset="100%" stopColor={TrtleColors.primaryLight} stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={TrtleColors.waterBlue} stopOpacity="0.1" />
            <Stop offset="100%" stopColor={TrtleColors.waterBlue} stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="grad3" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={TrtleColors.primaryMedium} stopOpacity="0.12" />
            <Stop offset="100%" stopColor={TrtleColors.primaryMedium} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Large decorative circles */}
        <Circle cx={-50} cy={120} r={180} fill="url(#grad1)" />
        <Circle cx={width + 80} cy={350} r={220} fill="url(#grad2)" />
        <Circle cx={-30} cy={height - 200} r={160} fill="url(#grad3)" />
        <Circle cx={width - 40} cy={height - 400} r={140} fill="url(#grad1)" />

        {/* Decorative leaf shapes */}
        <Path
          d="M-20 280 Q30 250 60 300 Q30 350 -20 320 Z"
          fill={TrtleColors.primaryLight}
          opacity={0.15}
        />
        <Path
          d={`M${width - 30} 180 Q${width + 20} 150 ${width + 50} 200 Q${width + 20} 250 ${width - 30} 220 Z`}
          fill={TrtleColors.primaryMedium}
          opacity={0.12}
        />
        <Path
          d={`M${width - 60} ${height - 300} Q${width - 10} ${height - 330} ${width + 20} ${height - 280} Q${width - 10} ${height - 230} ${width - 60} ${height - 260} Z`}
          fill={TrtleColors.waterBlue}
          opacity={0.1}
        />

        {/* Small dots pattern */}
        <Circle cx={80} cy={200} r={4} fill={TrtleColors.primaryDark} opacity={0.08} />
        <Circle cx={100} cy={220} r={3} fill={TrtleColors.primaryDark} opacity={0.06} />
        <Circle cx={60} cy={240} r={5} fill={TrtleColors.primaryDark} opacity={0.05} />
        
        <Circle cx={width - 100} cy={500} r={4} fill={TrtleColors.waterBlueDark} opacity={0.08} />
        <Circle cx={width - 80} cy={520} r={3} fill={TrtleColors.waterBlueDark} opacity={0.06} />
        <Circle cx={width - 120} cy={540} r={5} fill={TrtleColors.waterBlueDark} opacity={0.05} />

        <Circle cx={150} cy={height - 350} r={4} fill={TrtleColors.primaryMedium} opacity={0.08} />
        <Circle cx={130} cy={height - 330} r={3} fill={TrtleColors.primaryMedium} opacity={0.06} />
        <Circle cx={170} cy={height - 370} r={5} fill={TrtleColors.primaryMedium} opacity={0.05} />

        {/* Curved lines */}
        <Path
          d={`M0 400 Q${width / 4} 380 ${width / 2} 420 Q${width * 0.75} 460 ${width} 440`}
          stroke={TrtleColors.primaryLight}
          strokeWidth={1.5}
          fill="none"
          opacity={0.15}
        />
        <Path
          d={`M0 ${height - 250} Q${width / 3} ${height - 280} ${width / 2} ${height - 240} Q${width * 0.7} ${height - 200} ${width} ${height - 230}`}
          stroke={TrtleColors.waterBlue}
          strokeWidth={1}
          fill="none"
          opacity={0.12}
        />
      </Svg>

      {/* Glassmorphism accent shapes */}
      <View style={[styles.glassShape, styles.glassShape1]} />
      <View style={[styles.glassShape, styles.glassShape2]} />
      <View style={[styles.glassShape, styles.glassShape3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glassShape: {
    position: 'absolute',
    backgroundColor: TrtleColors.white,
    opacity: 0.4,
  },
  glassShape1: {
    width: 120,
    height: 120,
    borderRadius: 60,
    top: 100,
    right: -40,
  },
  glassShape2: {
    width: 80,
    height: 80,
    borderRadius: 40,
    top: height * 0.45,
    left: -30,
  },
  glassShape3: {
    width: 100,
    height: 100,
    borderRadius: 50,
    bottom: 200,
    right: -20,
  },
});
