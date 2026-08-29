import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Loader from '../components/Loader';
import CommentCard from '../components/CommentCard';

export default function DiscussionDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { token, user } = useAuth();
  const { discussionId, communityId, communityName } = route.params;

  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');

  const load = useCallback(
    async (isRefresh = false) => {
      try {
        setError('');
        const data = await api.getDiscussion(token, discussionId);
        setDiscussion(data.discussion);
        setComments(data.comments || []);
      } catch (err) {
        setError(err.message || 'Could not load discussion.');
      } finally {
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    },
    [token, discussionId]
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    navigation.setOptions({ title: communityName || 'Discussion' });
  }, [navigation, communityName]);

  function onRefresh() {
    setRefreshing(true);
    load(true);
  }

  async function handlePostComment() {
    setCommentError('');
    if (!commentText.trim()) {
      setCommentError('Write something before posting.');
      return;
    }
    setSubmitting(true);
    try {
      const data = await api.addComment(token, discussionId, commentText.trim());
      setComments((prev) => [...prev, data.comment]);
      setCommentText('');
    } catch (err) {
      setCommentError(err.message || 'Could not post comment.');
    } finally {
      setSubmitting(false);
    }
  }

  function confirmDeleteComment(comment) {
    Alert.alert('Delete comment', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => handleDeleteComment(comment),
      },
    ]);
  }

  async function handleDeleteComment(comment) {
    try {
      await api.deleteComment(token, discussionId, comment.id);
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
    } catch (err) {
      Alert.alert('Could not delete', err.message || 'Please try again.');
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.flex}>
        <Loader style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (error && !discussion) {
    return (
      <SafeAreaView style={styles.flex}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Button label="Try again" onPress={() => load()} style={styles.retry} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        >
          <View style={styles.postCard}>
            <Text style={styles.author}>{discussion?.author_name || 'Anonymous'}</Text>
            <Text style={styles.title}>{discussion?.title}</Text>
            <Text style={styles.body}>{discussion?.body}</Text>
          </View>

          <Text style={styles.sectionTitle}>
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </Text>

          {comments.length === 0 ? (
            <Text style={styles.emptyText}>Be the first to reply.</Text>
          ) : (
            comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                canDelete={comment.user_id === user?.id}
                onDelete={() => confirmDeleteComment(comment)}
              />
            ))
          )}

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              This platform provides peer support and community connection. It is not a substitute for
              professional mental-health care.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.composer}>
          {commentError ? <Text style={styles.commentErrorText}>{commentError}</Text> : null}
          <View style={styles.composerRow}>
            <TextInput
              style={styles.composerInput}
              placeholder="Write a reply..."
              placeholderTextColor={colors.textMuted}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <Button
              label="Post"
              onPress={handlePostComment}
              loading={submitting}
              style={styles.postBtn}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 24 },
  loader: { marginTop: 80 },
  center: { alignItems: 'center', marginTop: 80, paddingHorizontal: spacing.lg },
  retry: { width: 200, marginTop: spacing.md },
  errorText: {
    color: colors.error,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontFamily: 'System',
  },
  postCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  author: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: 6,
    fontFamily: 'System',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'System',
  },
  body: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 23,
    fontFamily: 'System',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    fontFamily: 'System',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: 'System',
    marginBottom: spacing.lg,
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
  composer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  commentErrorText: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 6,
    fontFamily: 'System',
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  composerInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    fontFamily: 'System',
    marginRight: 10,
  },
  postBtn: { width: 80 },
});