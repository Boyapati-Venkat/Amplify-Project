
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Upload, Loader2 } from 'lucide-react';

interface UploadMessage {
  text: string;
  duration: number;
}

interface FriendlyUploadFeedbackProps {
  isUploading: boolean;
  onUploadComplete?: () => void;
  className?: string;
}

const uploadMessages: UploadMessage[] = [
  { text: "Hang on…", duration: 1500 },
  { text: "Buckle up your belt — we're transforming your data", duration: 2500 },
  { text: "Still transforming…", duration: 2000 },
  { text: "Almost there…", duration: 1500 },
  { text: "All done! Here's your transformed data", duration: 2000 }
];

const FriendlyUploadFeedback = ({ isUploading, onUploadComplete, className = "" }: FriendlyUploadFeedbackProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isUploading) {
      setCurrentMessageIndex(0);
      setProgress(0);
      setIsComplete(false);
      return;
    }

    let messageTimer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    // Start progress animation
    progressInterval = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (uploadMessages.length * 10);
        return Math.min(prev + increment, 95);
      });
    }, 100);

    // Message sequence
    const showNextMessage = (index: number) => {
      if (index < uploadMessages.length - 1) {
        messageTimer = setTimeout(() => {
          setCurrentMessageIndex(index + 1);
          showNextMessage(index + 1);
        }, uploadMessages[index].duration);
      } else {
        // Final message
        setTimeout(() => {
          setProgress(100);
          setIsComplete(true);
          setTimeout(() => {
            if (onUploadComplete) {
              onUploadComplete();
            }
          }, 1000);
        }, uploadMessages[index].duration);
      }
    };

    showNextMessage(0);

    return () => {
      if (messageTimer) clearTimeout(messageTimer);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isUploading, onUploadComplete]);

  if (!isUploading && !isComplete) {
    return null;
  }

  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {isComplete ? (
              <CheckCircle className="h-8 w-8 text-green-500 animate-scale-in" />
            ) : (
              <div className="relative">
                <Upload className="h-8 w-8 text-blue-500" />
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin absolute -top-1 -right-1" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">
                {isComplete ? (
                  <span className="text-green-700">Upload Complete!</span>
                ) : (
                  "Processing your data..."
                )}
              </h3>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(progress)}%
              </span>
            </div>
            
            <Progress value={progress} className="mb-3" />
            
            <p className="text-sm text-gray-600 animate-fade-in">
              {isComplete ? 
                "Your data has been successfully transformed and is now available in the table below." :
                uploadMessages[currentMessageIndex]?.text
              }
            </p>
          </div>
        </div>
        
        {isComplete && (
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsComplete(false)}
              className="animate-fade-in"
            >
              Dismiss
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendlyUploadFeedback;
