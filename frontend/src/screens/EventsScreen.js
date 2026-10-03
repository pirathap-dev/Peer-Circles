import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return 'Date and time unavailable';
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export default function EventsScreen() {
  const { token } = useAuth();
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadEvents = useCallback(async () => {
    try {
      setError('');
      const data = await api.getEvents(token);
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message || 'Could not load events.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  function onRefresh() {
    setRefreshing(true);
    loadEvents();
  }

  function handleEventPress(event) {
    navigation.navigate('EventDetails', { eventId: event.id, eventData: event });
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => handleEventPress(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        {item.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>📅 {formatDate(item.date)}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>📍 {item.location || 'Online'}</Text>
      </View>
      
      {item.description ? (
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.container}>
        {loading ? (
          <Loader style={styles.loader} />
        ) : error ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error}</Text>
            <Button label="Try again" onPress={loadEvents} style={styles.retry} />
          </View>
        ) : events.length === 0 ? (
          <EmptyState
            title="No events found"
            message="Check back later for upcoming community events."
          />
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
            }
            renderItem={renderItem}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.lg },
  list: { paddingBottom: spacing.lg },
  loader: { marginTop: spacing.xl },
  centerContent: { alignItems: 'center', marginTop: spacing.xl, flex: 1, justifyContent: 'center' },
  errorText: {
    color: colors.error,
    fontSize: 15,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontFamily: 'System',
  },
  retry: { width: 200 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'System',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'System',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: 'System',
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontFamily: 'System',
    marginTop: spacing.sm,
  },
});
