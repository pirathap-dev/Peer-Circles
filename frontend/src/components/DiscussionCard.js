import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../config';

export default function DiscussionCard({ discussion, onPress, showAuthor = true }) {
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

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.card}
    >
      <View style={styles.header}>
        {showAuthor && (
          <Text style={styles.author}>{discussion.author_name || 'Anonymous'}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  author: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
    fontFamily: 'System',
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'System',
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
});