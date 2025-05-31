
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Analytics } from '../utils/analytics';

interface AnalyticsButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const AnalyticsButton = ({ 
  variant = 'outline', 
  size = 'lg', 
  className = '', 
  showIcon = true,
  children = 'View Analytics',
  onMouseEnter,
  onMouseLeave
}: AnalyticsButtonProps) => {
  const navigate = useNavigate();

  const handleAnalyticsClick = async () => {
    await Analytics.trackNavigationClick('analytics_from_landing');
    navigate('/analytics');
  };

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleAnalyticsClick}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showIcon && <BarChart3 className="mr-2 w-5 h-5" />}
      {children}
    </Button>
  );
};

export default AnalyticsButton;
