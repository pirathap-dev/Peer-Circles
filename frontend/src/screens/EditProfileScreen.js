import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, token, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate() {
    const next = {};
    if (!name.trim()) next.name = 'Full name is required.';
    if (!email) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const data = await api.updateProfile(token, {
        name: name.trim(),
        email: email.trim(),
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
            <Text style={styles.subtitle}>Update your name and email.</Text>
          </View>

          {serverError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{serverError}</Text>
            </View>
          ) : null}

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
  cancelBtn: { marginTop: spacing.sm },
});