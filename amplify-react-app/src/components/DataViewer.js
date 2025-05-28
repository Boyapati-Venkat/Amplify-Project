import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listTransformedRecords } from '../graphql/queries';

const client = generateClient();

const DataViewer = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data } = await client.graphql({
          query: listTransformedRecords
        });
        setRecords(data.listTransformedRecords.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div style={{ marginTop: '3rem' }}>
      <h3>Transformed Data from DynamoDB</h3>
      <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Score</th><th>Created</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id}>
              <td>{record.name}</td>
              <td>{record.email}</td>
              <td>{record.score}</td>
              <td>{record.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataViewer;