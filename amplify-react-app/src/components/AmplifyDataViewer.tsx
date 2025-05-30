import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import awsExports from '../aws-exports';

// Define GraphQL queries
const listTransformedRecords = /* GraphQL */ `
  query ListTransformedRecords(
    $filter: ModelTransformedRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransformedRecords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        name
        email
        score
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;

const createTransformedRecord = /* GraphQL */ `
  mutation CreateTransformedRecord(
    $input: CreateTransformedRecordInput!
    $condition: ModelTransformedRecordConditionInput
  ) {
    createTransformedRecord(input: $input, condition: $condition) {
      id
      userId
      name
      email
      score
      createdAt
      updatedAt
      owner
    }
  }
`;

// Initialize the GraphQL client
const client = generateClient();

interface TransformedRecord {
  id: string;
  userId: string;
  name: string;
  email: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  owner: string;
}

interface AmplifyDataViewerProps {
  userId: string;
}

const AmplifyDataViewer: React.FC<AmplifyDataViewerProps> = ({ userId }) => {
  const [records, setRecords] = useState<TransformedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [userId]);

  async function fetchRecords() {
    try {
      setLoading(true);
      setMessage('');
      
      console.log('Fetching records for user:', userId);
      
      try {
        // First try with API_KEY
        const response = await client.graphql({
          query: listTransformedRecords,
          variables: {
            filter: {
              userId: { eq: userId }
            }
          },
          authMode: 'API_KEY'
        });
        
        const items = response.data.listTransformedRecords.items;
        console.log('Fetched records with API_KEY:', items);
        setRecords(items);
      } catch (apiKeyError) {
        console.error('API_KEY auth failed, trying AMAZON_COGNITO_USER_POOLS:', apiKeyError);
        
        // Fall back to Cognito auth
        const response = await client.graphql({
          query: listTransformedRecords,
          variables: {
            filter: {
              userId: { eq: userId }
            }
          }
          // Default authMode is AMAZON_COGNITO_USER_POOLS
        });
        
        const items = response.data.listTransformedRecords.items;
        console.log('Fetched records with AMAZON_COGNITO_USER_POOLS:', items);
        setRecords(items);
      }
      
      const fetchedRecords = response.data.listTransformedRecords.items;
      if (fetchedRecords.length === 0) {
        setMessage('No records found. Try adding a sample record.');
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setMessage('Error fetching records. Check console for details.');
    } finally {
      setLoading(false);
    }
  }

  async function addSampleRecord() {
    try {
      setCreating(true);
      setMessage('');
      
      const newRecord = {
        userId: userId,
        name: `Sample User ${Math.floor(Math.random() * 100)}`,
        email: `user${Math.floor(Math.random() * 100)}@example.com`,
        score: Math.floor(Math.random() * 100) + 1
      };
      
      console.log('Creating sample record:', newRecord);
      
      const response = await client.graphql({
        query: createTransformedRecord,
        variables: { 
          input: newRecord
        }
      });
      
      console.log('Created record:', response.data.createTransformedRecord);
      setMessage('Sample record added successfully!');
      
      // Refresh the list
      fetchRecords();
    } catch (error) {
      console.error('Error creating record:', error);
      setMessage('Error creating record. Check console for details.');
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div>
        <h2>Your Records</h2>
        <p>Loading records...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Your Records</h2>
        <div>
          <button 
            onClick={addSampleRecord}
            disabled={creating}
            style={{ 
              marginRight: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: creating ? '#cccccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: creating ? 'default' : 'pointer'
            }}
          >
            {creating ? 'Adding...' : 'Add Sample'}
          </button>
          <button 
            onClick={fetchRecords}
            disabled={loading}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: loading ? '#cccccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'default' : 'pointer'
            }}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {message && (
        <div style={{ 
          padding: '0.75rem',
          marginBottom: '1rem',
          backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
          color: message.includes('Error') ? '#721c24' : '#155724',
          borderRadius: '0.25rem'
        }}>
          {message}
        </div>
      )}
      
      {records.length === 0 ? (
        <p>No records found. Click "Add Sample" to create one.</p>
      ) : (
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          border: '1px solid #ddd'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Score</th>
              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px' }}>{record.name}</td>
                <td style={{ padding: '8px' }}>{record.email}</td>
                <td style={{ padding: '8px' }}>{record.score}</td>
                <td style={{ padding: '8px' }}>{new Date(record.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AmplifyDataViewer;