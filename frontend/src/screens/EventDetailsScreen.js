import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Button from '../components/Button';

function formatDate(dateString) {
  if (!dateString) return 'Date and time unavailable';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return 'Date and time unavailable';
  return d.toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export default function EventDetailsScreen() {
  const route = useRoute();
  const { token } = useAuth();
  
  // We can start with eventData from route params to show immediately
  const { eventId, eventData } = route.params || {};
  
  const [event, setEvent] = useState(eventData || null);
  const [loading, setLoading] = useState(!eventData);
  const [error, setError] = useState('');

  const loadEvent = useCallback(async () => {
    if (!eventId) {
      if (!eventData) setError('Event not found.');
      setLoading(false);
      return;
    }

    try {
      setError('');
      if (!eventData) setLoading(true);
      const data = await api.getEventDetails(token, eventId);
      if (!data?.event) throw new Error('Event not found.');
      setEvent(data.event);
    } catch (err) {
      setError(err.message || 'Could not load event details.');
    } finally {
      setLoading(false);
    }
  }, [eventId, token, eventData]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  if (loading) {
    return (
      <SafeAreaView style={styles.flex}>
        <Loader style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView style={styles.flex}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error || 'Event not found'}</Text>
          <Button label="Try again" onPress={loadEvent} style={styles.retry} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{event.title}</Text>
          {event.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          )}
        </View>

        {error ? (
          <View style={styles.fetchWarning}>
            <Text style={styles.errorText}>{error}</Text>
            <Button label="Retry details" onPress={loadEvent} style={styles.retry} />
          </View>
        ) : null}

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Date & Time</Text>
              <Text style={styles.infoValue}>{formatDate(event.date)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{event.location || 'Online'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  loader: { flex: 1, justifyContent: 'center' },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'System',
  },
  retry: { width: 200, marginTop: spacing.md },
  fetchWarning: {
    alignItems: 'center',
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'System',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'System',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'System',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    fontFamily: 'System',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'System',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    fontFamily: 'System',
  },
});
