import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Loader from '../components/Loader';
// join support
export default function CommunityDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = useAuth();
  const { id } = route.params;

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  // Load community details from the API
  const load = useCallback(async () => {
    try {
      setError('');
      const data = await api.getCommunity(token, id);
      setCommunity(data.community);
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

  // Function to handle joining or leaving the community
  async function toggleMembership() {
    if (!community) return;
    setPending(true);
    try {
      const apiCall = community.is_member ? api.leaveCommunity : api.joinCommunity;
      const data = await apiCall(token, id);
      setCommunity({ ...data.community, is_member: !community.is_member });
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setPending(false);
    }
  }

  if (loading) return <SafeAreaView style={styles.flex}><Loader style={styles.loader} /></SafeAreaView>;

  // Show error message if there was an error and no community data is available
  if (error && !community) {
    return (
      // Render an error message with a retry button
      <SafeAreaView style={styles.flex}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Button label="Try again" onPress={load} style={styles.retry} />
        </View>
      </SafeAreaView>
    );
  }

  // Render the community details
  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>{community.location}</Text>
          </View>
          <Text style={styles.name}>{community.name}</Text>
          <Text style={styles.members}>{community.member_count} members</Text>

          <Button
            label={community.is_member ? 'Leave community' : 'Join community'}
            variant={community.is_member ? 'outline' : 'primary'}
            onPress={toggleMembership}
            loading={pending}
            style={styles.action}
          />
        </View>

        <Text style={styles.sectionTitle}>About this community</Text>
        <Text style={styles.description}>{community.description}</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This platform provides peer support and community connection. It is not a substitute for
            professional mental-health care.
          </Text>
        </View>
      </ScrollView>
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
  action: { marginTop: spacing.sm },
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
  disclaimerText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'System',
  },
});