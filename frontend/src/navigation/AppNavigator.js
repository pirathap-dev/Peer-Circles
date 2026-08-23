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
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={authScreenOptions} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ ...authScreenOptions, headerShown: true, title: 'Create account' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
