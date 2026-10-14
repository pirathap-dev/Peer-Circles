import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { colors, spacing } from '../config';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Button from '../components/Button';
import LeafletMap from '../components/LeafletMap';

function FormField({ label, value, onChangeText, placeholder, multiline = false, keyboardType }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType || 'default'}
        autoCapitalize="sentences"
      />
    </View>
  );
}

export default function AdminDashboardScreen() {
  const { token, user, logout } = useAuth();
  const [formType, setFormType] = useState('event');
  const [submitting, setSubmitting] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventDate, setEventDate] = useState(new Date(Date.now() + 7 * 86400000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [draftEventDate, setDraftEventDate] = useState(eventDate);
  const [iosPickerMode, setIosPickerMode] = useState('date');
  const [coordinates, setCoordinates] = useState(null);
  const [mapResetKey, setMapResetKey] = useState(0);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');
  const [resourceCategory, setResourceCategory] = useState('');
  const [resourceContent, setResourceContent] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupLocation, setGroupLocation] = useState('');

  function chooseEventDateTime() {
    if (Platform.OS === 'ios') {
      setDraftEventDate(eventDate);
      setIosPickerMode('date');
      setShowDatePicker(true);
      return;
    }

    DateTimePickerAndroid.open({
      value: eventDate,
      mode: 'date',
      onValueChange: (dateEvent, selectedDate) => {
        if (dateEvent.type !== 'set' || !selectedDate) return;

        const dateValue = new Date(eventDate);
        dateValue.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        );

        DateTimePickerAndroid.open({
          value: dateValue,
          mode: 'time',
          onValueChange: (timeEvent, selectedTime) => {
            if (timeEvent.type !== 'set' || !selectedTime) return;

            dateValue.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
            setEventDate(dateValue);
          },
        });
      },
    });
  }

  function handleDateChange(_event, selectedDate) {
    if (selectedDate) setDraftEventDate(selectedDate);
  }

  async function submitEvent() {
    if (!eventTitle.trim() || !eventLocation.trim()) {
      Alert.alert('Missing information', 'Enter an event title and venue.');
      return;
    }
    setSubmitting(true);
    try {
      await api.createEvent(token, {
        title: eventTitle.trim(),
        description: eventDescription.trim(),
        date: eventDate.toISOString(),
        location: eventLocation.trim(),
        category: eventCategory.trim(),
        latitude: coordinates?.latitude ?? null,
        longitude: coordinates?.longitude ?? null,
      });
      setEventTitle('');
      setEventDescription('');
      setEventLocation('');
      setEventCategory('');
      setCoordinates(null);
      setMapResetKey((key) => key + 1);
      Alert.alert('Event published', 'Users have been notified about the new event.');
    } catch (error) {
      Alert.alert('Could not publish event', error.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function submitResource() {
    if (!resourceTitle.trim() || (!resourceContent.trim() && !resourceUrl.trim())) {
      Alert.alert('Missing information', 'Enter a title and either resource content or a URL.');
      return;
    }
    setSubmitting(true);
    try {
      await api.createResource(token, {
        title: resourceTitle.trim(),
        description: resourceDescription.trim(),
        category: resourceCategory.trim(),
        content: resourceContent.trim(),
        url: resourceUrl.trim(),
      });
      setResourceTitle('');
      setResourceDescription('');
      setResourceCategory('');
      setResourceContent('');
      setResourceUrl('');
      Alert.alert('Resource published', 'Users have been notified about the new resource.');
    } catch (error) {
      Alert.alert('Could not publish resource', error.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function submitPeerGroup() {
    if (!groupName.trim() || !groupDescription.trim() || !groupLocation.trim()) {
      Alert.alert('Missing information', 'Enter the peer group name, description, and location.');
      return;
    }
    setSubmitting(true);
    try {
      await api.createPeerGroup(token, {
        name: groupName.trim(),
        description: groupDescription.trim(),
        location: groupLocation.trim(),
      });
      setGroupName('');
      setGroupDescription('');
      setGroupLocation('');
      Alert.alert('Peer group created', 'Users have been notified about the new peer group.');
    } catch (error) {
      Alert.alert('Could not create peer group', error.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Admin console</Text>
            <Text style={styles.subtitle}>Signed in as {user?.username}</Text>
          </View>
          <TouchableOpacity onPress={logout} accessibilityRole="button">
            <Text style={styles.logout}>Sign out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, formType === 'event' && styles.activeTab]}
            onPress={() => setFormType('event')}
          >
            <Text style={[styles.tabText, formType === 'event' && styles.activeTabText]}>Create event</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, formType === 'resource' && styles.activeTab]}
            onPress={() => setFormType('resource')}
          >
            <Text style={[styles.tabText, formType === 'resource' && styles.activeTabText]}>Resource</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, formType === 'group' && styles.activeTab]}
            onPress={() => setFormType('group')}
          >
            <Text style={[styles.tabText, formType === 'group' && styles.activeTabText]}>Peer group</Text>
          </TouchableOpacity>
        </View>

        {formType === 'event' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Publish a community event</Text>
            <FormField label="Event title *" value={eventTitle} onChangeText={setEventTitle} placeholder="Peer support meetup" />
            <FormField
              label="Description"
              value={eventDescription}
              onChangeText={setEventDescription}
              placeholder="What should attendees know?"
              multiline
            />
            <FormField label="Venue *" value={eventLocation} onChangeText={setEventLocation} placeholder="Venue name or address" />
            <FormField label="Category" value={eventCategory} onChangeText={setEventCategory} placeholder="Workshop, meetup..." />
            <Text style={styles.label}>Date and time</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={chooseEventDateTime}
            >
              <Text style={styles.dateText}>
                {eventDate.toLocaleString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Text>
              <Text style={styles.pickDate}>Choose date & time</Text>
            </TouchableOpacity>
            {showDatePicker && Platform.OS === 'ios' ? (
              <Modal
                transparent
                animationType="slide"
                onRequestClose={() => setShowDatePicker(false)}
              >
                <View style={styles.modalBackdrop}>
                  <View style={styles.dateModal}>
                    <View style={styles.pickerHeader}>
                      <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                        <Text style={styles.pickerAction}>Cancel</Text>
                      </TouchableOpacity>
                      <Text style={styles.pickerTitle}>Event date and time</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setEventDate(draftEventDate);
                          setShowDatePicker(false);
                        }}
                      >
                        <Text style={styles.pickerAction}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.pickerTabs}>
                      <TouchableOpacity
                        style={[styles.pickerTab, iosPickerMode === 'date' && styles.pickerTabActive]}
                        onPress={() => setIosPickerMode('date')}
                      >
                        <Text style={[styles.pickerTabText, iosPickerMode === 'date' && styles.pickerTabTextActive]}>
                          Date
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.pickerTab, iosPickerMode === 'time' && styles.pickerTabActive]}
                        onPress={() => setIosPickerMode('time')}
                      >
                        <Text style={[styles.pickerTabText, iosPickerMode === 'time' && styles.pickerTabTextActive]}>
                          Time
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={draftEventDate}
                      mode={iosPickerMode}
                      display="spinner"
                      themeVariant="light"
                      onValueChange={handleDateChange}
                      style={styles.iosDatePicker}
                    />
                  </View>
                </View>
              </Modal>
            ) : null}

            <Text style={styles.label}>Tap the map to pin the venue</Text>
            <LeafletMap
              key={mapResetKey}
              style={styles.map}
              selectable
              onCoordinateSelect={setCoordinates}
            />
            <Text style={styles.coordinateHint}>
              {coordinates
                ? `${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)}`
                : 'No map pin selected. Tap the venue on the map to add one.'}
            </Text>
            {coordinates ? (
              <TouchableOpacity
                onPress={() => {
                  setCoordinates(null);
                  setMapResetKey((key) => key + 1);
                }}
                style={styles.clearPin}
              >
                <Text style={styles.clearPinText}>Remove map pin</Text>
              </TouchableOpacity>
            ) : null}
            <Button label="Publish event" onPress={submitEvent} loading={submitting} style={styles.submit} />
          </View>
        ) : formType === 'resource' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Publish an educational resource</Text>
            <FormField label="Resource title *" value={resourceTitle} onChangeText={setResourceTitle} placeholder="Managing stress" />
            <FormField label="Description" value={resourceDescription} onChangeText={setResourceDescription} placeholder="Short summary" multiline />
            <FormField label="Category" value={resourceCategory} onChangeText={setResourceCategory} placeholder="Wellbeing, support..." />
            <FormField label="Content" value={resourceContent} onChangeText={setResourceContent} placeholder="Write the resource here" multiline />
            <FormField label="Or URL" value={resourceUrl} onChangeText={setResourceUrl} placeholder="https://example.org/resource" keyboardType="url" />
            <Button label="Publish resource" onPress={submitResource} loading={submitting} style={styles.submit} />
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create a peer support group</Text>
            <FormField
              label="Group name *"
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Anxiety support circle"
            />
            <FormField
              label="Description *"
              value={groupDescription}
              onChangeText={setGroupDescription}
              placeholder="What is this group for?"
              multiline
            />
            <FormField
              label="Location *"
              value={groupLocation}
              onChangeText={setGroupLocation}
              placeholder="City, region, or Online"
            />
            <Button label="Create peer group" onPress={submitPeerGroup} loading={submitting} style={styles.submit} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  heading: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { color: colors.textMuted, marginTop: 4 },
  logout: { color: colors.error, fontWeight: '600', padding: spacing.sm },
  tabs: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  tab: { flex: 1, padding: spacing.md, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center' },
  activeTab: { backgroundColor: colors.primary },
  tabText: { color: colors.textMuted, fontWeight: '600' },
  activeTabText: { color: '#FFFFFF' },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: spacing.md },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  field: { marginBottom: spacing.md },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: spacing.xs },
  input: { minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: spacing.md, color: colors.text, backgroundColor: colors.background },
  multiline: { minHeight: 90, paddingTop: spacing.md },
  dateButton: { minHeight: 48, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  dateText: { color: colors.text },
  pickDate: { color: colors.primary, fontWeight: '600' },
  map: { height: 240, borderRadius: 12, marginTop: spacing.xs },
  coordinateHint: { color: colors.textMuted, fontSize: 12, marginTop: spacing.sm },
  clearPin: { alignSelf: 'flex-start', paddingVertical: spacing.sm },
  clearPinText: { color: colors.error, fontWeight: '600' },
  submit: { marginTop: spacing.md },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000066' },
  dateModal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 48,
  },
  pickerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pickerTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
  pickerAction: { color: colors.primary, fontSize: 16, fontWeight: '600', padding: spacing.xs },
  pickerTabs: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 4,
    marginTop: spacing.md,
  },
  pickerTab: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: 8 },
  pickerTabActive: { backgroundColor: colors.primary },
  pickerTabText: { color: colors.textMuted, fontWeight: '600' },
  pickerTabTextActive: { color: '#FFFFFF' },
  iosDatePicker: { height: 200 },
});
