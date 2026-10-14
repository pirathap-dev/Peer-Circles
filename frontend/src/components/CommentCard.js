import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../config';

export default function CommentCard({ comment, canDelete, onDelete }) {
  const isAnon = !!comment.is_anonymous;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Display name: use anon_alias from backend if anonymous, else author_name
  const displayName = isAnon
    ? comment.anon_alias || 'Anonymous'
    : comment.author_name || 'Unknown';

  // Avatar letter
  const avatarLetter = isAnon ? '🎭' : (displayName[0] || '?').toUpperCase();

  return (
    <View style={[styles.card, isAnon && styles.cardAnon]}>
      <View style={styles.header}>
        {/* Avatar */}
        <View style={[styles.avatar, isAnon && styles.avatarAnon]}>
          {isAnon ? (
            <Text style={styles.avatarEmoji}>{avatarLetter}</Text>
          ) : (
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          )}
        </View>

        {/* Name + date */}
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.author, isAnon && styles.authorAnon]}>
              {displayName}
            </Text>
            {isAnon && (
              <View style={styles.anonBadge}>
                <Text style={styles.anonBadgeText}>Anonymous</Text>
              </View>
            )}
          </View>
          <Text style={styles.date}>{formatDate(comment.created_at)}</Text>
        </View>

        {/* Delete button (own comments only) */}
        {canDelete && (
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Delete comment"
          >
            <Text style={styles.deleteIcon}>🗑</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.content}>{comment.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardAnon: {
    borderColor: colors.primary + '40',
    backgroundColor: colors.primarySoft + 'AA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarAnon: {
    backgroundColor: colors.primary + '20',
    borderWidth: 1.5,
    borderColor: colors.primary + '50',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
    fontFamily: 'System',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'System',
  },
  authorAnon: {
    color: colors.primaryDark,
    fontStyle: 'italic',
  },
  anonBadge: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  anonBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'System',
    marginTop: 2,
  },
  deleteIcon: {
    fontSize: 16,
    paddingLeft: spacing.sm,
  },
  content: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontFamily: 'System',
  },
});
