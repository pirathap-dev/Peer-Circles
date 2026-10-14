import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, spacing } from '../config';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

export default function AdminLoginScreen() {
  const { adminLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError('');
    setSubmitting(true);
    try {
      await adminLogin(username.trim(), password);
    } catch (loginError) {
      setError(loginError.message || 'Could not sign in as administrator.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Administrator sign in</Text>
        <Text style={styles.subtitle}>Sign in to manage events and learning resources.</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Input
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Admin username"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Admin password"
          secureTextEntry
        />
        <Button
          label="Sign in"
          onPress={handleSubmit}
          loading={submitting}
          disabled={!username || !password}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  title: { color: colors.text, fontSize: 26, fontWeight: '700', marginBottom: spacing.sm },
  subtitle: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginBottom: spacing.xl },
  error: {
    color: colors.error,
    backgroundColor: '#FCEAEA',
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
});
