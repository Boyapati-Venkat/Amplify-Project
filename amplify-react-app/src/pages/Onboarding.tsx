import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database, User, Upload, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    displayName: '',
    company: '',
    role: ''
  });
  
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    updateUser({ 
      isOnboarded: true,
      name: profileData.displayName || user?.name 
    });
    
    toast({
      title: "Welcome to DataFlow!",
      description: "Your account is now set up and ready to use.",
    });
    
    navigate('/dashboard');
  };

  const steps = [
    {
      title: "Welcome to DataFlow",
      description: "Let's get your profile set up",
      icon: User
    },
    {
      title: "Learn the Basics",
      description: "Quick tutorial on uploading files",
      icon: Upload
    },
    {
      title: "You're All Set!",
      description: "Ready to start transforming data",
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">DataFlow</span>
          </div>
          
          <div className="mb-6">
            <Progress value={progress} className="h-2 bg-gray-200" />
            <p className="text-sm text-gray-600 mt-2">Step {currentStep} of {totalSteps}</p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {React.createElement(steps[currentStep - 1].icon, { className: "w-8 h-8 text-white" })}
            </div>
            <CardTitle className="text-2xl font-bold">{steps[currentStep - 1].title}</CardTitle>
            <CardDescription className="text-gray-600">
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="How should we call you?"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Your company name"
                    value={profileData.company}
                    onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role (Optional)</Label>
                  <Input
                    id="role"
                    type="text"
                    placeholder="Your role or title"
                    value={profileData.role}
                    onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">How to upload CSV files:</h3>
                  <ol className="text-blue-800 space-y-2 list-decimal list-inside">
                    <li>Navigate to the Upload section in your dashboard</li>
                    <li>Drag and drop your CSV file or click to browse</li>
                    <li>Wait for the file to upload and process</li>
                    <li>View your transformed data in the Data Viewer</li>
                  </ol>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-purple-900 mb-3">Supported formats:</h3>
                  <ul className="text-purple-800 space-y-1">
                    <li>• CSV files up to 10MB</li>
                    <li>• UTF-8 encoded text</li>
                    <li>• Headers in the first row</li>
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Welcome aboard, {profileData.displayName || user?.name}!
                  </h3>
                  <p className="text-gray-600">
                    Your DataFlow account is ready. You can now upload CSV files, 
                    transform data, and generate insights.
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="font-medium">Upload Files</p>
                  </div>
                  <div className="text-center">
                    <Database className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="font-medium">Transform Data</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium">Get Insights</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center"
              >
                {currentStep === totalSteps ? 'Get Started' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
