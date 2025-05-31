import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type BannerType = 'success' | 'error' | 'warning' | 'info';

interface AuthBannerProps {
  message: string;
  type: BannerType;
  visible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

const AuthBanner: React.FC<AuthBannerProps> = ({
  message,
  type,
  visible,
  onClose,
  autoClose = true,
  autoCloseTime = 5000
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-100 border-green-500 text-green-800',
    error: 'bg-red-100 border-red-500 text-red-800',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    info: 'bg-blue-100 border-blue-500 text-blue-800'
  }[type];

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50 px-4`}>
      <div className={`${bgColor} border-l-4 p-4 rounded shadow-md flex justify-between items-center`}>
        <p className="font-medium">{message}</p>
        <button 
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default AuthBanner;