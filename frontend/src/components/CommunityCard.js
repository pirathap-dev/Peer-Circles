import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../config';
import Button from './Button';

// CommunityCard component displays information about a community and allows users to join or leave the community.

export default function CommunityCard({ community, onPress, onJoin, onLeave, joinLoading }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {community.name}
        </Text>
        <View style={styles.locationBadge}>
          <Text style={styles.locationText}>{community.location}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {community.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.members}>{community.member_count} members</Text>
        {community.is_member ? (
          <Button
            label="Leave"
            variant="outline"
            onPress={onLeave}
            loading={joinLoading}
            style={styles.actionButton}
            textStyle={styles.actionText}
          />
        ) : (
          <Button
            label="Join"
            onPress={onJoin}
            loading={joinLoading}
            style={styles.actionButton}
            textStyle={styles.actionText}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
    fontFamily: 'System',
  },
  locationBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primaryDark,
    fontFamily: 'System',
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.md,
    fontFamily: 'System',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  members: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
    fontFamily: 'System',
  },
  actionButton: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 14,
  },
});
