import { createRoot } from "react-dom/client";
import { Amplify } from 'aws-amplify';
import App from "./App.tsx";
import "./index.css";
import awsExports from './aws-exports.js';

// Only configure Amplify in browser environment
if (typeof window !== 'undefined') {
  Amplify.configure({
    ...awsExports,
    Storage: {
      region: awsExports.aws_user_files_s3_bucket_region,
      bucket: awsExports.aws_user_files_s3_bucket,
    }
  });
}

// Set document title
if (typeof document !== 'undefined') {
  document.title = "Migration Tool (MAIT)";
}

createRoot(document.getElementById("root")!).render(<App />);