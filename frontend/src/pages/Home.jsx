import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Briefcase, 
  Users, 
  Building2, 
  TrendingUp,
  Search,
  MapPin,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Briefcase className="h-8 w-8 text-blue-600" />,
      title: "Find Your Dream Job",
      description: "Browse thousands of job opportunities from top companies worldwide."
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Connect with Recruiters",
      description: "Build meaningful connections with industry professionals and hiring managers."
    },
    {
      icon: <Building2 className="h-8 w-8 text-purple-600" />,
      title: "Company Profiles",
      description: "Discover company cultures, benefits, and work environments before applying."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "Career Growth",
      description: "Access resources and opportunities to advance your career and skills."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Jobs" },
    { number: "5,000+", label: "Companies" },
    { number: "50,000+", label: "Job Seekers" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">HireHub</span>
              <div className="mt-2 text-2xl md:text-3xl font-semibold text-gray-800">Find Your Next Career Opportunity</div>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with top companies and discover job opportunities that match your skills and aspirations. 
              Join thousands of professionals who have found their dream jobs through our platform.
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 text-lg font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Browse Jobs
                </Link>
                {user.role === 'recruiter' && (
                  <Link
                    to="/create-job"
                    className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 text-lg font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Briefcase className="mr-2 h-5 w-5" />
                    Post a Job
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to advance your career or find the perfect candidate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of professionals and take the next step in your career journey.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 border border-blue-300 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/jobs"
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Search className="mr-2 h-5 w-5" />
                Find Jobs
              </Link>
              {user.role === 'recruiter' && (
                <Link
                  to="/create-job"
                  className="inline-flex items-center px-8 py-3 border border-blue-300 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Post a Job
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                For Job Seekers
              </h2>
              <div className="space-y-4">
                {[
                  "Access to exclusive job opportunities",
                  "Personalized job recommendations",
                  "Direct communication with recruiters",
                  "Career development resources"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                For Recruiters
              </h2>
              <div className="space-y-4">
                {[
                  "Post unlimited job listings",
                  "Access to qualified candidates",
                  "Advanced applicant tracking",
                  "Company profile management"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
