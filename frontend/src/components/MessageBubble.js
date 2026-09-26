import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../config';

/**
 * MessageBubble
 *
 * Props:
 *  message    – { id, content, sender_id, created_at, is_read }
 *  isMine     – boolean (true = right-aligned teal bubble)
 *  senderName – display name / alias for received messages
 */
export default function MessageBubble({ message, isMine, senderName }) {
  const timeLabel = formatTime(message.created_at);

  return (
    <View style={[styles.row, isMine ? styles.rowMine : styles.rowTheirs]}>
      {/* Avatar initial for received messages */}
      {!isMine && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(senderName?.[0] || '?').toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.column}>
        {/* Sender name for received messages */}
        {!isMine && senderName && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}

        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.content, isMine ? styles.contentMine : styles.contentTheirs]}>
            {message.content}
          </Text>
        </View>

        <View style={[styles.metaRow, isMine && styles.metaRowMine]}>
          <Text style={styles.time}>{timeLabel}</Text>
          {isMine && (
            <Text style={[styles.readTick, message.is_read && styles.readTickDone]}>
              {message.is_read ? ' ✓✓' : ' ✓'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  if (sameDay) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'flex-end',
  },
  rowMine: {
    justifyContent: 'flex-end',
  },
  rowTheirs: {
    justifyContent: 'flex-start',
  },

  // Avatar
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: 'System',
  },

  // Column wrapper (max 75% width)
  column: {
    maxWidth: '75%',
  },
  senderName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 3,
    fontFamily: 'System',
  },

  // Bubble
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMine: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleTheirs: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },

  // Text
  content: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: 'System',
  },
  contentMine: {
    color: '#FFFFFF',
  },
  contentTheirs: {
    color: colors.text,
  },

  // Meta row (time + read tick)
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  metaRowMine: {
    justifyContent: 'flex-end',
  },
  time: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'System',
  },
  readTick: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'System',
  },
  readTickDone: {
    color: colors.primary,
  },
});
