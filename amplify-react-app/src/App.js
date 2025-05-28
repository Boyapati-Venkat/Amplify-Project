import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import FileUpload from './components/FileUpload';
import DataViewer from './components/DataViewer';

function App() {
  return (
    <div className="App" style={{ textAlign: 'center', padding: '3rem' }}>
      <h1
        style={{
          fontSize: '2.5rem',
          color: '#2c3e50',
          marginBottom: '2rem',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
        }}
      >
        Welcome to Migration Assistance Tool (MAIT)
      </h1>
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <h2 style={{ color: '#34495e', fontSize: '1.5rem' }}>
              Hello {user.username}, welcome!
            </h2>

            <FileUpload />
            <DataViewer />

            <button
              onClick={signOut}
              style={{
                marginTop: '2rem',
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                backgroundColor: '#c0392b',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </main>
        )}
      </Authenticator>
    </div>
  );
}

export default App;