import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Shield, Zap, Users, ArrowRight, Check } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Cloud,
      title: 'Secure Cloud Storage',
      description: 'Store your files safely in the cloud with enterprise-grade security'
    },
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'Your files are encrypted and only accessible by you'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Upload and access your files instantly from anywhere'
    },
    {
      icon: Users,
      title: 'Easy Sharing',
      description: 'Share files and folders with friends and colleagues effortlessly'
    }
  ];

  const benefits = [
    '15GB of free storage',
    'Access from any device',
    'Automatic sync',
    'File version history',
    'Offline access',
    '24/7 support'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 bg-gradient-to-r from-google-blue to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Cloud className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Your files,{' '}
              <span className="bg-gradient-to-r from-google-blue to-blue-600 bg-clip-text text-transparent">
                everywhere
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
              Store, sync, and share your files securely in the cloud. Access your documents, photos, and videos from any device, anywhere in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-google-blue to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-white text-google-blue font-semibold rounded-lg shadow-lg border-2 border-google-blue hover:bg-blue-50 transform hover:scale-105 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need in the cloud
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to keep your files safe, accessible, and organized
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-google-blue to-blue-600 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-google-blue to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why choose our cloud storage?
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Join millions of users who trust us with their most important files. Experience the freedom of having your data accessible anywhere, anytime.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center text-white">
                    <Check className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-google-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Cloud className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Start Today
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get 15GB of free storage and experience the power of cloud computing
                  </p>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-google-blue to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                  >
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="h-12 w-12 bg-gradient-to-r from-google-blue to-blue-600 rounded-full flex items-center justify-center">
                <Cloud className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Google Drive Clone</h3>
            <p className="text-gray-400 mb-6">
              Secure, fast, and reliable cloud storage for everyone
            </p>
            <div className="flex justify-center space-x-6">
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                Register
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-gray-400 text-sm">
              © 2024 Google Drive Clone. Built with ❤️ for secure file storage.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;