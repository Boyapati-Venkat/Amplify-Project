// Re-export analytics functionality for easy importing
export { Analytics } from './utils/analytics';
export { useAnalytics } from './hooks/useAnalytics';
export { default as AnalyticsDashboard } from './components/AnalyticsDashboard';
export { default as AnalyticsButton } from './components/AnalyticsButton';
export type { AnalyticsEventType, AnalyticsAttributes } from './utils/analytics';

// Configure analytics
import { Amplify } from 'aws-amplify';

// Only run in browser environment
if (typeof window !== 'undefined') {
  // Get existing config
  const existingConfig = Amplify.getConfig();
  
  // Get app ID from environment variables
  const appId = import.meta.env.VITE_END_USER_MESSAGING_APP_ID || 
                import.meta.env.VITE_PINPOINT_APP_ID || 
                '';
  
  // Only configure if we have an app ID
  if (appId) {
    // Configure analytics
    Amplify.configure({
      ...existingConfig,
      Analytics: {
        Messaging: {
          // Use AWS End User Messaging
          appId: appId,
          region: import.meta.env.VITE_AWS_REGION || 'us-east-1'
        }
      }
    });
    
    console.log('📊 Analytics configured with AWS End User Messaging');
  } else {
    console.log('📊 Analytics running in local mode (no AWS End User Messaging configured)');
  }
}