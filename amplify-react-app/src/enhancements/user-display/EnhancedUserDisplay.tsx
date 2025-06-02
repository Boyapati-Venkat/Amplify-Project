
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface EnhancedUserDisplayProps {
  onSignOut?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

const EnhancedUserDisplay = ({ onSignOut, onProfileClick, onSettingsClick }: EnhancedUserDisplayProps) => {
  const { user, signOut } = useAuth();
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    if (user) {
      setUserDisplayName(user.name || user.email?.split('@')[0] || 'User');
      setUserEmail(user.email || '');
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      if (onSignOut) {
        onSignOut();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!user) {
    return (
      <Button variant="outline" size="sm">
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="hidden md:flex flex-col items-end">
        <span className="text-sm font-medium text-gray-900">
          {userDisplayName}
        </span>
        <span className="text-xs text-gray-500">
          {userEmail}
        </span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                {getInitials(userDisplayName)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm" align="end" forceMount>
          <div className="md:hidden px-2 py-1.5 border-b">
            <p className="text-sm font-medium">{userDisplayName}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>
          <DropdownMenuItem 
            className="flex items-center cursor-pointer"
            onClick={onProfileClick}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center cursor-pointer"
            onClick={onSettingsClick}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleSignOut} 
            className="flex items-center text-red-600 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EnhancedUserDisplay;
