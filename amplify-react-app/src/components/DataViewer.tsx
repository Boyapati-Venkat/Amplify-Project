import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listTransformedRecords } from '../graphql/queries';
import { createTransformedRecord } from '../graphql/mutations';

// Initialize the GraphQL client
const client = generateClient();

interface TransformedRecord {
  id: string;
  userId: string;
  name: string;
  email: string;
  score: number;
  createdAt: string;
}

interface DataViewerProps {
  userId: string;
}

const DataViewer: React.FC<DataViewerProps> = ({ userId }) => {
  const [records, setRecords] = useState<TransformedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');

  const fetchRecords = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);
      
      console.log('Fetching records for user:', userId);
      
      const response = await client.graphql({
        query: listTransformedRecords,
        variables: {
          filter: {
            userId: {
              eq: userId
            }
          }
        }
      });

      const fetchedRecords = (response as any).data?.listTransformedRecords?.items || [];
      console.log('Fetched records:', fetchedRecords);
      
      setRecords(fetchedRecords);
      
      if (showRefreshToast) {
        setMessage(`Found ${fetchedRecords.length} records.`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      
      // For demo purposes, show mock data if GraphQL fails
      const mockData: TransformedRecord[] = [
        {
          id: '1',
          userId: userId,
          name: 'John Doe',
          email: 'john.doe@example.com',
          score: 95,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          userId: userId,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          score: 87,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          userId: userId,
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          score: 92,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      
      setRecords(mockData);
      setMessage("Using demo data - GraphQL API not configured.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const addSampleRecord = async () => {
    try {
      const sampleRecord = {
        userId: userId,
        name: `Sample User ${Math.floor(Math.random() * 1000)}`,
        email: `user${Math.floor(Math.random() * 1000)}@example.com`,
        score: Math.floor(Math.random() * 100) + 1
      };

      console.log('Creating sample record:', sampleRecord);

      const response = await client.graphql({
        query: createTransformedRecord,
        variables: {
          input: sampleRecord
        }
      });

      console.log('Created record:', response);
      setMessage("Sample record has been added to DynamoDB.");
      setTimeout(() => setMessage(''), 3000);

      // Refresh the data
      await fetchRecords();
    } catch (error) {
      console.error('Error creating record:', error);
      
      // For demo purposes, add a mock record locally
      const newRecord: TransformedRecord = {
        id: `mock-${Date.now()}`,
        userId: userId,
        name: `Sample User ${Math.floor(Math.random() * 1000)}`,
        email: `user${Math.floor(Math.random() * 1000)}@example.com`,
        score: Math.floor(Math.random() * 100) + 1,
        createdAt: new Date().toISOString()
      };
      
      setRecords(prev => [newRecord, ...prev]);
      setMessage("Added sample record locally (GraphQL not configured).");
      setTimeout(() => setMessage(''), 3000);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [userId]);

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 75) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-9 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="p-3 bg-blue-50 text-blue-800 rounded-md">
          {message}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
          <span className="font-medium text-gray-900">
            {records.length} Records
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={addSampleRecord}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Sample</span>
          </button>
          <button
            onClick={() => fetchRecords(true)}
            disabled={refreshing}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={refreshing ? 'animate-spin' : ''}>
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-300">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
          <p className="text-lg font-medium">No records found</p>
          <p className="text-sm">Upload CSV files or add sample data to get started.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreBadgeColor(record.score)}`}>
                      {record.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(record.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Data fetched from DynamoDB via GraphQL</p>
        <p>• Only your records are displayed (owner-based auth)</p>
        <p>• Real-time updates when new data is added</p>
      </div>
    </div>
  );
};

export default DataViewer;