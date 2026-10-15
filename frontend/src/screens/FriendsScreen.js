import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Loader from '../components/Loader';

function getInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function PersonRow({ person, actions, onPress, subtitle }) {
  return (
    <View style={styles.personRow}>
      <TouchableOpacity
        style={styles.personDetails}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
        disabled={!onPress}
      >
        {person.avatar_url ? (
          <Image source={{ uri: person.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitials}>{getInitials(person.name)}</Text>
          </View>
        )}
        <View style={styles.personText}>
          <Text style={styles.personName} numberOfLines={1}>{person.name}</Text>
          {subtitle ? <Text style={styles.personSubtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
      </TouchableOpacity>
      <View style={styles.rowActions}>{actions}</View>
    </View>
  );
}

export default function FriendsScreen() {
  const navigation = useNavigation();
  const { token, user } = useAuth();
  const [relationships, setRelationships] = useState({
    friends: [],
    incomingRequests: [],
    outgoingRequests: [],
  });
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState('');
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [pendingAction, setPendingAction] = useState('');
  const [error, setError] = useState('');

  const loadRelationships = useCallback(async () => {
    try {
      setError('');
      const data = await api.getFriendRelationships(token);
      setRelationships(data);
    } catch (err) {
      setError(err.message || 'Could not load friends.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadRelationships();
      let loadingConversations = false;
      const loadConversations = async () => {
        if (loadingConversations) return;
        loadingConversations = true;
        try {
          const data = await api.getConversations(token);
          setConversations(data.conversations || []);
        } catch (err) {
          console.warn('Could not refresh private messages:', err.message);
        } finally {
          loadingConversations = false;
        }
      };
      loadConversations();
      const interval = setInterval(loadConversations, 5000);
      return () => clearInterval(interval);
    }, [loadRelationships, token])
  );

  useEffect(() => {
    const term = search.trim();
    if (term.length < 2) {
      setPeople([]);
      setSearching(false);
      return undefined;
    }

    let active = true;
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const data = await api.searchPeople(token, term);
        if (active) setPeople(data.users || []);
      } catch (err) {
        if (active) Alert.alert('Could not search people', err.message || 'Please try again.');
      } finally {
        if (active) setSearching(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, token]);

  async function openChat(person) {
    try {
      const data = await api.startConversation(token, person.id);
      navigation.navigate('Conversation', {
        conversationId: data.conversation.id,
        otherUser: {
          id: person.id,
          name: person.name,
          display_name: person.name,
          avatar_url: person.avatar_url,
          is_anonymous: false,
        },
      });
    } catch (err) {
      Alert.alert('Could not open chat', err.message || 'Please try again.');
    }
  }

  function openConversation(conversation) {
    navigation.navigate('Conversation', {
      conversationId: conversation.id,
      otherUser: conversation.other_user,
    });
  }

  async function performAction(key, action) {
    setPendingAction(key);
    try {
      await action();
      await loadRelationships();
      if (search.trim().length >= 2) {
        const data = await api.searchPeople(token, search.trim());
        setPeople(data.users || []);
      }
    } catch (err) {
      Alert.alert('Could not update friends', err.message || 'Please try again.');
    } finally {
      setPendingAction('');
    }
  }

  function sendRequest(person) {
    return performAction(`add-${person.id}`, () => api.sendFriendRequest(token, person.id));
  }

  function respond(request, action) {
    return performAction(`${action}-${request.request_id}`, () =>
      api.respondToFriendRequest(token, request.request_id, action)
    );
  }

  function cancelRequest(request) {
    return performAction(`cancel-${request.request_id}`, () =>
      api.cancelFriendRequest(token, request.request_id)
    );
  }

  function removeFriend(friend) {
    Alert.alert('Remove friend', `Remove ${friend.name} from your friends?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => performAction(`remove-${friend.id}`, () =>
          api.removeFriend(token, friend.id)
        ),
      },
    ]);
  }

  function renderSection(title, count, rows, renderRow, emptyMessage) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title} <Text style={styles.count}>({count})</Text></Text>
        {rows.length ? rows.map(renderRow) : <Text style={styles.emptyText}>{emptyMessage}</Text>}
      </View>
    );
  }

  if (loading) {
    return <SafeAreaView style={styles.flex}><Loader style={styles.loader} /></SafeAreaView>;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.flex}>
        <View style={styles.errorState}>
          <Text style={styles.errorText}>{error}</Text>
          <Button label="Try again" onPress={loadRelationships} style={styles.retryButton} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>Find people, respond to requests, and keep up with your friends.</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search people by name"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
          returnKeyType="search"
          accessibilityLabel="Search people by name"
        />

        {search.trim().length >= 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>People</Text>
            {searching ? <Loader style={styles.searchLoader} /> : people.length ? (
              people.map((person) => {
                const chatButton = (
                  <Button
                    label="Chat"
                    variant="outline"
                    onPress={() => openChat(person)}
                    style={styles.actionButton}
                  />
                );
                const friendAction = person.friend_status === 'accepted' ? null : (
                  person.friend_status === 'request_sent' ? (
                    <Text style={styles.statusText}>Request sent</Text>
                  ) : person.friend_status === 'request_received' ? (
                    <Text style={styles.statusText}>Request received</Text>
                  ) : (
                    <Button
                      label={pendingAction === `add-${person.id}` ? 'Sending…' : 'Add'}
                      variant="outline"
                      onPress={() => sendRequest(person)}
                      disabled={Boolean(pendingAction)}
                      style={styles.actionButton}
                    />
                  )
                );
                return (
                  <PersonRow
                    key={person.id}
                    person={person}
                    actions={<>{chatButton}{friendAction}</>}
                  />
                );
              })
            ) : <Text style={styles.emptyText}>No people found. Private profiles are not listed.</Text>}
          </View>
        )}

        {conversations.length > 0 && renderSection(
          'Recent private messages',
          conversations.reduce((total, conversation) => total + (conversation.unread_count || 0), 0),
          conversations,
          (conversation) => {
            const otherUser = conversation.other_user || {};
            const lastMessage = conversation.last_message;
            const senderName = lastMessage
              ? String(lastMessage.sender_id) === String(user?.id)
                ? 'You'
                : otherUser.display_name || otherUser.name || 'Member'
              : 'No messages yet';
            const preview = lastMessage
              ? `${senderName}: ${lastMessage.content}`
              : 'Start a conversation';
            const subtitle = conversation.unread_count > 0
              ? `${conversation.unread_count} new · ${preview}`
              : preview;
            return (
              <PersonRow
                key={conversation.id}
                person={{
                  name: otherUser.display_name || otherUser.name || 'Member',
                  avatar_url: otherUser.is_anonymous ? null : otherUser.avatar_url,
                  is_anonymous: otherUser.is_anonymous,
                }}
                subtitle={subtitle}
                onPress={() => openConversation(conversation)}
                actions={
                  <Button
                    label="Open"
                    onPress={() => openConversation(conversation)}
                    style={styles.actionButton}
                  />
                }
              />
            );
          },
          'No private conversations yet.'
        )}

        {renderSection(
          'Friend requests',
          relationships.incomingRequests.length,
          relationships.incomingRequests,
          (request) => (
            <PersonRow
              key={request.request_id}
              person={request}
              actions={
                <>
                  <Button
                    label="Accept"
                    onPress={() => respond(request, 'accept')}
                    disabled={Boolean(pendingAction)}
                    style={styles.actionButton}
                  />
                  <Button
                    label="Reject"
                    variant="outline"
                    onPress={() => respond(request, 'reject')}
                    disabled={Boolean(pendingAction)}
                    style={styles.actionButton}
                  />
                </>
              }
            />
          ),
          'No incoming requests.'
        )}
        {renderSection(
          'Sent requests',
          relationships.outgoingRequests.length,
          relationships.outgoingRequests,
          (request) => (
            <PersonRow
              key={request.request_id}
              person={request}
              actions={
                <Button
                  label="Cancel"
                  variant="outline"
                  onPress={() => cancelRequest(request)}
                  disabled={Boolean(pendingAction)}
                  style={styles.actionButton}
                />
              }
            />
          ),
          'No pending sent requests.'
        )}
        {renderSection(
          'Friends',
          relationships.friends.length,
          relationships.friends,
          (friend) => (
            <PersonRow
              key={friend.id}
              person={friend}
              onPress={() => openChat(friend)}
              actions={
                <>
                  <Button label="Chat" onPress={() => openChat(friend)} style={styles.actionButton} />
                  <Button
                    label="Remove"
                    variant="outline"
                    onPress={() => removeFriend(friend)}
                    disabled={Boolean(pendingAction)}
                    style={styles.actionButton}
                  />
                </>
              }
            />
          ),
          'Your accepted friends will appear here.'
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  loader: { marginTop: 80 },
  intro: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
  searchInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    height: 52,
    marginBottom: spacing.md,
  },
  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '700', marginBottom: spacing.sm },
  count: { color: colors.textMuted, fontWeight: '500' },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 64,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  personDetails: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  personText: { flex: 1 },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  avatarFallback: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { color: '#FFFFFF', fontWeight: '700' },
  personName: { color: colors.text, fontSize: 14, fontWeight: '600', flexShrink: 1 },
  personSubtitle: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  rowActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionButton: { height: 40, minWidth: 66, paddingHorizontal: 10, borderRadius: 11 },
  statusText: { color: colors.textMuted, fontSize: 12, maxWidth: 82, textAlign: 'center' },
  emptyText: { color: colors.textMuted, fontSize: 14, paddingVertical: spacing.sm },
  searchLoader: { paddingVertical: spacing.sm },
  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  errorText: { color: colors.text, textAlign: 'center', marginBottom: spacing.md },
  retryButton: { width: 180 },
});
