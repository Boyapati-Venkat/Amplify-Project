import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, ArrowUpCircle, Settings, ShoppingCart, Code, Trash2, Clock } from 'lucide-react';

const MigrationStrategy = () => {
  const navigate = useNavigate();

  const strategies = [
    {
      id: 'rehost',
      title: 'Rehost',
      subtitle: 'Lift and Shift',
      description: 'Move servers and applications to the cloud without changing the architecture. Ideal for quick wins when time or resources are limited.',
      icon: <ArrowUpCircle className="h-8 w-8 text-blue-500" />
    },
    {
      id: 'replatform',
      title: 'Replatform',
      subtitle: 'Lift, Tinker, and Shift',
      description: 'Make minimal optimizations during migration, such as switching to managed databases or scalable storage, without rewriting the app.',
      icon: <Settings className="h-8 w-8 text-green-500" />
    },
    {
      id: 'repurchase',
      title: 'Repurchase',
      subtitle: 'Drop and Shop',
      description: 'Replace the existing system with a cloud-native SaaS alternative (e.g., moving from on-prem CRM to Salesforce or Dynamics 365).',
      icon: <ShoppingCart className="h-8 w-8 text-purple-500" />
    },
    {
      id: 'refactor',
      title: 'Refactor / Re-architect',
      subtitle: '',
      description: 'Redesign applications to take full advantage of cloud-native capabilities (e.g., microservices, serverless). Best for long-term flexibility and scalability.',
      icon: <Code className="h-8 w-8 text-orange-500" />
    },
    {
      id: 'retire',
      title: 'Retire',
      subtitle: '',
      description: 'Identify and decommission applications that are obsolete, unused, or redundant before migration.',
      icon: <Trash2 className="h-8 w-8 text-red-500" />
    },
    {
      id: 'retain',
      title: 'Retain',
      subtitle: '',
      description: 'Keep some workloads on-premises temporarily or permanently, especially for compliance, latency, or integration reasons.',
      icon: <Clock className="h-8 w-8 text-gray-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">The 6 Rs of Cloud Migration</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Understand the six proven strategies used to modernize and migrate on-premises infrastructure to the cloud.
          </p>
        </div>

        {/* Strategy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {strategies.map((strategy) => (
            <Card key={strategy.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  {strategy.icon}
                  <div>
                    <CardTitle className="text-xl">{strategy.title}</CardTitle>
                    {strategy.subtitle && (
                      <CardDescription>{strategy.subtitle}</CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{strategy.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-2">Ready to begin your migration?</h2>
          <p className="text-gray-600 mb-6">
            Upload your CSV file to receive a personalized migration recommendation based on the 6 Rs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrationStrategy;