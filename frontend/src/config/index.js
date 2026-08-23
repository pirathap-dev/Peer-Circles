// Central configuration. Reads EXPO_PUBLIC_API_URL from the environment.
const rawUrl = process.env.EXPO_PUBLIC_API_URL;

if (!rawUrl) {
  console.warn(
    'EXPO_PUBLIC_API_URL is not set. Create frontend/.env with EXPO_PUBLIC_API_URL=http://<YOUR_LAPTOP_IP>:5000/api'
  );
}

// Ensure no trailing slash so endpoints concatenate cleanly.
export const API_BASE_URL = (rawUrl || 'http://localhost:5000/api').replace(/\/$/, '');

export const colors = {
  primary: '#2F8F83',
  primaryDark: '#246B62',
  primarySoft: '#E8F3EF',
  accent: '#F4A261',
  background: '#F7FAF9',
  surface: '#FFFFFF',
  text: '#1C2B27',
  textMuted: '#5E726C',
  border: '#E1EAE7',
  error: '#C0392B',
  success: '#2E8B57',
  warning: '#D49A00',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
