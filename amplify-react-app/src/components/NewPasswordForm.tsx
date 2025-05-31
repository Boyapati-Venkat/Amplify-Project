import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AuthBanner from './AuthBanner';

const NewPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  // Banner state
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [showBanner, setShowBanner] = useState(false);
  
  const { completeNewPasswordChallenge, passwordChangeRequired, error, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Display banner function
  const displayBanner = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setBannerMessage(message);
    setBannerType(type);
    setShowBanner(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match');
      displayBanner('Passwords do not match', 'error');
      return;
    }
    
    if (newPassword.length < 8) {
      setLocalError('Password must be at least 8 characters');
      displayBanner('Password must be at least 8 characters', 'error');
      return;
    }
    
    setLocalError('');
    const success = await completeNewPasswordChallenge(newPassword);
    
    if (success) {
      displayBanner('Password changed successfully!', 'success');
    } else if (error) {
      displayBanner(error, 'error');
    }
  };
  
  return (
    <>
      <AuthBanner 
        message={bannerMessage}
        type={bannerType}
        visible={showBanner}
        onClose={() => setShowBanner(false)}
      />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Change Your Password</CardTitle>
          <CardDescription>
            You need to set a new password to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(error || localError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || localError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default NewPasswordForm;