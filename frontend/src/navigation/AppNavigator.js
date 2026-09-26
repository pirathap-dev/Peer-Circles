import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { colors } from '../config';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CommunityDetailsScreen from '../screens/CommunityDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import DiscussionListScreen from '../screens/DiscussionListScreen';
import CreateDiscussionScreen from '../screens/CreateDiscussionScreen';
import DiscussionDetailScreen from '../screens/DiscussionDetailScreen';
import MessagesInboxScreen from '../screens/MessagesInboxScreen';
import ConversationScreen from '../screens/ConversationScreen';
import MemberProfileScreen from '../screens/MemberProfileScreen';

const Stack = createNativeStackNavigator();

const authScreenOptions = { headerShown: false };
const mainScreenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTitleStyle: { fontFamily: 'System', fontWeight: '600', color: colors.text },
  headerTintColor: colors.primary,
  headerShadowVisible: false,
};

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader style={{ flex: 1 }} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={mainScreenOptions}>
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CommunityDetails"
              component={CommunityDetailsScreen}
              options={{ title: 'Community' }}
            />
            <Stack.Screen
              name="DiscussionList"
              component={DiscussionListScreen}
              options={{ title: 'Discussions' }}
            />
            <Stack.Screen
              name="CreateDiscussion"
              component={CreateDiscussionScreen}
              options={{ title: 'New Discussion' }}
            />
            <Stack.Screen
              name="DiscussionDetail"
              component={DiscussionDetailScreen}
              options={{ title: 'Discussion' }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Profile' }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ title: 'Edit Profile' }}
            />
            <Stack.Screen
              name="MessagesInbox"
              component={MessagesInboxScreen}
              options={{ title: 'Messages' }}
            />
            <Stack.Screen
              name="Conversation"
              component={ConversationScreen}
              options={{ title: 'Chat' }}
            />
            <Stack.Screen
              name="MemberProfile"
              component={MemberProfileScreen}
              options={{ title: 'Member' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={authScreenOptions} />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: true, title: 'Create account' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}