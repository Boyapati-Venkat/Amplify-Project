import React, { useState } from 'react';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    try {
      const filename = `uploads/${Date.now()}-${file.name}`;
      
      // Create S3 client
      const s3Client = new S3Client({
        region: 'us-east-1',
        credentials: {
          // Use your IAM user credentials or create a public access role
          accessKeyId: 'YOUR_ACCESS_KEY',
          secretAccessKey: 'YOUR_SECRET_KEY'
        }
      });
      
      // Upload file directly
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: 'migrationplan-bucket',
          Key: filename,
          Body: file,
          ContentType: file.type
        }
      });
      
      console.log('Starting direct upload...');
      const result = await upload.done();
      console.log('Upload completed:', result);
      
      setMessage('✅ Upload successful');
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`❌ Upload failed: ${error.message}`);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <input type="file" onChange={handleChange} />
      <button
        onClick={handleUpload}
        style={{
          marginLeft: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#27ae60',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Upload CSV
      </button>
      <p>{message}</p>
    </div>
  );
};

export default FileUpload;
