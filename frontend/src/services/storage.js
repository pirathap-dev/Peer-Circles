// Thin wrapper around AsyncStorage for auth persistence.
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

export async function saveAuth(token, user) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function loadAuth() {
  const [[, token], [, userJson]] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
  if (!token) return null;
  let user = null;
  try {
    user = userJson ? JSON.parse(userJson) : null;
  } catch (_e) {
    user = null;
  }
  return { token, user };
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}
