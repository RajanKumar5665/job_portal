import React from 'react';
import { useQuery } from 'react-query';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Clock as PendingIcon,
  Building2,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const MyApplications = () => {
  const { user } = useAuth();

  const { data: applications, isLoading, error } = useQuery(
    'myApplications',
    async () => {
      const response = await api.get('/application/get');
      return response.data.data;
    },
    {
      enabled: user?.role === 'student',
    }
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <PendingIcon className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatSalary = (salary) => {
    if (salary >= 1000000) {
      return `₹${(salary / 1000000).toFixed(1)}M`;
    } else if (salary >= 1000) {
      return `₹${(salary / 1000).toFixed(1)}K`;
    }
    return `₹${salary}`;
  };

  if (user?.role !== 'student') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Access denied. Only students can view applications.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading your applications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading applications. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track the status of your job applications.</p>
      </div>

      {!applications || applications.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-6">
            Start applying to jobs to see your applications here.
          </p>
          <a
            href="/jobs"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Browse Jobs
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Application Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <PendingIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'accepted').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {application.job?.company?.logo ? (
                        <img
                          src={application.job.company.logo}
                          alt={application.job.company.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {application.job?.title}
                        </h3>
                        <p className="text-gray-600 mb-2">{application.job?.company?.name}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {application.job?.location}
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {formatSalary(application.job?.salary)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                          </div>
                        </div>

                        <p className="text-gray-700 text-sm line-clamp-2">
                          {application.job?.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(application.status)}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                      
                      {application.status === 'accepted' && (
                        <div className="text-right">
                          <p className="text-sm text-green-600 font-medium">Congratulations!</p>
                          <p className="text-xs text-gray-600">You got the job</p>
                        </div>
                      )}
                      
                      {application.status === 'rejected' && (
                        <div className="text-right">
                          <p className="text-sm text-red-600 font-medium">Not selected</p>
                          <p className="text-xs text-gray-600">Keep applying!</p>
                        </div>
                      )}
                      
                      {application.status === 'pending' && (
                        <div className="text-right">
                          <p className="text-sm text-yellow-600 font-medium">Under Review</p>
                          <p className="text-xs text-gray-600">We'll update you soon</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
