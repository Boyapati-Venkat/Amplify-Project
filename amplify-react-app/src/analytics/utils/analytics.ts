import { record } from 'aws-amplify/analytics';

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

// Check if analytics is properly configured
const isAnalyticsConfigured = () => {
  // Check for End User Messaging App ID first, then fall back to Pinpoint for backward compatibility
  const appId = import.meta.env.VITE_END_USER_MESSAGING_APP_ID || 
                import.meta.env.VITE_PINPOINT_APP_ID || 
                '';
  return appId && appId !== '';
};

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
  private static sessionId: string = this.generateSessionId();

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

      // Only send to AWS if it's configured
      if (isAnalyticsConfigured()) {
        await record({
          name: eventType,
          attributes: convertAttributesToStrings(enrichedAttributes),
        });
      } else {
        console.log('📊 Analytics: AWS End User Messaging not configured, event logged locally only');
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
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
  }

  static async trackUserSignin(email: string): Promise<void> {
    await this.trackEvent('user_signin', {
      email,
    });
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