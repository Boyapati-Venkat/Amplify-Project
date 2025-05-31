
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import ChatInterface from '../components/ChatInterface';

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
      
      <main className="flex-1 flex">
        <div className="w-full">
          <ChatInterface userId={user.id} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
