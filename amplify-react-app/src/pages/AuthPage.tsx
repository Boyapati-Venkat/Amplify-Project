import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import NewPasswordForm from '../components/NewPasswordForm';
import AuthBanner from '../components/AuthBanner';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [currentTab, setCurrentTab] = useState('signin');
  
  // Banner state
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [showBanner, setShowBanner] = useState(false);
  
  const { signIn, signUp, confirmSignUpWithCode, passwordChangeRequired, user, isLoading, error, clearError } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Display banner function
  const displayBanner = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setBannerMessage(message);
    setBannerType(type);
    setShowBanner(true);
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Clear error when switching tabs or changing inputs
  useEffect(() => {
    clearError();
  }, [currentTab, email, password, name, confirmationCode, clearError]);

  // Show error in banner if present
  useEffect(() => {
    if (error) {
      displayBanner(error, 'error');
    }
  }, [error]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Attempting sign in with:', email);
      const success = await signIn(email, password);
      
      if (success) {
        displayBanner('Welcome back!', 'success');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else if (error) {
        displayBanner(error, 'error');
      }
    } catch (err: any) {
      console.error('Sign in error in component:', err);
      
      // Display specific error messages
      let errorMessage = err.message || "An unexpected error occurred";
      
      if (errorMessage.includes("incorrect username or password")) {
        errorMessage = "Incorrect email or password. Please try again.";
      } else if (errorMessage.includes("User does not exist")) {
        errorMessage = "No user found with this email.";
      }
      
      displayBanner(errorMessage, 'error');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Attempting sign up with:', email);
      const { success, requiresConfirmation } = await signUp(email, password, name);
      
      if (success && requiresConfirmation) {
        displayBanner('Verification email sent. Please check your inbox.', 'info');
        setNeedsConfirmation(true);
      } else if (success) {
        displayBanner('Account created successfully!', 'success');
        setTimeout(() => navigate('/onboarding'), 1500);
      } else if (error) {
        displayBanner(error, 'error');
      }
    } catch (err: any) {
      console.error('Sign up error in component:', err);
      
      // Display specific error messages
      let errorMessage = err.message || "An unexpected error occurred";
      
      if (errorMessage.includes("Password not long enough")) {
        errorMessage = "Password must be at least 8 characters long.";
      } else if (errorMessage.includes("User already exists")) {
        errorMessage = "An account with this email already exists. Please sign in instead.";
      } else if (errorMessage.includes("password policy")) {
        errorMessage = "Password must include uppercase, lowercase, numbers, and special characters.";
      }
      
      displayBanner(errorMessage, 'error');
    }
  };

  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Attempting confirmation with code:', confirmationCode);
      const confirmed = await confirmSignUpWithCode(email, confirmationCode);
      
      if (confirmed) {
        displayBanner('Account verified successfully!', 'success');
        setTimeout(() => navigate('/onboarding'), 1500);
      } else if (error) {
        displayBanner(error, 'error');
      }
    } catch (err: any) {
      console.error('Confirmation error in component:', err);
      
      // Display specific error messages
      let errorMessage = err.message || "An unexpected error occurred";
      
      if (errorMessage.includes("Invalid verification code")) {
        errorMessage = "The verification code you entered is incorrect. Please try again.";
      } else if (errorMessage.includes("expired")) {
        errorMessage = "The verification code has expired. Please request a new code.";
      }
      
      displayBanner(errorMessage, 'error');
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const resetForm = () => {
    setNeedsConfirmation(false);
    setConfirmationCode('');
    clearError();
  };

  // Render password change form if needed
  if (passwordChangeRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <AuthBanner 
          message={bannerMessage}
          type={bannerType}
          visible={showBanner}
          onClose={() => setShowBanner(false)}
        />
        <nav className="px-6 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleHomeClick}
            className="hover:bg-gray-100"
          >
            <Home className="h-5 w-5" />
          </Button>
          <div></div>
        </nav>

        <div className="flex items-center justify-center px-6 py-12">
          <NewPasswordForm />
        </div>
      </div>
    );
  }

  // Render confirmation form if needed
  if (needsConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <AuthBanner 
          message={bannerMessage}
          type={bannerType}
          visible={showBanner}
          onClose={() => setShowBanner(false)}
        />
        {/* Navigation with Home Icon */}
        <nav className="px-6 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleHomeClick}
            className="hover:bg-gray-100"
          >
            <Home className="h-5 w-5" />
          </Button>
          <div></div>
        </nav>

        <div className="flex items-center justify-center px-6 py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Confirm Your Account</CardTitle>
              <CardDescription>
                Enter the confirmation code sent to {email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConfirmation} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="confirmation-code">Confirmation Code</Label>
                  <Input
                    id="confirmation-code"
                    type="text"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify Account'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={resetForm}
                >
                  Back to Sign Up
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AuthBanner 
        message={bannerMessage}
        type={bannerType}
        visible={showBanner}
        onClose={() => setShowBanner(false)}
      />
      {/* Navigation with Home Icon */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleHomeClick}
          className="hover:bg-gray-100"
        >
          <Home className="h-5 w-5" />
        </Button>
        <div></div>
      </nav>

      <div className="flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to MAIT</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;