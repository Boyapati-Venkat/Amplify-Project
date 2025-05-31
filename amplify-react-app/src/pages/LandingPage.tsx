import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Upload, TrendingUp, Shield, Zap, Users, Home, FileSearch, Brain, GitBranch, DollarSign, CheckCircle, Download } from 'lucide-react';
import Logo from '../components/Logo';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: FileSearch,
      title: 'CSV-Based Discovery',
      description: 'Upload your on-prem inventory for analysis.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Assessment',
      description: 'Get intelligent insights based on workload, size, and usage patterns.'
    },
    {
      icon: GitBranch,
      title: 'Migration Strategy Generation',
      description: 'Automatically generate a 6-hour cloud migration plan.'
    },
    {
      icon: DollarSign,
      title: 'Cost and Risk Estimation',
      description: 'Estimate migration effort, downtime risk, and cost implications.'
    },
    {
      icon: CheckCircle,
      title: 'Cloud Compatibility Validation',
      description: 'Validate each on-prem server for AWS/GCP/Azure compatibility.'
    },
    {
      icon: Download,
      title: 'Downloadable Migration Blueprint',
      description: 'Export a migration-ready plan to share with your team.'
    }
  ];

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleHomeClick}
          className="hover:bg-gray-100"
        >
          <Home className="h-5 w-5" />
        </Button>
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
            <span className="gradient-text">Migration Assistance Tool (MAIT)</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload, analyze, and migrate your data with enterprise-grade security and expert guidance from PwC.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Get Started
              <ArrowRight className={`ml-2 w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/migration-strategy')}
              className="border-gray-300 hover:bg-gray-50 px-8 py-3 text-lg rounded-xl"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for successful migrations
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From data analysis to migration execution, we've got you covered with powerful tools and expert guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            Ready to accelerate your migration?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join organizations worldwide who trust PwC for their critical migration projects.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Your Migration
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-50 border-t">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Home className="h-5 w-5" />
          </div>
          <p>&copy; 2024 PwC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;