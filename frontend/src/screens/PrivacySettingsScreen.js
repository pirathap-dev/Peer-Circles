import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../config';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { api } from '../services/api';

export default function PrivacySettingsScreen() {
  const navigation = useNavigation();
  const { token } = useAuth();

  const [settings, setSettings] = useState({
    allow_private_messages: true,
    show_online_status: true,
    make_profile_private: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrivacySettings();
  }, []);

  const fetchPrivacySettings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getPrivacySettings(token);
      setSettings({
        allow_private_messages: data.allow_private_messages ?? true,
        show_online_status: data.show_online_status ?? true,
        make_profile_private: data.make_profile_private ?? false,
      });
    } catch (err) {
      setError(err.message || 'Failed to load privacy settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      await api.updatePrivacySettings(token, settings);
      Alert.alert('Success', 'Privacy settings updated successfully.');
      navigation.goBack();
    } catch (err) {
      setError(err.message || 'Failed to update privacy settings.');
      Alert.alert('Error', err.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const toggleSwitch = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <View style={[styles.flex, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Manage Privacy</Text>
        <Text style={styles.headerSubtitle}>
          Control who can see your profile and contact you on Peer Circles.
        </Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Allow Private Messages</Text>
              <Text style={styles.settingDescription}>
                Let other members send you direct messages.
              </Text>
            </View>
            <Switch
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
              ios_backgroundColor={colors.border}
              onValueChange={() => toggleSwitch('allow_private_messages')}
              value={settings.allow_private_messages}
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Show Online Status</Text>
              <Text style={styles.settingDescription}>
                Let others see when you are active on the platform.
              </Text>
            </View>
            <Switch
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
              ios_backgroundColor={colors.border}
              onValueChange={() => toggleSwitch('show_online_status')}
              value={settings.show_online_status}
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Private Profile</Text>
              <Text style={styles.settingDescription}>
                Hide your profile details from non-members.
              </Text>
            </View>
            <Switch
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
              ios_backgroundColor={colors.border}
              onValueChange={() => toggleSwitch('make_profile_private')}
              value={settings.make_profile_private}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            label={saving ? 'Saving...' : 'Save Settings'}
            variant="primary"
            onPress={handleSave}
            disabled={saving}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'System',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textMuted,
    fontFamily: 'System',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'System',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: 'System',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    fontFamily: 'System',
  },
});
