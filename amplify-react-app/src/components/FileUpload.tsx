import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import * as StorageModule from 'aws-amplify/storage';
import awsExports from '../aws-exports';

interface FileUploadProps {
  userId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ userId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        console.log('File selected:', selectedFile.name);
      } else {
        setMessage('Please select a CSV file.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a CSV file to upload.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setMessage('');

    try {
      console.log('Starting upload for user:', userId);
      
      // Generate unique filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `uploads/${userId}/${timestamp}_${file.name}`;
      
      console.log('Uploading to bucket:', awsExports.aws_user_files_s3_bucket);
      
      // Use uploadData from aws-amplify/storage
      const result = await StorageModule.uploadData({
        key: fileName,
        data: file,
        options: {
          accessLevel: 'private', // Explicitly set to private
          contentType: file.type,
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const percentage = Math.round((transferredBytes / totalBytes) * 100);
              setProgress(percentage);
              console.log(`Uploaded: ${transferredBytes}/${totalBytes} (${percentage}%)`);
            }
          },
        }
      });

      setProgress(100);
      console.log('Upload successful:', result);
      setMessage('✅ Upload successful!');

      // Reset form
      setTimeout(() => {
        setFile(null);
        const input = document.getElementById('file-input') as HTMLInputElement;
        if (input) input.value = '';
        setProgress(0);
      }, 2000);

    } catch (error: any) {
      console.error('Upload error:', error);
      setMessage(`❌ Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <div className="mx-auto mb-4 text-gray-400 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Choose a CSV file to upload to your S3 bucket
          </p>
          <input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="max-w-xs mx-auto"
            disabled={uploading}
          />
        </div>
      </div>

      {file && (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          {!uploading && (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          )}
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Uploading...</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {message && (
        <div className={`p-3 rounded-md ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <button 
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md shadow-sm flex items-center justify-center"
      >
        {uploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Uploading...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload to S3
          </>
        )}
      </button>

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Files are stored in your S3 bucket: {awsExports.aws_user_files_s3_bucket}</p>
        <p>• CSV files are automatically processed</p>
      </div>
    </div>
  );
};

export default FileUpload;