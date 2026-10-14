import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import AnonymousToggle from '../components/AnonymousToggle';

export default function CreateDiscussionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = useAuth();
  const { communityId, communityName } = route.params;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.createDiscussion(token, communityId, {
        title,
        content,
        is_anonymous: isAnonymous,
      });
      Alert.alert(
        'Success',
        isAnonymous
          ? 'Discussion posted anonymously!'
          : 'Discussion created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create discussion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.header}>Create New Discussion</Text>
            <Text style={styles.subheader}>
              Starting a discussion in {communityName || 'this community'}
            </Text>

            {/* Anonymous banner — shown at top when ON so user sees it clearly */}
            {isAnonymous && (
              <View style={styles.anonTopBanner}>
                <Text style={styles.anonTopBannerIcon}>🎭</Text>
                <Text style={styles.anonTopBannerText}>
                  You are posting this discussion anonymously. Your real name will not be shown.
                </Text>
              </View>
            )}

            <View style={styles.form}>
              {/* Anonymous toggle */}
              <AnonymousToggle
                value={isAnonymous}
                onChange={setIsAnonymous}
              />

              <Input
                label="Title"
                value={title}
                onChangeText={setTitle}
                placeholder="Enter a descriptive title"
                error={errors.title}
                autoCapitalize="words"
              />

              <View style={styles.contentWrapper}>
                <Text style={styles.label}>Content</Text>
                <TextInput
                  style={[styles.contentInput, errors.content && styles.inputError]}
                  value={content}
                  onChangeText={setContent}
                  placeholder="Share your thoughts, experiences, or questions..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                />
                {errors.content && (
                  <Text style={styles.errorText}>{errors.content}</Text>
                )}
              </View>

              <View style={styles.charCount}>
                <Text style={styles.charCountText}>
                  {content.length} characters (minimum 10)
                </Text>
              </View>

              <View style={styles.guidelines}>
                <Text style={styles.guidelinesTitle}>Community Guidelines:</Text>
                <Text style={styles.guidelineItem}>• Be respectful and supportive</Text>
                <Text style={styles.guidelineItem}>• Share your experiences honestly</Text>
                <Text style={styles.guidelineItem}>• Maintain confidentiality</Text>
                <Text style={styles.guidelineItem}>
                  • Avoid giving professional medical advice
                </Text>
              </View>

              <Button
                label={isAnonymous ? '🎭  Post Anonymously' : 'Post Discussion'}
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                style={styles.submitButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  container: { flex: 1 },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
    fontFamily: 'System',
  },
  subheader: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    fontFamily: 'System',
  },
  // Anonymous top banner
  anonTopBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    gap: 8,
  },
  anonTopBannerIcon: {
    fontSize: 20,
  },
  anonTopBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: 'System',
    lineHeight: 18,
    fontWeight: '500',
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
  },
  contentWrapper: { marginBottom: spacing.md },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
    fontFamily: 'System',
  },
  contentInput: {
    height: 160,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
    fontFamily: 'System',
    textAlignVertical: 'top',
  },
  inputError: { borderColor: colors.error },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginTop: 6,
    fontFamily: 'System',
  },
  charCount: { alignItems: 'flex-end', marginBottom: spacing.md },
  charCountText: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'System',
  },
  guidelines: {
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: spacing.sm,
    fontFamily: 'System',
  },
  guidelineItem: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    fontFamily: 'System',
  },
  submitButton: { marginTop: spacing.sm },
});