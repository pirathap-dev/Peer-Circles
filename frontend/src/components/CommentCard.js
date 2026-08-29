import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../config';

export default function CommentCard({ comment }) {
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
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(comment.author_name || 'A')[0].toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.author}>{comment.author_name || 'Anonymous'}</Text>
          <Text style={styles.date}>{formatDate(comment.created_at)}</Text>
        </View>
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
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
    fontFamily: 'System',
  },
  headerInfo: {
    flex: 1,
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'System',
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'System',
  },
  content: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontFamily: 'System',
  },
});
