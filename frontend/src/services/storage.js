// Thin wrapper around AsyncStorage for auth persistence.
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';
const ROLE_KEY = '@auth_role';

export async function saveAuth(token, user, role = 'user') {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
    [ROLE_KEY, role],
  ]);
}

export async function loadAuth() {
  const [[, token], [, userJson], [, storedRole]] = await AsyncStorage.multiGet([
    TOKEN_KEY,
    USER_KEY,
    ROLE_KEY,
  ]);
  if (!token) return null;
  let user = null;
  try {
    user = userJson ? JSON.parse(userJson) : null;
  } catch (_e) {
    user = null;
  }
  return { token, user, role: storedRole || 'user' };
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, ROLE_KEY]);
}
