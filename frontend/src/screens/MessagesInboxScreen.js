import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------
function formatPreviewTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 7) return `${diffDays}d`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

// -------------------------------------------------------------------
// ConversationItem — a single row in the inbox list
// -------------------------------------------------------------------
function ConversationItem({ conversation, onPress }) {
  const { other_user, last_message, unread_count } = conversation;
  const displayName = other_user?.display_name || other_user?.name || 'Unknown';
  const isAnon = !!other_user?.is_anonymous;
  const avatarUrl = isAnon ? null : other_user?.avatar_url;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.item, unread_count > 0 && styles.itemUnread]}
    >
      {/* Avatar */}
      <View style={styles.itemAvatarWrap}>
        {isAnon ? (
          <View style={[styles.itemAvatar, styles.itemAvatarAnon]}>
            <Text style={styles.itemAvatarEmoji}>🎭</Text>
          </View>
        ) : avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.itemAvatar} />
        ) : (
          <View style={[styles.itemAvatar, styles.itemAvatarFallback]}>
            <Text style={styles.itemAvatarText}>{getInitials(displayName)}</Text>
          </View>
        )}
        {/* Unread badge */}
        {unread_count > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {unread_count > 9 ? '9+' : unread_count}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.itemBody}>
        <View style={styles.itemTopRow}>
          <Text
            style={[styles.itemName, unread_count > 0 && styles.itemNameUnread]}
            numberOfLines={1}
          >
            {isAnon ? `🎭 ${displayName}` : displayName}
          </Text>
          <Text style={styles.itemTime}>
            {formatPreviewTime(last_message?.created_at)}
          </Text>
        </View>
        <Text
          style={[styles.itemPreview, unread_count > 0 && styles.itemPreviewUnread]}
          numberOfLines={1}
        >
          {last_message?.content || 'No messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// -------------------------------------------------------------------
// MessagesInboxScreen
// -------------------------------------------------------------------
export default function MessagesInboxScreen() {
  const { token } = useAuth();
  const navigation = useNavigation();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(
    async (isRefresh = false) => {
      try {
        setError('');
        const data = await api.getConversations(token);
        setConversations(data.conversations || []);
      } catch (err) {
        setError(err.message || 'Could not load messages.');
      } finally {
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    load();
  }, [load]);

  function onRefresh() {
    setRefreshing(true);
    load(true);
  }

  function openConversation(conversation) {
    navigation.navigate('Conversation', {
      conversationId: conversation.id,
      otherUser: conversation.other_user,
    });
  }

  // ── Render ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.flex}>
        <Loader style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.flex}>
        <View style={styles.center}>
          <Text style={styles.errorIcon}>📭</Text>
          <Text style={styles.errorTitle}>Couldn't load messages</Text>
          <Text style={styles.errorMsg}>{error}</Text>
          <Button label="Try again" onPress={() => load()} style={styles.retry} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={
          conversations.length === 0 ? styles.emptyContainer : styles.list
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            title="No messages yet"
            message="Start a conversation by visiting a community member's profile."
          />
        }
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => openConversation(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

// -------------------------------------------------------------------
// Styles
// -------------------------------------------------------------------
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  loader: { marginTop: 80 },
  list: { paddingVertical: spacing.sm },
  emptyContainer: { flex: 1, justifyContent: 'center' },

  // Error state
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  errorIcon: { fontSize: 48, marginBottom: spacing.md },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    fontFamily: 'System',
  },
  errorMsg: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontFamily: 'System',
  },
  retry: { width: 200 },

  // List item
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  itemUnread: {
    backgroundColor: colors.primarySoft + '55',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.lg + 52 + spacing.md, // indent past avatar
  },

  // Avatar
  itemAvatarWrap: {
    position: 'relative',
    marginRight: spacing.md,
  },
  itemAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  itemAvatarFallback: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemAvatarAnon: {
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary + '60',
  },
  itemAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  itemAvatarEmoji: {
    fontSize: 26,
  },

  // Unread badge
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.accent,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'System',
  },

  // Item content
  itemBody: {
    flex: 1,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
    fontFamily: 'System',
  },
  itemNameUnread: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  itemTime: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'System',
    flexShrink: 0,
  },
  itemPreview: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'System',
  },
  itemPreviewUnread: {
    color: colors.text,
    fontWeight: '500',
  },
});
