import React, { createContext, useContext, useState, useEffect } from 'react';
import { signIn as amplifySignIn, signUp as amplifySignUp, signOut as amplifySignOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

interface User {
  id: string;
  email: string;
  name?: string;
  isOnboarded?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
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

  useEffect(() => {
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

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      await amplifySignUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
            'custom:isOnboarded': 'false'
          },
          autoSignIn: true
        }
      });
      
      // Auto sign in will happen, so we need to get the user
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      const userData = {
        id: currentUser.userId,
        email: attributes.email || '',
        name: attributes.name,
        isOnboarded: false
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Error signing up:', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
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

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};