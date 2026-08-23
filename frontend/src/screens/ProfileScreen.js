import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function formatJoinDate(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const joined = formatJoinDate(user?.created_at || user?.createdAt);

  function handleLogout() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Your profile'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {joined ? <Text style={styles.joined}>Member since {joined}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full name</Text>
            <Text style={styles.infoValue}>{user?.name || '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email || '—'}</Text>
          </View>
        </View>

        <Button
          label="Edit profile"
          variant="outline"
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.editBtn}
        />

        <Button
          label="Sign out"
          variant="outline"
          onPress={handleLogout}
          style={styles.signOutBtn}
        />

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This platform provides peer support and community connection. It is not a substitute for
            professional mental-health care.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  headerCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.surface,
    fontFamily: 'System',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'System',
  },
  email: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: 'System',
  },
  joined: {
    fontSize: 13,
    color: colors.primaryDark,
    marginTop: spacing.sm,
    fontFamily: 'System',
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    fontFamily: 'System',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: 'System',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'System',
    fontWeight: '600',
  },
  editBtn: { marginBottom: spacing.sm },
  signOutBtn: { marginBottom: spacing.lg },
  disclaimer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'System',
  },
});