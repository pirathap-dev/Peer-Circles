import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, RefreshControl, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommunityCard from '../components/CommunityCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';


//implement search
const LOCATION_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Online', value: 'online' },
  { label: 'In-person', value: 'in_person' },
];

// Debounce time for search input
const SEARCH_DEBOUNCE_MS = 400;

export default function HomeScreen() {
  const { user, token, logout } = useAuth();
  const navigation = useNavigation();

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [pendingId, setPendingId] = useState(null);

  const debounceRef = useRef(null);

  const loadCommunities = useCallback(
    async (term = '', loc = '') => {
      try {
        setError('');
        const data = await api.listCommunities(token, { search: term, location: loc || undefined });
        setCommunities(data.communities || []);
      } catch (err) {
        setError(err.message || 'Could not load communities.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    loadCommunities(search, location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function onRefresh() {
    setRefreshing(true);
    loadCommunities(search, location);
  }

  // Debounced search input handler
  function onSearchChange(text) {
    setSearch(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadCommunities(text, location);
    }, SEARCH_DEBOUNCE_MS);
  }

  function onLocationChange(value) {
    setLocation(value);
    setLoading(true);
    loadCommunities(search, value);
  }

  // Handle joining a community
  async function handleJoin(community) {
    setPendingId(community.id);
    try {
      const data = await api.joinCommunity(token, community.id);
      setCommunities((prev) =>
        prev.map((c) => (c.id === community.id ? { ...data.community, is_member: true } : c))
      );
    } catch (err) {
      Alert.alert('Could not join', err.message || 'Please try again.');
    } finally {
      setPendingId(null);
    }
  }

  async function handleLeave(community) {
    setPendingId(community.id);
    try {
      const data = await api.leaveCommunity(token, community.id);
      setCommunities((prev) =>
        prev.map((c) => (c.id === community.id ? { ...data.community, is_member: false } : c))
      );
    } catch (err) {
      Alert.alert('Could not leave', err.message || 'Please try again.');
    } finally {
      setPendingId(null);
    }
  }

  function openDetails(community) {
    navigation.navigate('CommunityDetails', { id: community.id });
  }

  function handleLogout() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.7}>
            <Text style={styles.welcome}>Welcome, {user?.name?.split(' ')[0] || 'friend'}</Text>
            <Text style={styles.subhead}>Find your support group</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sign out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search support groups..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={onSearchChange}
            returnKeyType="search"
          />
        </View>

        <View style={styles.filterRow}>
          {LOCATION_FILTERS.map((f) => {
            const active = location === f.value;
            return (
              <TouchableOpacity
                key={f.value}
                onPress={() => onLocationChange(f.value)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Support Communities</Text>

        {loading ? (
          <Loader style={styles.loader} />
        ) : error ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error}</Text>
            <Button label="Try again" onPress={() => loadCommunities(search, location)} style={styles.retry} />
          </View>
        ) : communities.length === 0 ? (
          <EmptyState
            title="No support groups found"
            message="Try a different search or filter."
          />
        ) : (
          <FlatList
            data={communities}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
            }
            renderItem={({ item }) => (
              <CommunityCard
                community={item}
                onPress={() => openDetails(item)}
                onJoin={() => handleJoin(item)}
                onLeave={() => handleLeave(item)}
                joinLoading={pendingId === item.id}
              />
            )}
          />
        )}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This platform provides peer support and community connection. It is not a substitute for
            professional mental-health care.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.lg },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'System',
  },
  subhead: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: 'System',
  },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
  },
  logoutText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: colors.text,
    fontFamily: 'System',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    fontFamily: 'System',
  },
  filterChipTextActive: {
    color: colors.surface,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    fontFamily: 'System',
  },
  list: { paddingBottom: spacing.lg },
  loader: { marginTop: spacing.xl },
  centerContent: { alignItems: 'center', marginTop: spacing.xl },
  errorText: {
    color: colors.error,
    fontSize: 15,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontFamily: 'System',
  },
  retry: { width: 200 },
  disclaimer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'System',
  },
});