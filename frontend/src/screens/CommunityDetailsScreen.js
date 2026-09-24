import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Loader from '../components/Loader';
import AnonymousToggle from '../components/AnonymousToggle';

export default function CommunityDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = useAuth();
  const { id } = route.params;

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  // Anonymous join modal state
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [joinAnonymous, setJoinAnonymous] = useState(false);

  // Per-membership anonymous toggle (after already joined)
  const [updatingAnon, setUpdatingAnon] = useState(false);
  const [membershipAnon, setMembershipAnon] = useState(false);

  // Load community details from the API
  const load = useCallback(async () => {
    try {
      setError('');
      const data = await api.getCommunity(token, id);
      setCommunity(data.community);
      // Initialise the membership anon preference from the API response
      setMembershipAnon(!!data.community.member_anonymous);
    } catch (err) {
      setError(err.message || 'Could not load community.');
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  React.useEffect(() => {
    load();
  }, [load]);

  // Update the navigation title when the community data is loaded
  React.useEffect(() => {
    navigation.setOptions({ title: community?.name || 'Community' });
  }, [navigation, community?.name]);

  // Show the join modal (to let the user choose anonymity before joining)
  function handleJoinPress() {
    setJoinAnonymous(false);
    setJoinModalVisible(true);
  }

  // Confirm join from modal
  async function confirmJoin() {
    setJoinModalVisible(false);
    setPending(true);
    try {
      const data = await api.joinCommunity(token, id, { anonymous: joinAnonymous });
      setCommunity({ ...data.community, is_member: true });
      setMembershipAnon(joinAnonymous);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setPending(false);
    }
  }

  // Leave community
  async function handleLeave() {
    Alert.alert(
      'Leave Community',
      'Are you sure you want to leave this community?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            setPending(true);
            try {
              await api.leaveCommunity(token, id);
              setCommunity({ ...community, is_member: false });
            } catch (err) {
              setError(err.message || 'Something went wrong.');
            } finally {
              setPending(false);
            }
          },
        },
      ]
    );
  }

  // Toggle anonymous membership preference for an existing member
  async function handleMembershipAnonChange(newVal) {
    setMembershipAnon(newVal);
    setUpdatingAnon(true);
    try {
      await api.setMembershipAnonymous(token, id, newVal);
    } catch (err) {
      // Revert on failure
      setMembershipAnon(!newVal);
      Alert.alert('Error', err.message || 'Could not update preference.');
    } finally {
      setUpdatingAnon(false);
    }
  }

  function handleViewDiscussions() {
    if (!community) return;
    if (!community.is_member) {
      Alert.alert(
        'Join Required',
        'You must join this community to view and participate in discussions.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Join Community', onPress: handleJoinPress },
        ]
      );
      return;
    }
    navigation.navigate('DiscussionList', {
      communityId: community.id,
      communityName: community.name,
    });
  }

  if (loading) return <SafeAreaView style={styles.flex}><Loader style={styles.loader} /></SafeAreaView>;

  // Show error message if there was an error and no community data is available
  if (error && !community) {
    return (
      <SafeAreaView style={styles.flex}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Button label="Try again" onPress={load} style={styles.retry} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <View style={styles.headerCard}>
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>{community.location}</Text>
          </View>
          <Text style={styles.name}>{community.name}</Text>
          <Text style={styles.members}>{community.member_count} members</Text>

          {/* Member status badge */}
          {community.is_member && (
            <View style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>
                {membershipAnon ? '🎭 Participating Anonymously' : '✓ Member'}
              </Text>
            </View>
          )}

          {/* Join / Leave button */}
          {community.is_member ? (
            <Button
              label="Leave community"
              variant="outline"
              onPress={handleLeave}
              loading={pending}
              style={styles.action}
            />
          ) : (
            <Button
              label="Join community"
              variant="primary"
              onPress={handleJoinPress}
              loading={pending}
              style={styles.action}
            />
          )}
        </View>

        <Text style={styles.sectionTitle}>About this community</Text>
        <Text style={styles.description}>{community.description}</Text>

        {/* Anonymity preference — only shown to members */}
        {community.is_member && (
          <View style={styles.anonSection}>
            <Text style={styles.sectionTitle}>Privacy Settings</Text>
            <AnonymousToggle
              value={membershipAnon}
              onChange={handleMembershipAnonChange}
            />
            {updatingAnon && (
              <Text style={styles.updatingText}>Saving preference…</Text>
            )}
          </View>
        )}

        {community.is_member && (
          <View style={styles.discussionSection}>
            <Text style={styles.sectionTitle}>Participate</Text>
            <Button
              label="View Discussions"
              onPress={handleViewDiscussions}
              variant="primary"
              style={styles.discussionButton}
            />
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.disclaimer} />
      </ScrollView>

      {/* ── Join modal ─────────────────────────────────────────────────────── */}
      <Modal
        visible={joinModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Join {community?.name}</Text>
            <Text style={styles.modalSubtitle}>
              Choose how you'd like to participate in this community.
            </Text>

            <AnonymousToggle
              value={joinAnonymous}
              onChange={setJoinAnonymous}
            />

            <Text style={styles.modalNote}>
              You can change this preference any time from the community page.
            </Text>

            <View style={styles.modalButtons}>
              <Button
                label="Cancel"
                variant="outline"
                onPress={() => setJoinModalVisible(false)}
                style={styles.modalBtnCancel}
              />
              <Button
                label={joinAnonymous ? 'Join Anonymously' : 'Join Community'}
                variant="primary"
                onPress={confirmJoin}
                style={styles.modalBtnConfirm}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Styles for the CommunityDetailsScreen component
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  headerCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  locationRow: { marginBottom: 8 },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    overflow: 'hidden',
    fontFamily: 'System',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'System',
  },
  members: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.md,
    fontFamily: 'System',
  },
  memberBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacing.sm,
  },
  memberBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  action: { marginTop: spacing.sm },
  anonSection: {
    marginBottom: spacing.lg,
  },
  updatingText: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'System',
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  discussionSection: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  discussionButton: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    fontFamily: 'System',
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.lg,
    fontFamily: 'System',
  },
  loader: { marginTop: 80 },
  center: { alignItems: 'center', marginTop: 80 },
  retry: { width: 200, marginTop: spacing.md },
  errorText: {
    color: colors.error,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontFamily: 'System',
  },
  disclaimer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.lg,
  },

  // ── Join modal ───────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 36 : spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    fontFamily: 'System',
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    lineHeight: 20,
    fontFamily: 'System',
  },
  modalNote: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    lineHeight: 18,
    fontFamily: 'System',
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalBtnCancel: {
    flex: 1,
  },
  modalBtnConfirm: {
    flex: 2,
  },
});