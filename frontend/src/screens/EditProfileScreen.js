import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

// Guess a MIME type from the picked file so Cloudinary stores the right format.
function guessMime(asset) {
  if (asset.mimeType) return asset.mimeType;
  const ext = (asset.fileName || asset.uri || '').split('.').pop()?.toLowerCase();
  const map = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', heic: 'image/heic', heif: 'image/heif' };
  return map[ext] || 'image/jpeg';
}

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, token, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);
  const [pendingAvatar, setPendingAvatar] = useState(null); // { dataUri }
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [picking, setPicking] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate() {
    const next = {};
    if (!name.trim()) next.name = 'Full name is required.';
    if (!email) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handlePickImage() {
    setPicking(true);
    setServerError('');
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission needed', 'Allow photo access to choose a profile picture.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
        base64: true,
      });
      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      if (!asset.base64) {
        Alert.alert('Could not read image', 'Please choose a different image.');
        return;
      }
      const dataUri = `data:${guessMime(asset)};base64,${asset.base64}`;
      setPendingAvatar(dataUri);
      setAvatarPreview(asset.uri);
    } catch (err) {
      setServerError(err.message || 'Could not pick an image.');
    } finally {
      setPicking(false);
    }
  }

  function handleRemoveAvatar() {
    setPendingAvatar(null);
    setAvatarPreview(null);
  }

  async function handleSubmit() {
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      let avatarUrl = avatarPreview;

      // Only upload to Cloudinary if the user picked a brand-new image.
      if (pendingAvatar) {
        const uploadData = await api.uploadAsset(token, pendingAvatar);
        avatarUrl = uploadData.url || uploadData.asset?.secure_url || null;
      }

      const data = await api.updateProfile(token, {
        name: name.trim(),
        email: email.trim(),
        avatar_url: avatarUrl,
      });
      if (updateUser) updateUser(data.user);
      navigation.goBack();
    } catch (err) {
      setServerError(err.message || 'Could not update profile.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Edit profile</Text>
            <Text style={styles.subtitle}>Update your name, email, and profile picture.</Text>
          </View>

          {serverError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{serverError}</Text>
            </View>
          ) : null}

          <View style={styles.avatarSection}>
            {avatarPreview ? (
              <Image source={{ uri: avatarPreview }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarText}>{getInitials(name || user?.name)}</Text>
              </View>
            )}

            <View style={styles.avatarActions}>
              <Button
                label={avatarPreview ? 'Change photo' : 'Choose photo'}
                variant="outline"
                onPress={handlePickImage}
                disabled={submitting || picking}
                loading={picking}
                style={styles.avatarButton}
              />
              {avatarPreview ? (
                <TouchableOpacity onPress={handleRemoveAvatar} disabled={submitting}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Alex Perera"
            error={errors.name}
            autoCapitalize="words"
          />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            error={errors.email}
            keyboardType="email-address"
          />

          <Button label="Save changes" onPress={handleSubmit} loading={submitting} />

          <Button
            label="Cancel"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.cancelBtn}
          />

          {pendingAvatar ? (
            <View style={styles.uploadHint}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.uploadHintText}>New picture will upload when you save.</Text>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  header: { marginTop: spacing.md, marginBottom: spacing.xl },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 8,
    lineHeight: 22,
    fontFamily: 'System',
  },
  errorBox: {
    backgroundColor: '#FCEAEA',
    borderRadius: 12,
    padding: 14,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontFamily: 'System',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  avatarFallback: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 38,
    fontWeight: '700',
    color: colors.surface,
    fontFamily: 'System',
  },
  avatarActions: {
    alignItems: 'center',
  },
  avatarButton: {
    width: 160,
  },
  removeText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
    marginTop: spacing.sm,
    fontFamily: 'System',
  },
  cancelBtn: { marginTop: spacing.sm },
  uploadHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: 8,
  },
  uploadHintText: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: 'System',
  },
});