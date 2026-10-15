import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, RefreshControl, SafeAreaView, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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

// First + last initials for the avatar fallback circle.
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function HomeScreen() {
  const { user, token } = useAuth();
  const navigation = useNavigation();

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [pendingId, setPendingId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const debounceRef = useRef(null);
  const filtersRef = useRef({ search, location });
  filtersRef.current = { search, location };

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

  useFocusEffect(
    useCallback(() => {
      loadCommunities(filtersRef.current.search, filtersRef.current.location);

      const fetchUnread = async () => {
        try {
          const data = await api.getNotifications(token);
          if (data.notifications) {
            const count = data.notifications.filter((n) => !n.is_read).length;
            setUnreadCount(count);
          }
        } catch (err) {
          console.log('Fetch notifications err', err);
        }
      };
      fetchUnread();
    }, [loadCommunities, token])
  );

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

  function handleLeave(community) {
    Alert.alert(
      'Leave Group',
      `Are you sure you want to leave ${community.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            setPendingId(community.id);
            try {
              const data = await api.leaveGroup(token, community.id);
              setCommunities((prev) =>
                prev.map((c) =>
                  c.id === community.id
                    ? {
                        ...c,
                        ...(data?.group || {}),
                        is_member: false,
                        member_count:
                          data?.group?.member_count !== undefined
                            ? data.group.member_count
                            : Math.max(0, (c.member_count || 1) - 1),
                      }
                    : c
                )
              );
            } catch (err) {
              Alert.alert('Could not leave', err.message || 'Please try again.');
            } finally {
              setPendingId(null);
            }
          },
        },
      ]
    );
  }

  function openDetails(community) {
    navigation.navigate('CommunityDetails', { id: community.id });
  }

  const shortcuts = [
    { label: 'Messages', icon: '💬', screen: 'MessagesInbox' },
    { label: 'Friends', icon: '👥', screen: 'Friends' },
    { label: 'Events', icon: '📅', screen: 'Events' },
    { label: 'Resources', icon: '📚', screen: 'EducationalResources' },
    { label: 'Alerts', icon: '🔔', screen: 'Notifications' },
  ];

  return (
    <SafeAreaView style={styles.flex}>
      <FlatList
        data={loading || error ? [] : communities}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        ListHeaderComponent={
          <View style={styles.content}>
            <View style={styles.topBar}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={styles.topBarLeft}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel="Open your profile"
              >
                {user?.avatar_url ? (
                  <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarFallback]}>
                    <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
                  </View>
                )}
                <View style={styles.topBarText}>
                  <Text style={styles.welcome}>Hi, {user?.name?.split(' ')[0] || 'there'}</Text>
                  <Text style={styles.subhead}>Good to see you</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}
                style={styles.notificationButton}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
              >
                <Text style={styles.notificationIcon}>🔔</Text>
                {unreadCount > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.hero}>
              <Text style={styles.heroEyebrow}>PEER CIRCLES</Text>
              <Text style={styles.heroTitle}>Find support that feels right.</Text>
              <Text style={styles.heroDescription}>
                Connect with people who understand and take things one step at a time.
              </Text>
            </View>

            <View style={styles.shortcutSection}>
              <Text style={styles.shortcutHeading}>Your space</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.shortcutList}
              >
                {shortcuts.map((shortcut) => (
                  <TouchableOpacity
                    key={shortcut.screen}
                    style={styles.shortcut}
                    onPress={() => navigation.navigate(shortcut.screen)}
                    activeOpacity={0.75}
                    accessibilityRole="button"
                    accessibilityLabel={`Open ${shortcut.label}`}
                  >
                    <Text style={styles.shortcutIcon}>{shortcut.icon}</Text>
                    <Text style={styles.shortcutLabel}>{shortcut.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search support groups"
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={onSearchChange}
                returnKeyType="search"
                accessibilityLabel="Search support groups"
              />
            </View>

            <View style={styles.filterRow}>
              {LOCATION_FILTERS.map((filter) => {
                const active = location === filter.value;
                return (
                  <TouchableOpacity
                    key={filter.value}
                    onPress={() => onLocationChange(filter.value)}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    activeOpacity={0.75}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                  >
                    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.sectionHeading}>
              <View>
                <Text style={styles.sectionTitle}>Support communities</Text>
                <Text style={styles.sectionSubtitle}>Find a group to connect with</Text>
              </View>
              {!loading && !error && (
                <Text style={styles.communityCount}>{communities.length}</Text>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <Loader style={styles.loader} />
          ) : error ? (
            <View style={styles.centerContent}>
              <Text style={styles.errorText}>{error}</Text>
              <Button
                label="Try again"
                onPress={() => loadCommunities(search, location)}
                style={styles.retry}
              />
            </View>
          ) : (
            <EmptyState
              title="No support groups found"
              message="Try a different search or location filter."
            />
          )
        }
        renderItem={({ item }) => (
          <View style={styles.communityItem}>
            <CommunityCard
              community={item}
              onPress={() => openDetails(item)}
              onJoin={() => handleJoin(item)}
              onLeave={() => handleLeave(item)}
              joinLoading={pendingId === item.id}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  listContent: { paddingBottom: spacing.lg, flexGrow: 1 },
  communityItem: { paddingHorizontal: spacing.lg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  topBarText: {
    flex: 1,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  notificationIcon: {
    fontSize: 20,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'System',
  },
  welcome: {
    fontSize: 21,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'System',
  },
  subhead: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 3,
    fontFamily: 'System',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
  },
  avatarFallback: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.surface,
    fontFamily: 'System',
  },
  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  heroEyebrow: {
    color: '#BFE3D9',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
    fontFamily: 'System',
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '700',
    maxWidth: 280,
    fontFamily: 'System',
  },
  heroDescription: {
    color: '#E0F0EB',
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
    maxWidth: 310,
    fontFamily: 'System',
  },
  shortcutSection: {
    marginBottom: spacing.lg,
  },
  shortcutHeading: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: spacing.sm,
    fontFamily: 'System',
  },
  shortcutList: {
    gap: spacing.sm,
    paddingVertical: 2,
    paddingRight: spacing.lg,
  },
  shortcut: {
    width: 88,
    minHeight: 78,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shortcutIcon: {
    fontSize: 21,
    marginBottom: 5,
  },
  shortcutLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'System',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchIcon: {
    color: colors.primary,
    fontSize: 25,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 52,
    fontSize: 15,
    color: colors.text,
    fontFamily: 'System',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    fontFamily: 'System',
  },
  filterChipTextActive: {
    color: colors.surface,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'System',
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 3,
    fontFamily: 'System',
  },
  communityCount: {
    minWidth: 32,
    height: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
    borderRadius: 16,
    color: colors.primaryDark,
    backgroundColor: colors.primarySoft,
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 7,
    paddingTop: 7,
    fontFamily: 'System',
  },
  loader: { marginTop: spacing.xl },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  errorText: {
    color: colors.error,
    fontSize: 15,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontFamily: 'System',
  },
  retry: { width: 200 },
});