import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle, Users, FileUp, Download, MessageSquare, TrendingUp, Activity, Database, Search } from 'lucide-react';
import { Analytics } from '../utils/analytics';

const AnalyticsDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if analytics is configured
  const appId = import.meta.env.VITE_END_USER_MESSAGING_APP_ID || 
                import.meta.env.VITE_PINPOINT_APP_ID || 
                '';
  const isConfigured = appId && appId !== '';
  
  // Service name for display
  const serviceName = import.meta.env.VITE_END_USER_MESSAGING_APP_ID 
    ? 'AWS End User Messaging' 
    : 'Amazon Pinpoint';

  // Enhanced mock data for demonstration
  const mockAnalyticsData = [
    { name: 'Page Views', count: 145, icon: Activity },
    { name: 'File Uploads', count: 28, icon: FileUp },
    { name: 'Data Exports', count: 15, icon: Download },
    { name: 'Chat Messages', count: 67, icon: MessageSquare },
    { name: 'User Signups', count: 12, icon: Users },
    { name: 'Dashboard Visits', count: 89, icon: Database },
  ];

  const userEngagementData = [
    { day: 'Mon', users: 24, sessions: 45 },
    { day: 'Tue', users: 32, sessions: 58 },
    { day: 'Wed', users: 28, sessions: 52 },
    { day: 'Thu', users: 35, sessions: 67 },
    { day: 'Fri', users: 42, sessions: 78 },
    { day: 'Sat', users: 18, sessions: 32 },
    { day: 'Sun', users: 15, sessions: 28 },
  ];

  const fileTypeData = [
    { name: 'CSV', value: 65, color: '#3b82f6' },
    { name: 'Excel', value: 25, color: '#10b981' },
    { name: 'JSON', value: 8, color: '#f59e0b' },
    { name: 'Other', value: 2, color: '#ef4444' },
  ];

  const featureUsageData = [
    { feature: 'Data Viewer', usage: 85 },
    { feature: 'File Upload', usage: 73 },
    { feature: 'Chat Interface', usage: 62 },
    { feature: 'Export Data', usage: 45 },
    { feature: 'Search/Filter', usage: 38 },
  ];

  const handleTestEvent = async () => {
    setIsLoading(true);
    try {
      await Analytics.trackEvent('start_trial', {
        planType: 'premium',
        screenName: 'analytics_dashboard',
      });
      console.log('Test event sent to analytics');
    } catch (error) {
      console.error('Error sending test event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your application performance and user engagement</p>
        </div>
        <Button onClick={handleTestEvent} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Test Event'}
        </Button>
      </div>

      {/* Configuration Status */}
      <Alert variant={isConfigured ? "default" : "destructive"}>
        {isConfigured ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <AlertDescription>
          {isConfigured 
            ? `Analytics is properly configured and connected to ${serviceName}`
            : "Analytics is running in demo mode. Configure AWS End User Messaging App ID to enable real tracking."
          }
        </AlertDescription>
      </Alert>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Processed</CardTitle>
            <FileUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+23% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Exports</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">428</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8m 24s</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Distribution</CardTitle>
                <CardDescription>Events tracked in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockAnalyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement Trend</CardTitle>
                <CardDescription>Daily active users and sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="sessions" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Weekly user engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Metrics</CardTitle>
                <CardDescription>Key user statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>New Users This Week</span>
                  <span className="font-bold text-green-600">+24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Returning Users</span>
                  <span className="font-bold">132</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>User Retention Rate</span>
                  <span className="font-bold text-blue-600">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Session Duration</span>
                  <span className="font-bold">8m 24s</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage</CardTitle>
              <CardDescription>How users interact with different features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureUsageData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{item.feature}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.usage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{item.usage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>File Types Distribution</CardTitle>
                <CardDescription>Types of files uploaded by users</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fileTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {fileTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {fileTypeData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>File Processing Stats</CardTitle>
                <CardDescription>File upload and processing metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Files Uploaded</span>
                  <span className="font-bold">2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Successfully Processed</span>
                  <span className="font-bold text-green-600">2,798 (98.3%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Processing Errors</span>
                  <span className="font-bold text-red-600">49 (1.7%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average File Size</span>
                  <span className="font-bold">2.4 MB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Data Processed</span>
                  <span className="font-bold">6.8 GB</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>How to complete your analytics setup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Configure AWS End User Messaging</h4>
            <p className="text-sm text-gray-600">
              Go to AWS Console → AWS End User Messaging → Create a new project and get your App ID
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">2. Set Environment Variable</h4>
            <p className="text-sm text-gray-600">
              Create a .env file and add: VITE_END_USER_MESSAGING_APP_ID=your_actual_app_id
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">3. View Real-time Events</h4>
            <p className="text-sm text-gray-600">
              Events will appear in AWS End User Messaging Console → Analytics → Events
            </p>
          </div>
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-amber-600">Legacy Support Note</h4>
            <p className="text-sm text-gray-600">
              For backward compatibility, this system also supports Amazon Pinpoint via the VITE_PINPOINT_APP_ID environment variable, 
              but AWS End User Messaging is recommended as Pinpoint is being deprecated.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;