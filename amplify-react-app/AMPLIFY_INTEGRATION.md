# AWS Amplify Integration Guide

This guide explains how to integrate AWS Amplify authentication, storage, and API functionality into the insight-builder-app-main project.

## Files Created

1. `src/aws-exports.js` - AWS configuration file
2. `src/components/AmplifyFileUpload.tsx` - S3 file upload component
3. `src/components/AmplifyDataViewer.tsx` - DynamoDB data viewer component

## Installation Steps

1. Install required dependencies:

```bash
npm install aws-amplify @aws-sdk/client-s3 @aws-sdk/credential-providers
```

2. Update `src/main.tsx` to configure Amplify:

```javascript
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports.js';

// Configure Amplify with explicit Storage configuration
Amplify.configure({
  ...awsExports,
  Storage: {
    region: awsExports.aws_user_files_s3_bucket_region,
    bucket: awsExports.aws_user_files_s3_bucket,
  }
});

createRoot(document.getElementById("root")!).render(<App />);
```

3. Update `src/contexts/AuthContext.tsx` to use Amplify Auth:

```javascript
// Replace the mock authentication with Amplify Auth
import { signIn, signUp, signOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

// Update the signIn function
const signIn = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    await amplifySignIn({ username: email, password });
    
    // Get user attributes after sign in
    const currentUser = await getCurrentUser();
    const attributes = await fetchUserAttributes();
    
    const userData = {
      id: currentUser.userId,
      email: attributes.email || '',
      name: attributes.name,
      isOnboarded: attributes['custom:isOnboarded'] === 'true'
    };
    
    setUser(userData);
  } catch (error) {
    console.error('Error signing in:', error);
    throw new Error('Authentication failed');
  } finally {
    setIsLoading(false);
  }
};

// Update other auth functions similarly
```

4. Use the Amplify components in your pages:

```javascript
// In Dashboard.tsx or other pages
import AmplifyFileUpload from '../components/AmplifyFileUpload';
import AmplifyDataViewer from '../components/AmplifyDataViewer';

// Then in your JSX
<AmplifyFileUpload userId={user.id} />
<AmplifyDataViewer userId={user.id} />
```

## AWS Resources Required

1. Cognito User Pool and Identity Pool
2. AppSync GraphQL API
3. S3 Bucket for file storage
4. DynamoDB table for data storage

## GraphQL Schema

```graphql
type TransformedRecord @model 
  @auth(rules: [
    { allow: owner },
    { allow: public, operations: [read], provider: apiKey }
  ]) {
  id: ID!
  userId: String!
  name: String
  email: String
  score: Int
  createdAt: AWSDateTime
}
```

## Important Notes

1. The `aws-exports.js` file contains sensitive information and should be handled securely
2. Make sure CORS is properly configured on your S3 bucket
3. The Cognito User Pool should have the custom attribute `custom:isOnboarded` defined
4. The AppSync API should have both Cognito and API Key authentication configured