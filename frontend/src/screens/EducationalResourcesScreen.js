import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Linking, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

export default function EducationalResourcesScreen() {
  const { token } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadResources = useCallback(async () => {
    try {
      setError('');
      const data = await api.getResources(token);
      setResources(data.resources || []);
    } catch (err) {
      setError(err.message || 'Could not load resources.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadResources();
    }, [loadResources])
  );

  function onRefresh() {
    setRefreshing(true);
    loadResources();
  }

  async function handleOpenUrl(url) {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot open URL', `Don't know how to open this URL: ${url}`);
      }
    } catch (err) {
      Alert.alert('Error', 'An error occurred while trying to open the link.');
    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => item.url ? handleOpenUrl(item.url) : null}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        {item.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        )}
      </View>
      {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
      
      {item.url ? (
        <Text style={styles.linkText}>Read more →</Text>
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
            <Button label="Try again" onPress={loadResources} style={styles.retry} />
          </View>
        ) : resources.length === 0 ? (
          <EmptyState
            title="No resources found"
            message="Check back later for new educational materials."
          />
        ) : (
          <FlatList
            data={resources}
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
    padding: spacing.md,
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
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
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
  description: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    fontFamily: 'System',
    marginBottom: 12,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'System',
  },
});
