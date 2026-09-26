import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

/**
 * MemberProfileScreen
 *
 * Displays a community member's (limited) public profile and provides
 * a "Send message" button that starts or resumes a private conversation.
 *
 * Route params:
 *   member: {
 *     id,              // user_id of the other person
 *     name,            // real name (only if not anonymous)
 *     display_name,    // shown name (alias or real name)
 *     avatar_url,
 *     is_anonymous,    // boolean
 *     anon_alias,      // alias string if anonymous
 *   }
 *   communityName (optional string)
 */

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function MemberProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { token, user: currentUser } = useAuth();

  const { member, communityName } = route.params;

  const isAnon = !!member?.is_anonymous;
  const displayName = member?.display_name || member?.anon_alias || member?.name || 'Member';
  const avatarUrl = isAnon ? null : member?.avatar_url;

  const [messaging, setMessaging] = useState(false);

  // Set the screen title
  React.useEffect(() => {
    navigation.setOptions({
      title: isAnon ? 'Member Profile' : displayName,
    });
  }, [navigation, displayName, isAnon]);

  async function handleMessage() {
    if (!member?.id) {
      Alert.alert('Cannot message', 'User information is not available.');
      return;
    }
    if (member.id === currentUser?.id) {
      Alert.alert('That\'s you!', 'You cannot send a message to yourself.');
      return;
    }

    setMessaging(true);
    try {
      // Start or retrieve existing conversation
      const data = await api.startConversation(token, member.id);
      const conversation = data.conversation;

      navigation.navigate('Conversation', {
        conversationId: conversation.id,
        otherUser: {
          id: member.id,
          name: member.name,
          display_name: displayName,
          avatar_url: avatarUrl,
          is_anonymous: isAnon,
        },
      });
    } catch (err) {
      Alert.alert('Could not start conversation', err.message || 'Please try again.');
    } finally {
      setMessaging(false);
    }
  }

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Avatar & identity */}
        <View style={styles.headerCard}>
          {isAnon ? (
            <View style={[styles.avatar, styles.avatarAnon]}>
              <Text style={styles.avatarEmoji}>🎭</Text>
            </View>
          ) : avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitials}>{getInitials(displayName)}</Text>
            </View>
          )}

          <Text style={styles.displayName}>{displayName}</Text>

          {isAnon && (
            <View style={styles.anonBadge}>
              <Text style={styles.anonBadgeText}>🔒 Participating Anonymously</Text>
            </View>
          )}

          {communityName && (
            <Text style={styles.communityLabel}>Member of {communityName}</Text>
          )}
        </View>

        {/* Privacy notice if anonymous */}
        {isAnon && (
          <View style={styles.privacyNotice}>
            <Text style={styles.privacyTitle}>Privacy Notice</Text>
            <Text style={styles.privacyText}>
              This member has chosen to participate anonymously. Their real name and profile
              photo are hidden. You can still send them a private message — they will see your
              identity unless you also participate anonymously.
            </Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          <Button
            label={messaging ? 'Opening chat…' : '💬  Send a message'}
            onPress={handleMessage}
            loading={messaging}
            style={styles.messageBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40 },

  // Header card
  headerCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: spacing.md,
  },
  avatarFallback: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarAnon: {
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '60',
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  avatarEmoji: {
    fontSize: 44,
  },
  displayName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'System',
    marginBottom: 6,
    textAlign: 'center',
  },
  anonBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 8,
  },
  anonBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  communityLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'System',
    marginTop: 4,
  },

  // Privacy notice
  privacyNotice: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  privacyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    fontFamily: 'System',
  },
  privacyText: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    fontFamily: 'System',
  },

  // Actions
  actions: {
    gap: spacing.sm,
  },
  messageBtn: {
    width: '100%',
  },
});
