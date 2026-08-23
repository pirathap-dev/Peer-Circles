import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../config';

export default function Loader({ size = 'large', color = colors.primary, style }) {
  return <ActivityIndicator size={size} color={color} style={[styles.center, style]} />;
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
});
