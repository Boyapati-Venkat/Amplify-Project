import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import WelcomeBanner from '../components/WelcomeBanner';
import AmplifyFileUpload from '../components/AmplifyFileUpload';
import AmplifyDataViewer from '../components/AmplifyDataViewer';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth page if not logged in
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <WelcomeBanner name={user.name || 'User'} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* File Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">File Upload</h2>
            <AmplifyFileUpload userId={user.id} />
          </div>
          
          {/* Data Viewer Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <AmplifyDataViewer userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;