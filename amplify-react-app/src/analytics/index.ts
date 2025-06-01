// Re-export analytics functionality for easy importing
export { Analytics } from './utils/analytics';
export { useAnalytics } from './hooks/useAnalytics';
export { default as AnalyticsDashboard } from './components/AnalyticsDashboard';
export { default as AnalyticsButton } from './components/AnalyticsButton';
export type { AnalyticsEventType, AnalyticsAttributes } from './utils/analytics';

// No need to configure Amplify here as it's already configured in main.tsx with aws-exports.js
// which now includes the Pinpoint analytics configuration