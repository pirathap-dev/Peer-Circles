/**
 * AnonymousToggle.js
 *
 * A reusable toggle component that lets users choose whether to participate
 * anonymously. Shows a clear visual indicator and an explanation of what
 * anonymity means in the context of Peer Circles.
 */
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { colors, spacing } from '../config';

export default function AnonymousToggle({ value, onChange, compact = false }) {
  // Animated value drives the thumb position (0 = off, 1 = on)
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      tension: 80,
      friction: 8,
    }).start();
  }, [value, anim]);

  // Interpolate track colour
  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  // Interpolate thumb position
  const thumbX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  if (compact) {
    // Compact mode used in the comment composer row
    return (
      <TouchableOpacity
        onPress={() => onChange(!value)}
        activeOpacity={0.8}
        style={styles.compactRow}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        accessibilityLabel="Post anonymously"
      >
        <Text style={styles.maskIcon}>🎭</Text>
        <Text style={styles.compactLabel}>
          {value ? 'Anonymous' : 'Anon'}
        </Text>
        {/* Mini track */}
        <Animated.View style={[styles.trackMini, { backgroundColor: trackColor }]}>
          <Animated.View style={[styles.thumbMini, { transform: [{ translateX: thumbX }] }]} />
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header row */}
      <TouchableOpacity
        onPress={() => onChange(!value)}
        activeOpacity={0.85}
        style={[styles.row, value && styles.rowActive]}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        accessibilityLabel="Participate anonymously"
      >
        {/* Left icon + text */}
        <View style={styles.left}>
          <View style={[styles.iconBadge, value && styles.iconBadgeActive]}>
            <Text style={styles.icon}>{value ? '🎭' : '👤'}</Text>
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.title, value && styles.titleActive]}>
              {value ? 'Posting Anonymously' : 'Post as yourself'}
            </Text>
            <Text style={styles.subtitle}>
              {value
                ? 'Your name is hidden from other members'
                : 'Your display name will be visible'}
            </Text>
          </View>
        </View>

        {/* Track + thumb */}
        <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
          <Animated.View
            style={[styles.thumb, { transform: [{ translateX: thumbX }] }]}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Expanded info banner when anonymous is ON */}
      {value && (
        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoText}>
            You will appear as a randomly generated alias (e.g. "Anonymous Sparrow").
            Moderators can still see your account for safety purposes.
          </Text>
        </View>
      )}
    </View>
  );
}

const TRACK_W = 46;
const TRACK_H = 26;
const THUMB_SIZE = 22;

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  rowActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  iconBadgeActive: {
    backgroundColor: colors.primary,
  },
  icon: {
    fontSize: 20,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'System',
    marginBottom: 2,
  },
  titleActive: {
    color: colors.primaryDark,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'System',
    lineHeight: 17,
  },
  // Toggle track
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: 'center',
    flexShrink: 0,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  // Info banner
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 6,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 18,
    fontFamily: 'System',
  },

  // Compact mode (for comment composer)
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  maskIcon: {
    fontSize: 14,
  },
  compactLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    fontFamily: 'System',
    marginRight: 2,
  },
  trackMini: {
    width: 34,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
  },
  thumbMini: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
