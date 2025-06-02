
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Analytics } from '../../analytics/utils/analytics';
import Navigation from '../../components/Navigation';
import ChatInterface from '../../components/ChatInterface';
import PaginatedDataViewer from '../pagination/PaginatedDataViewer';
import FriendlyUploadFeedback from '../upload-feedback/FriendlyUploadFeedback';
import AmplifyFileUpload from '../../components/AmplifyFileUpload';
import AmplifyDataViewer from '../../components/AmplifyDataViewer';

interface TransformedRecord {
  id: string;
  name: string;
  email: string;
  score: number;
  createdAt: string;
}

const EnhancedDashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState<TransformedRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  // Track dashboard visit
  useEffect(() => {
    if (user?.email) {
      Analytics.trackDashboardVisit(user.email);
    }
  }, [user]);

  // Mock data loading - replace with actual data fetching
  useEffect(() => {
    const mockData: TransformedRecord[] = [
      // Generate more mock data for pagination testing
      ...Array.from({ length: 25 }, (_, i) => ({
        id: `${i + 1}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        score: Math.floor(Math.random() * 100) + 1,
        createdAt: new Date(Date.now() - i * 86400000).toISOString()
      }))
    ];
    setRecords(mockData);
  }, [refreshTrigger]);

  const handleUploadStart = () => {
    setIsUploading(true);
  };

  const handleUploadComplete = () => {
    setIsUploading(false);
    // Trigger data refresh
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDataRefresh = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshTrigger(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Redirecting to login...</h2>
          <div className="animate-pulse bg-gray-200 h-4 w-48 mx-auto rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Your Data</h2>
              <AmplifyFileUpload userId={user.id} />
              <div className="mt-4">
                <button
                  onClick={handleUploadStart}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Simulate Upload
                </button>
              </div>
            </div>
            
            {/* Upload Feedback */}
            <FriendlyUploadFeedback
              isUploading={isUploading}
              onUploadComplete={handleUploadComplete}
            />
          </div>

          {/* Chat Interface */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
            <div className="h-96 overflow-hidden">
              <ChatInterface userId={user.id} />
            </div>
          </div>
        </div>

        {/* Enhanced Data Viewer with Pagination */}
        <div className="space-y-6">
          <PaginatedDataViewer
            records={records}
            onRefresh={handleDataRefresh}
          />
          
          {/* Original Amplify Data Viewer for comparison */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Original Data Viewer (for comparison)</h2>
            <AmplifyDataViewer userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnhancedDashboard;
