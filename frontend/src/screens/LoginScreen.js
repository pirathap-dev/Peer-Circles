import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../config';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate() {
    const next = {};
    if (!email) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email.';
    if (!password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // navigation switches automatically via auth state.
    } catch (err) {
      setServerError(err.message || 'Could not sign in.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue your support journey.</Text>
        </View>

        {serverError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{serverError}</Text>
          </View>
        ) : null}

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          error={errors.email}
          keyboardType="email-address"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          secureTextEntry
          error={errors.password}
        />

        <Button label="Sign in" onPress={handleSubmit} loading={submitting} />

        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkPrompt}>Don't have an account? </Text>
          <Text style={styles.linkAction}>Create one</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  header: { marginTop: spacing.xl, marginBottom: spacing.xl },
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
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  linkPrompt: {
    color: colors.textMuted,
    fontSize: 15,
    fontFamily: 'System',
  },
  linkAction: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'System',
  },
});
