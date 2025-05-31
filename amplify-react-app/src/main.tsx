import { createRoot } from "react-dom/client";
import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import { record } from 'aws-amplify/analytics';
import App from "./App.tsx";
import "./index.css";
import awsExports from './aws-exports.js';

// Only configure Amplify in browser environment
if (typeof window !== 'undefined') {
  // Configure Amplify with debug logging
  Amplify.configure(awsExports);
  
  // Set up Hub listener for auth events
  Hub.listen('auth', (data) => {
    const { payload } = data;
    console.log('Auth event:', payload.event);
    
    if (payload.event === 'signIn_failure' || payload.event === 'signUp_failure') {
      console.error('Auth error:', payload.data);
    }
    
    // Track auth events in analytics
    if (payload.event === 'signIn') {
      record({
        name: 'user_signin',
        attributes: { timestamp: new Date().toISOString() }
      }).catch(err => console.error('Analytics error:', err));
    }
    
    if (payload.event === 'signUp') {
      record({
        name: 'user_signup',
        attributes: { timestamp: new Date().toISOString() }
      }).catch(err => console.error('Analytics error:', err));
    }
  });
}

// Set document title
if (typeof document !== 'undefined') {
  document.title = "Migration Tool (MAIT)";
}

createRoot(document.getElementById("root")!).render(<App />);