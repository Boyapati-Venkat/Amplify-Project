
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Database, Upload, TrendingUp, Shield, Zap, Users } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: Upload,
      title: 'Easy CSV Upload',
      description: 'Drag and drop your CSV files with secure cloud storage'
    },
    {
      icon: Database,
      title: 'Smart Data Processing',
      description: 'Automatic data transformation and validation'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Instant insights and visualizations from your data'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with user-specific data isolation'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process thousands of records in seconds'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share insights and work together on data projects'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">DataFlow</span>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/auth')}
          className="border-blue-200 hover:bg-blue-50"
        >
          Sign In
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Transform Your Data Into{' '}
            <span className="gradient-text">Actionable Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload, process, and analyze your CSV data with enterprise-grade security and lightning-fast performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Get Started Free
              <ArrowRight className={`ml-2 w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-300 hover:bg-gray-50 px-8 py-3 text-lg rounded-xl"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to work with data
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From upload to insights, we've got you covered with powerful features and enterprise-grade security.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your data workflow?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust DataFlow for their data processing needs.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-50 border-t">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">DataFlow</span>
          </div>
          <p>&copy; 2024 DataFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
