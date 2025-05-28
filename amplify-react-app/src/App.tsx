import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import FileUpload from './components/FileUpload';
import DataViewer from './components/DataViewer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Database, User, LogOut } from 'lucide-react';

const App = () => {
  return (
    <Authenticator hideSignUp={false}>
      {({ signOut, user }) => (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <Toaster />
          <Sonner />
          
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      AWS Amplify Dashboard
                    </h1>
                    <p className="text-sm text-gray-500">
                      Full-stack data management platform
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Welcome, {user?.username || 'User'}
                    </span>
                  </div>
                  <Button 
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* File Upload Section */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Upload className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        File Upload
                      </CardTitle>
                      <CardDescription>
                        Upload CSV files to your private S3 bucket
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <FileUpload userId={user?.username || ''} />
                </CardContent>
              </Card>

              {/* Data Viewer Section */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Database className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        Your Records
                      </CardTitle>
                      <CardDescription>
                        View data from DynamoDB via GraphQL
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <DataViewer userId={user?.username || ''} />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      )}
    </Authenticator>
  );
};

export default App;