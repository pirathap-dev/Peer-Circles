import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DiscussionCard from '../components/DiscussionCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

export default function DiscussionListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = useAuth();
  const { communityId, communityName } = route.params;

  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDiscussions = useCallback(async () => {
    try {
      setError('');
      const data = await api.listDiscussions(token, communityId);
      setDiscussions(data.discussions || []);
    } catch (err) {
      setError(err.message || 'Could not load discussions.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, communityId]);

  useEffect(() => {
    loadDiscussions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    navigation.setOptions({ 
      title: communityName ? `${communityName} - Discussions` : 'Discussions',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateDiscussion', { communityId, communityName })}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>+ New</Text>
        </TouchableOpacity>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, communityName, communityId]);

  function onRefresh() {
    setRefreshing(true);
    loadDiscussions();
  }

  function openDiscussion(discussion) {
    navigation.navigate('DiscussionDetail', { 
      discussionId: discussion.id, 
      communityId,
      communityName 
    });
  }

  if (loading) {
    return <SafeAreaView style={styles.flex}><Loader style={styles.loader} /></SafeAreaView>;
  }

  if (error && discussions.length === 0) {
    return (
      <SafeAreaView style={styles.flex}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Button label="Try again" onPress={loadDiscussions} style={styles.retry} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
      {discussions.length === 0 && !error ? (
        <EmptyState
          icon="💬"
          title="No discussions yet"
          subtitle="Be the first to start a conversation in this community."
          actionLabel="Create discussion"
          onAction={() => navigation.navigate('CreateDiscussion', { communityId, communityName })}
        />
      ) : (
        <FlatList
          data={discussions}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          renderItem={({ item }) => (
            <DiscussionCard
              discussion={item}
              onPress={() => openDiscussion(item)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  loader: { marginTop: 80 },
  center: { alignItems: 'center', marginTop: 80, padding: spacing.lg },
  errorText: {
    color: colors.error,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontFamily: 'System',
  },
  retry: { width: 200 },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  createButton: {
    marginRight: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
});