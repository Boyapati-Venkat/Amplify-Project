import { record, identifyUser, configureAutoTrack } from 'aws-amplify/analytics';

// Configure auto-tracking for sessions
if (typeof window !== 'undefined') {
  try {
    configureAutoTrack({
      enable: false // Disable auto-tracking to prevent the error
    });
    console.log('Analytics auto-tracking disabled');
  } catch (error) {
    console.error('Error configuring analytics:', error);
  }
}

// Define event types for type safety
export type AnalyticsEventType = 
  | 'page_view'
  | 'user_signup'
  | 'user_signin'
  | 'start_trial'
  | 'onboarding_complete'
  | 'file_upload'
  | 'chat_message_sent'
  | 'dashboard_visit'
  | 'data_export'
  | 'data_search'
  | 'data_filter'
  | 'navigation_click'
  | 'feature_usage';

// Define custom attributes interface
export interface AnalyticsAttributes {
  username?: string;
  email?: string;
  planType?: 'free' | 'premium' | 'enterprise';
  screenName?: string;
  route?: string;
  userAgent?: string;
  timestamp?: string;
  sessionId?: string;
  fileType?: string;
  fileSize?: number;
  exportFormat?: string;
  searchTerm?: string;
  filterType?: string;
  featureName?: string;
  navigationTarget?: string;
}

// Helper function to convert attributes to string format for AWS Amplify
const convertAttributesToStrings = (attributes: AnalyticsAttributes): Record<string, string> => {
  const stringAttributes: Record<string, string> = {};
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      stringAttributes[key] = String(value);
    }
  });
  
  return stringAttributes;
};

// Analytics utility class
export class Analytics {
  private static sessionId: string = Analytics.generateSessionId();

  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Track custom events
  static async trackEvent(
    eventType: AnalyticsEventType,
    attributes: AnalyticsAttributes = {}
  ): Promise<void> {
    try {
      const enrichedAttributes = {
        ...attributes,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      };

      console.log(`📊 Analytics Event: ${eventType}`, enrichedAttributes);

      // Try to send to Pinpoint, but don't fail if it doesn't work
      try {
        await record({
          name: eventType,
          attributes: convertAttributesToStrings(enrichedAttributes),
        });
      } catch (recordError) {
        console.log('Analytics record failed, falling back to local logging only:', recordError);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  // Identify user for analytics
  static async identifyUser(userId: string, userAttributes: Record<string, string> = {}): Promise<void> {
    try {
      await identifyUser({
        userId,
        userProfile: userAttributes
      });
      console.log('📊 User identified for analytics:', userId);
    } catch (error) {
      console.error('Failed to identify user for analytics:', error);
    }
  }

  // Track page views
  static async trackPageView(route: string, screenName?: string): Promise<void> {
    await this.trackEvent('page_view', {
      route,
      screenName: screenName || route.replace('/', '') || 'home',
    });
  }

  // Track user actions
  static async trackUserSignup(email: string, name?: string): Promise<void> {
    await this.trackEvent('user_signup', {
      email,
      username: name,
      planType: 'free',
    });
    
    // Also identify the user
    if (email) {
      await this.identifyUser(email, {
        email,
        name: name || '',
        signupDate: new Date().toISOString()
      });
    }
  }

  static async trackUserSignin(email: string): Promise<void> {
    await this.trackEvent('user_signin', {
      email,
    });
    
    // Also identify the user
    if (email) {
      await this.identifyUser(email, {
        email,
        lastSignIn: new Date().toISOString()
      });
    }
  }

  static async trackStartTrial(planType: 'free' | 'premium' | 'enterprise' = 'free'): Promise<void> {
    await this.trackEvent('start_trial', {
      planType,
    });
  }

  static async trackOnboardingComplete(email: string, planType: 'free' | 'premium' | 'enterprise' = 'free'): Promise<void> {
    await this.trackEvent('onboarding_complete', {
      email,
      planType,
    });
  }

  static async trackFileUpload(fileName: string, fileSize: number, fileType: string = 'unknown'): Promise<void> {
    await this.trackEvent('file_upload', {
      screenName: 'dashboard',
      planType: 'free',
      fileType,
      fileSize,
    });
  }

  static async trackChatMessage(messageType: 'user' | 'ai' = 'user'): Promise<void> {
    await this.trackEvent('chat_message_sent', {
      screenName: 'dashboard',
    });
  }

  static async trackDashboardVisit(email: string): Promise<void> {
    await this.trackEvent('dashboard_visit', {
      email,
      screenName: 'dashboard',
    });
  }

  // New tracking methods for enhanced analytics
  static async trackDataExport(exportFormat: string, recordCount: number): Promise<void> {
    await this.trackEvent('data_export', {
      exportFormat,
      screenName: 'data_viewer',
    });
  }

  static async trackDataSearch(searchTerm: string): Promise<void> {
    await this.trackEvent('data_search', {
      searchTerm,
      screenName: 'data_viewer',
    });
  }

  static async trackDataFilter(filterType: string): Promise<void> {
    await this.trackEvent('data_filter', {
      filterType,
      screenName: 'data_viewer',
    });
  }

  static async trackNavigationClick(navigationTarget: string): Promise<void> {
    await this.trackEvent('navigation_click', {
      navigationTarget,
    });
  }

  static async trackFeatureUsage(featureName: string, screenName: string): Promise<void> {
    await this.trackEvent('feature_usage', {
      featureName,
      screenName,
    });
  }
}