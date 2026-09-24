import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../config';

export default function DiscussionCard({ discussion, onPress, showAuthor = true }) {
  const isAnon = !!discussion.is_anonymous;

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

  // Display name
  const displayName = isAnon
    ? discussion.anon_alias || 'Anonymous'
    : discussion.author_name || 'Anonymous';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.card, isAnon && styles.cardAnon]}
    >
      <View style={styles.header}>
        {showAuthor && (
          <View style={styles.authorRow}>
            {isAnon && <Text style={styles.anonIcon}>🎭 </Text>}
            <Text style={[styles.author, isAnon && styles.authorAnon]} numberOfLines={1}>
              {displayName}
            </Text>
            {isAnon && (
              <View style={styles.anonBadge}>
                <Text style={styles.anonBadgeText}>Anonymous</Text>
              </View>
            )}
          </View>
        )}
        <Text style={styles.date}>{formatDate(discussion.created_at)}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {discussion.title}
      </Text>

      {discussion.content && (
        <Text style={styles.content} numberOfLines={3}>
          {discussion.content}
        </Text>
      )}

      <View style={styles.footer}>
        <View style={styles.commentCount}>
          <Text style={styles.commentIcon}>💬</Text>
          <Text style={styles.commentText}>{discussion.comment_count || 0}</Text>
        </View>
        {isAnon && (
          <View style={styles.anonFooterBadge}>
            <Text style={styles.anonFooterText}>🔒 Posted anonymously</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardAnon: {
    borderColor: colors.primary + '40',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    flexWrap: 'wrap',
    gap: 4,
  },
  anonIcon: {
    fontSize: 12,
  },
  author: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
    fontFamily: 'System',
  },
  authorAnon: {
    fontStyle: 'italic',
    color: colors.primary,
  },
  anonBadge: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  anonBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'System',
    flexShrink: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    fontFamily: 'System',
  },
  content: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.sm,
    fontFamily: 'System',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  commentCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentIcon: {
    fontSize: 14,
  },
  commentText: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'System',
  },
  anonFooterBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  anonFooterText: {
    fontSize: 11,
    color: colors.primaryDark,
    fontFamily: 'System',
    fontWeight: '500',
  },
});