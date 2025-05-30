
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name?: string;
  isOnboarded?: boolean;
}

interface WelcomeBannerProps {
  user: User;
}

const WelcomeBanner = ({ user }: WelcomeBannerProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl animate-fade-in">
      <CardContent className="p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Sparkles className="w-8 h-8 mr-3" />
              {getGreeting()}, {user.name || 'there'}!
            </h1>
            <p className="text-blue-100 text-lg mb-4">
              Welcome to your DataFlow dashboard. Ready to transform some data?
            </p>
            <div className="flex items-center space-x-4 text-sm text-blue-200">
              <span>• Secure cloud storage</span>
              <span>• Instant data processing</span>
              <span>• Real-time insights</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/30 rounded-xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeBanner;
