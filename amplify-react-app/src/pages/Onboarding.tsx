
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Home, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Onboarding = () => {
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [migrationGoals, setMigrationGoals] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Update user with onboarding data
      updateUser({
        isOnboarded: true
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to MAIT!</CardTitle>
            <CardDescription>
              Let's set up your profile to provide you with personalized migration assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleComplete} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Enter your organization name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Data Engineer, IT Manager, Business Analyst"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goals">Migration Goals</Label>
                <Textarea
                  id="goals"
                  value={migrationGoals}
                  onChange={(e) => setMigrationGoals(e.target.value)}
                  placeholder="Describe your migration objectives and any specific challenges you're facing..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Setting up your profile...' : 'Complete Setup'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
