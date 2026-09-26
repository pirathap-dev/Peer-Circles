import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MessageBubble from '../components/MessageBubble';
import Loader from '../components/Loader';
import Button from '../components/Button';

// -------------------------------------------------------------------
// DateSeparator — shown between messages on different days
// -------------------------------------------------------------------
function DateSeparator({ label }) {
  return (
    <View style={styles.dateSep}>
      <View style={styles.dateSepLine} />
      <Text style={styles.dateSepLabel}>{label}</Text>
      <View style={styles.dateSepLine} />
    </View>
  );
}

// -------------------------------------------------------------------
// Group messages by date for separators
// -------------------------------------------------------------------
function groupMessages(messages) {
  const items = [];
  let lastDay = null;

  for (const msg of messages) {
    const d = new Date(msg.created_at);
    const day = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (day !== lastDay) {
      lastDay = day;
      items.push({ type: 'date', id: `date-${day}`, label: formatDayLabel(d) });
    }
    items.push({ type: 'message', ...msg });
  }
  return items;
}

//test
function formatDayLabel(d) {
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (isToday) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();
  if (isYesterday) return 'Yesterday';

  return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

// -------------------------------------------------------------------
// ConversationScreen
// -------------------------------------------------------------------
export default function ConversationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { token, user } = useAuth();

  // Params passed when navigating
  const { conversationId, otherUser } = route.params;

  const displayName =
    otherUser?.display_name || otherUser?.name || 'User';
  const isOtherAnon = !!otherUser?.is_anonymous;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const flatListRef = useRef(null);

  // Set screen header title
  useEffect(() => {
    navigation.setOptions({
      title: isOtherAnon ? `🎭 ${displayName}` : displayName,
      headerRight: () => (
        <View style={styles.headerBadge}>
          {isOtherAnon && (
            <View style={styles.anonHeaderBadge}>
              <Text style={styles.anonHeaderBadgeText}>Anonymous</Text>
            </View>
          )}
        </View>
      ),
    });
  }, [navigation, displayName, isOtherAnon]);

  // -------------------------------------------------------------------
  // Load messages
  // -------------------------------------------------------------------
  const load = useCallback(async () => {
    try {
      setError('');
      const data = await api.getMessages(token, conversationId);
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message || 'Could not load messages.');
    } finally {
      setLoading(false);
    }
  }, [token, conversationId]);

  useEffect(() => {
    load();
  }, [load]);

  // Scroll to bottom when messages load / update
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
    }
  }, [messages]);

  // -------------------------------------------------------------------
  // Send message
  // -------------------------------------------------------------------
  async function handleSend() {
    setSendError('');
    const text = messageText.trim();
    if (!text) {
      setSendError('Please write a message first.');
      return;
    }
    setSending(true);
    // Optimistic insert
    const optimistic = {
      id: `opt-${Date.now()}`,
      content: text,
      sender_id: user?.id,
      created_at: new Date().toISOString(),
      is_read: false,
      _optimistic: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    setMessageText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);

    try {
      const data = await api.sendMessage(token, conversationId, text);
      // Replace optimistic with real message
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? data.message : m))
      );
    } catch (err) {
      // Remove optimistic on failure and restore text
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setMessageText(text);
      setSendError(err.message || 'Could not send message. Try again.');
    } finally {
      setSending(false);
    }
  }

  // -------------------------------------------------------------------
  // Delete message (long press)
  // -------------------------------------------------------------------
  function handleLongPress(message) {
    if (message.sender_id !== user?.id) return;
    Alert.alert('Delete message', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteMessage(token, message.id);
            setMessages((prev) => prev.filter((m) => m.id !== message.id));
          } catch (err) {
            Alert.alert('Could not delete', err.message || 'Please try again.');
          }
        },
      },
    ]);
  }

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------
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
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMsg}>{error}</Text>
          <Button label="Try again" onPress={load} style={styles.retry} />
        </View>
      </SafeAreaView>
    );
  }

  const grouped = groupMessages(messages);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView style={styles.flex}>
        {/* Privacy notice for anonymous other user */}
        {isOtherAnon && (
          <View style={styles.anonNotice}>
            <Text style={styles.anonNoticeText}>
              🔒 This person participates anonymously. Their real identity is hidden.
            </Text>
          </View>
        )}

        {/* Messages list */}
        {grouped.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>Start the conversation</Text>
            <Text style={styles.emptyMsg}>
              Send a private message to {isOtherAnon ? 'this member' : displayName}.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={grouped}
            keyExtractor={(item) => item.id?.toString()}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              if (item.type === 'date') {
                return <DateSeparator label={item.label} />;
              }
              const isMine = item.sender_id === user?.id;
              return (
                <TouchableOpacity
                  onLongPress={() => handleLongPress(item)}
                  activeOpacity={0.85}
                  delayLongPress={400}
                >
                  <MessageBubble
                    message={item}
                    isMine={isMine}
                    senderName={isMine ? null : displayName}
                  />
                </TouchableOpacity>
              );
            }}
          />
        )}

        {/* Composer */}
        <View style={styles.composer}>
          {sendError ? (
            <Text style={styles.sendErrorText}>{sendError}</Text>
          ) : null}
          <View style={styles.composerRow}>
            <TextInput
              style={styles.composerInput}
              placeholder={`Message ${isOtherAnon ? 'Anonymous member' : displayName}…`}
              placeholderTextColor={colors.textMuted}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={2000}
              returnKeyType="default"
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={sending || !messageText.trim()}
              style={[
                styles.sendBtn,
                (!messageText.trim() || sending) && styles.sendBtnDisabled,
              ]}
              activeOpacity={0.8}
            >
              {sending ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.sendBtnText}>➤</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// -------------------------------------------------------------------
// Styles
// -------------------------------------------------------------------
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  loader: { marginTop: 80 },

  // Error state
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  errorIcon: { fontSize: 40, marginBottom: spacing.md },
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

  // Anon notice banner
  anonNotice: {
    backgroundColor: colors.primarySoft,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary + '30',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  anonNoticeText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontFamily: 'System',
    lineHeight: 17,
  },

  // Header badge
  headerBadge: {
    marginRight: spacing.sm,
  },
  anonHeaderBadge: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  anonHeaderBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },

  // Empty state
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: { fontSize: 52, marginBottom: spacing.md },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'System',
  },
  emptyMsg: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'System',
  },

  // Messages list
  messageList: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },

  // Date separator
  dateSep: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  dateSepLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dateSepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    fontFamily: 'System',
    paddingHorizontal: spacing.sm,
    letterSpacing: 0.3,
  },

  // Composer
  composer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? spacing.md : spacing.sm,
  },
  sendErrorText: {
    fontSize: 12,
    color: colors.error,
    marginBottom: 6,
    fontFamily: 'System',
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  composerInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 15,
    color: colors.text,
    fontFamily: 'System',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    flexShrink: 0,
  },
  sendBtnDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
