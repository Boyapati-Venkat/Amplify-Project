
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signIn as amplifySignIn, 
  signUp as amplifySignUp, 
  signOut as amplifySignOut, 
  confirmSignUp,
  autoSignIn,
  getCurrentUser, 
  fetchUserAttributes 
} from 'aws-amplify/auth';

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

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string;
  confirmationRequired: ConfirmationData | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; requiresConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  confirmSignUpWithCode: (email: string, code: string) => Promise<boolean>;
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
        const attributes = await fetchUserAttributes();
        
        setUser({
          id: currentUser.userId,
          email: attributes.email || '',
          name: attributes.name,
          isOnboarded: attributes['custom:isOnboarded'] === 'true'
        });
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
      console.log('Signing in with:', email);
      const result = await amplifySignIn({
        username: email,
        password
      });
      
      console.log('Sign in result:', result);
      
      if (result.isSignedIn) {
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        
        setUser({
          id: currentUser.userId,
          email: attributes.email || email,
          name: attributes.name || email.split('@')[0],
          isOnboarded: attributes['custom:isOnboarded'] === 'true'
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message || 'Failed to sign in');
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
      console.log('Signing up with:', email);
      const { isSignUpComplete, userId, nextStep } = await amplifySignUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name
          }
        }
      });
      
      console.log('Sign up result:', { isSignUpComplete, nextStep });
      
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        // Handle confirmation code flow
        setConfirmationRequired({
          email,
          password,
          name
        });
        return { success: true, requiresConfirmation: true };
      }
      
      return { success: true, requiresConfirmation: false };
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || 'Failed to sign up');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSignUpWithCode = async (email: string, code: string): Promise<boolean> => {
    setIsLoading(true);
    setError('');
    
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code
      });
      
      // Try auto sign-in after confirmation
      try {
        await autoSignIn();
        // Check if user is signed in
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        
        setUser({
          id: currentUser.userId,
          email: attributes.email || email,
          name: attributes.name || email.split('@')[0],
          isOnboarded: attributes['custom:isOnboarded'] === 'true'
        });
      } catch (autoSignInError) {
        console.log('Auto sign-in failed, user needs to sign in manually');
      }
      
      setConfirmationRequired(null);
      return true;
    } catch (error: any) {
      console.error('Confirmation error:', error);
      setError(error.message || 'Failed to confirm sign up');
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
      await amplifySignOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // Note: To persist these changes to Cognito, you would need to use Auth.updateUserAttributes
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
      signIn,
      signUp,
      signOut,
      confirmSignUpWithCode,
      updateUser,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};
