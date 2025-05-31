import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import FileUpload from '../components/FileUpload';
import DataViewer from '../components/DataViewer';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth page if not logged in
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Center the upload section */}
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-2xl font-bold mb-6">Welcome, {user.name || user.email}</h1>
          <FileUpload />
        </div>
        
        {/* Data viewer below */}
        <div className="max-w-6xl mx-auto">
          <DataViewer />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;