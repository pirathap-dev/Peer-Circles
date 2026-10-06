import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../config';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

// Format timestamp
function formatTime(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - d) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return d.toLocaleDateString();
}

export default function NotificationsScreen() {
  const { token } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadNotifications = useCallback(async () => {
    try {
      setError('');
      const data = await api.getNotifications(token);
      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message || 'Could not load notifications.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return; // Already read
    
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    try {
      await api.markNotificationAsRead(token, id);
    } catch (err) {
      // Revert on error
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n))
      );
    }
  };

  const renderItem = ({ item }) => {
    const isUnread = !item.is_read;
    return (
      <TouchableOpacity
        style={[styles.card, isUnread ? styles.cardUnread : styles.cardRead]}
        onPress={() => handleMarkAsRead(item.id, item.is_read)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.title, isUnread && styles.titleUnread]}>
            {item.type === 'message' ? 'New Message' : item.type === 'comment' ? 'New Comment' : 'Notification'}
          </Text>
          <Text style={styles.timestamp}>{formatTime(item.created_at)}</Text>
        </View>
        <Text style={[styles.message, isUnread && styles.messageUnread]} numberOfLines={3}>
          {item.message}
        </Text>
        {isUnread && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerFlex}>
        <Loader size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerFlex}>
        <Text style={styles.errorText}>{error}</Text>
        <Button label="Try again" onPress={() => { setLoading(true); loadNotifications(); }} style={styles.retryBtn} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          message="You're all caught up! When you have new updates, they will appear here."
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerFlex: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  list: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    position: 'relative',
  },
  cardUnread: {
    borderColor: colors.primarySoft,
    backgroundColor: colors.surface,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardRead: {
    borderColor: colors.border,
    backgroundColor: '#FAFCFB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
    paddingRight: spacing.sm, // Make room for unread dot
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
    fontFamily: 'System',
    flex: 1,
  },
  titleUnread: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'System',
    marginLeft: spacing.sm,
  },
  message: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    fontFamily: 'System',
  },
  messageUnread: {
    color: colors.text,
  },
  unreadDot: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    marginBottom: spacing.lg,
    textAlign: 'center',
    fontFamily: 'System',
  },
  retryBtn: {
    minWidth: 160,
  },
});
