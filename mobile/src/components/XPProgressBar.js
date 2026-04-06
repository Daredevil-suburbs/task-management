import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { Colors } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function XPProgressBar({ progress }) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: widthInterpolation }]}>
          <LinearGradient
            colors={[Colors.purpleDark, Colors.gold]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  track: {
    height: 10,
    backgroundColor: Colors.bgSecondary,
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: Colors.border,
    borderWidth: 1,
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});
