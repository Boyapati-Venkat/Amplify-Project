import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signIn as amplifySignIn, 
  signUp as amplifySignUp, 
  signOut as amplifySignOut, 
  confirmSignUp,
  autoSignIn,
  getCurrentUser, 
  fetchUserAttributes,
  confirmSignIn
} from 'aws-amplify/auth';
import logger from '../utils/logger';

interface User {
  id: string;
  email: string;
  name?: string;
  isOnboarded?: boolean;
}

interface ConfirmationData {
  email: string;
  password: string;
  name: string;
}

interface PasswordChangeData {
  email: string;
  challengeResponse: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string;
  confirmationRequired: ConfirmationData | null;
  passwordChangeRequired: PasswordChangeData | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; requiresConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  confirmSignUpWithCode: (email: string, code: string) => Promise<boolean>;
  completeNewPasswordChallenge: (newPassword: string) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmationRequired, setConfirmationRequired] = useState<ConfirmationData | null>(null);
  const [passwordChangeRequired, setPasswordChangeRequired] = useState<PasswordChangeData | null>(null);

  useEffect(() => {
    // Only check auth in browser environment
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    // Check for existing Amplify session
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log('Current user found:', currentUser);
        
        try {
          const attributes = await fetchUserAttributes();
          console.log('User attributes:', attributes);
          
          setUser({
            id: currentUser.userId,
            email: attributes.email || '',
            name: attributes.name,
            isOnboarded: false // Default value instead of using custom attribute
          });
          
          logger.logAuthSuccess('Session Restored', {
            userId: currentUser.userId,
            hasEmail: !!attributes.email,
            hasName: !!attributes.name
          });
        } catch (attrError) {
          logger.logAuthError('Fetch Attributes', attrError);
          setUser(null);
        }
      } catch (error) {
        console.log('No current user signed in');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    if (typeof window === 'undefined') {
      throw new Error('Authentication not available during build');
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Check if a user is already signed in
      try {
        const currentUser = await getCurrentUser();
        // If we get here, a user is already signed in
        console.log('User already signed in:', currentUser);
        
        // If the current user is the same as the one trying to sign in, return success
        const attributes = await fetchUserAttributes();
        if (attributes.email === email) {
          const userData = {
            id: currentUser.userId,
            email: attributes.email,
            name: attributes.name || email.split('@')[0],
            isOnboarded: false
          };
          
          setUser(userData);
          logger.logAuthSuccess('Already Signed In', userData);
          return true;
        }
        
        // If it's a different user, sign out first
        console.log('Different user trying to sign in, signing out current user');
        await amplifySignOut();
      } catch (e) {
        // No user is signed in, continue with sign in
        console.log('No user currently signed in, proceeding with sign in');
      }
      
      logger.logAuthAttempt('Sign In', { email });
      
      const result = await amplifySignIn({
        username: email,
        password
      });
      
      console.log('Sign in result:', result);
      
      if (result.isSignedIn) {
        try {
          const currentUser = await getCurrentUser();
          console.log('User after sign in:', currentUser);
          
          const attributes = await fetchUserAttributes();
          console.log('User attributes after sign in:', attributes);
          
          const userData = {
            id: currentUser.userId,
            email: attributes.email || email,
            name: attributes.name || email.split('@')[0],
            isOnboarded: false // Default value instead of using custom attribute
          };
          
          setUser(userData);
          logger.logAuthSuccess('Sign In', userData);
          return true;
        } catch (userError) {
          logger.logAuthError('Get User After Sign In', userError);
          setError('Failed to retrieve user information');
          return false;
        }
      } else if (result.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        // Handle password change requirement
        setPasswordChangeRequired({
          email,
          challengeResponse: result
        });
        setError('You need to change your password before continuing.');
        return false;
      } else {
        setError('Sign in was not completed');
        return false;
      }
    } catch (error: any) {
      // If the error is because user is already authenticated
      if (error.message && error.message.includes('There is already a signed in user')) {
        try {
          const currentUser = await getCurrentUser();
          const attributes = await fetchUserAttributes();
          
          const userData = {
            id: currentUser.userId,
            email: attributes.email || '',
            name: attributes.name || email.split('@')[0],
            isOnboarded: false
          };
          
          setUser(userData);
          logger.logAuthSuccess('Already Authenticated', userData);
          return true;
        } catch (e) {
          logger.logAuthError('Get User After Already Authenticated Error', e);
          setError('Error retrieving current user information');
          return false;
        }
      }
      
      logger.logAuthError('Sign In', error);
      
      // Set user-friendly error messages
      if (error.message && error.message.includes('Incorrect username or password')) {
        setError('Incorrect email or password. Please try again.');
      } else if (error.message && error.message.includes('User does not exist')) {
        setError('No account found with this email. Please sign up first.');
      } else {
        setError(error.message || 'Authentication failed');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; requiresConfirmation?: boolean }> => {
    if (typeof window === 'undefined') {
      throw new Error('Authentication not available during build');
    }

    setIsLoading(true);
    setError('');
    
    try {
      logger.logAuthAttempt('Sign Up', { email, name });
      
      const { isSignUpComplete, userId, nextStep } = await amplifySignUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name
            // Removed custom:isOnboarded attribute that was causing the error
          },
          autoSignIn: true
        }
      });
      
      console.log('Sign up result:', { isSignUpComplete, userId, nextStep });
      
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setConfirmationRequired({
          email,
          password,
          name
        });
        return { success: true, requiresConfirmation: true };
      }
      
      if (isSignUpComplete) {
        try {
          const currentUser = await getCurrentUser();
          const attributes = await fetchUserAttributes();
          
          const userData = {
            id: currentUser.userId,
            email,
            name,
            isOnboarded: false // Default value instead of using custom attribute
          };
          
          setUser(userData);
          logger.logAuthSuccess('Sign Up', userData);
        } catch (getUserError) {
          logger.logAuthError('Get User After Sign Up', getUserError);
        }
      }
      
      return { success: true, requiresConfirmation: false };
    } catch (error: any) {
      logger.logAuthError('Sign Up', error);
      
      // Set user-friendly error messages
      if (error.message && error.message.includes('User already exists')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (error.message && error.message.includes('Password not long enough')) {
        setError('Password must be at least 8 characters long.');
      } else if (error.message && error.message.includes('password policy')) {
        setError('Password must include uppercase, lowercase, numbers, and special characters.');
      } else {
        setError(error.message || 'Registration failed');
      }
      
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSignUpWithCode = async (email: string, code: string): Promise<boolean> => {
    if (typeof window === 'undefined') {
      throw new Error('Authentication not available during build');
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      logger.logAuthAttempt('Confirm Sign Up', { email, codeLength: code.length });
      
      await confirmSignUp({
        username: email,
        confirmationCode: code
      });
      
      console.log('Confirmation successful, attempting auto sign-in');
      
      try {
        await autoSignIn();
        console.log('Auto sign-in successful');
        
        const currentUser = await getCurrentUser();
        console.log('Current user after auto sign-in:', currentUser);
        
        const attributes = await fetchUserAttributes();
        console.log('User attributes after auto sign-in:', attributes);
        
        const userData = {
          id: currentUser.userId,
          email: attributes.email || email,
          name: attributes.name || email.split('@')[0],
          isOnboarded: false // Default value instead of using custom attribute
        };
        
        setUser(userData);
        logger.logAuthSuccess('Confirm Sign Up', userData);
      } catch (autoSignInError: any) {
        // If it's an identity pool error, still consider the login successful
        if (autoSignInError.message && autoSignInError.message.includes('Invalid identity pool configuration')) {
          console.log('Identity pool error, but user is authenticated');
          
          try {
            const currentUser = await getCurrentUser();
            const attributes = await fetchUserAttributes();
            
            setUser({
              id: currentUser.userId,
              email: attributes.email || email,
              name: attributes.name || email.split('@')[0],
              isOnboarded: false
            });
            
            return true;
          } catch (e) {
            logger.logAuthError('Get User After Identity Pool Error', e);
          }
        }
        
        logger.logAuthError('Auto Sign In', autoSignInError);
        setError('Account confirmed but automatic sign-in failed. Please sign in manually.');
      }
      
      setConfirmationRequired(null);
      return true;
    } catch (error: any) {
      logger.logAuthError('Confirm Sign Up', error);
      
      // Set user-friendly error messages
      if (error.message && error.message.includes('Invalid verification code')) {
        setError('The verification code you entered is incorrect. Please try again.');
      } else if (error.message && error.message.includes('expired')) {
        setError('The verification code has expired. Please request a new code.');
      } else {
        setError(error.message || 'Failed to confirm sign up');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const completeNewPasswordChallenge = async (newPassword: string): Promise<boolean> => {
    if (!passwordChangeRequired) {
      setError('No password change in progress');
      return false;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      logger.logAuthAttempt('Complete Password Challenge', { email: passwordChangeRequired.email });
      
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse: newPassword
      });
      
      if (isSignedIn) {
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        
        setUser({
          id: currentUser.userId,
          email: attributes.email || passwordChangeRequired.email,
          name: attributes.name || passwordChangeRequired.email.split('@')[0],
          isOnboarded: false
        });
        
        setPasswordChangeRequired(null);
        return true;
      } else {
        setError('Failed to complete password change');
        return false;
      }
    } catch (error: any) {
      logger.logAuthError('Complete Password Challenge', error);
      
      // Set user-friendly error messages
      if (error.message && error.message.includes('Password not long enough')) {
        setError('New password must be at least 8 characters long.');
      } else if (error.message && error.message.includes('password policy')) {
        setError('New password must include uppercase, lowercase, numbers, and special characters.');
      } else {
        setError(error.message || 'Failed to change password');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      console.log('Signing out');
      await amplifySignOut();
      setUser(null);
      console.log('Sign out successful');
      logger.logAuthSuccess('Sign Out', {});
    } catch (error) {
      logger.logAuthError('Sign Out', error);
      setError('Failed to sign out');
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  const clearError = () => {
    setError('');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      confirmationRequired,
      passwordChangeRequired,
      signIn,
      signUp,
      signOut,
      confirmSignUpWithCode,
      completeNewPasswordChallenge,
      updateUser,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};