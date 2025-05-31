
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Analytics } from '../utils/analytics';

// Hook for automatic page view tracking
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    const screenName = getScreenNameFromPath(location.pathname);
    Analytics.trackPageView(location.pathname, screenName);
  }, [location]);

  return {
    trackEvent: Analytics.trackEvent,
    trackUserSignup: Analytics.trackUserSignup,
    trackUserSignin: Analytics.trackUserSignin,
    trackStartTrial: Analytics.trackStartTrial,
    trackOnboardingComplete: Analytics.trackOnboardingComplete,
    trackFileUpload: Analytics.trackFileUpload,
    trackChatMessage: Analytics.trackChatMessage,
    trackDashboardVisit: Analytics.trackDashboardVisit,
  };
};

// Helper function to get screen name from path
function getScreenNameFromPath(pathname: string): string {
  const pathMap: { [key: string]: string } = {
    '/': 'landing',
    '/auth': 'authentication',
    '/onboarding': 'onboarding',
    '/dashboard': 'dashboard',
  };

  return pathMap[pathname] || 'unknown';
}
