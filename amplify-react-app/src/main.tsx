import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports.ts';

// Configure Amplify
Amplify.configure(awsExports);

createRoot(document.getElementById("root")!).render(<App />);