import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports.js';

// Configure Amplify with explicit Storage configuration
Amplify.configure({
  ...awsExports,
  Storage: {
    region: awsExports.aws_user_files_s3_bucket_region,
    bucket: awsExports.aws_user_files_s3_bucket,
  }
});

createRoot(document.getElementById("root")!).render(<App />);