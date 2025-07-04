// App color scheme
export const colors = {
  primary: '#4A90E2', // Soft blue
  secondary: '#6FCF97', // Pastel green
  tertiary: '#F2C94C', // Warm yellow
  background: '#FFFFFF',
  card: '#F9FAFB',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  premium: '#9061F9', // Purple for premium features
};

// Status colors for pet health
export const healthStatus = {
  good: '#10B981', // Green
  warning: '#F59E0B', // Orange
  alert: '#EF4444', // Red
  neutral: '#9CA3AF', // Gray
};

export default {
  light: {
    text: colors.text,
    background: colors.background,
    tint: colors.primary,
    tabIconDefault: '#ccc',
    tabIconSelected: colors.primary,
  },
};
