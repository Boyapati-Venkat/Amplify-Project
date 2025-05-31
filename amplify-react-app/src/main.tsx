
import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from 'aws-amplify';
import App from "./App.tsx";
import "./index.css";
import awsExports from './aws-exports.js';

// Only configure Amplify in browser environment
if (typeof window !== 'undefined') {
  Amplify.configure(awsExports);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
