import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Building2, 
  Users,
  Calendar,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showApplicants, setShowApplicants] = useState(false);

  const { data: job, isLoading, error } = useQuery(
    ['job', id],
    async () => {
      const response = await api.get(`/job/get/${id}`);
      return response.data.job;
    },
    {
      enabled: !!id,
    }
  );

  const applyJobMutation = useMutation(
    async () => {
      const response = await api.post(`/application/apply/${id}`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(['job', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to apply for job');
      },
    }
  );

  const updateStatusMutation = useMutation(
    async ({ applicationId, status }) => {
      const response = await api.post(`/application/status/${applicationId}/update`, {
        status,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(['job', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update status');
      },
    }
  );

  const formatSalary = (salary) => {
    if (salary >= 1000000) {
      return `₹${(salary / 1000000).toFixed(1)}M`;
    } else if (salary >= 1000) {
      return `₹${(salary / 1000).toFixed(1)}K`;
    }
    return `₹${salary}`;
  };

  const getExperienceText = (level) => {
    if (level === 0) return 'Fresher';
    if (level === 1) return '0-1 years';
    if (level === 2) return '1-3 years';
    if (level === 3) return '3-5 years';
    if (level === 4) return '5-10 years';
    return '10+ years';
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

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    applyJobMutation.mutate();
  };

  const handleStatusUpdate = (applicationId, status) => {
    updateStatusMutation.mutate({ applicationId, status });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading job details...</span>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Job not found or error loading job details.</p>
        <button
          onClick={() => navigate('/jobs')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  const isJobCreator = user?.role === 'recruiter' && job.created_by === user._id;
  const hasApplied = Array.isArray(job.applications)
    ? job.applications.some(app => {
        const applicantId = typeof app.applicant === 'string' ? app.applicant : app.applicant?._id;
        return applicantId === user?._id;
      })
    : false;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ) : (
                <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <p className="text-lg text-gray-600 mb-2">{job.company?.name}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {formatSalary(job.salary)}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {getExperienceText(job.experienceLevel)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {job.jobType}
              </span>
              <p className="text-sm text-gray-600 mt-2">
                {job.position} position{job.position > 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Job Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="text-gray-700">{requirement}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Company Information */}
          {job.company && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About {job.company.name}</h2>
              {job.company.description && (
                <p className="text-gray-700 mb-4">{job.company.description}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.company.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.company.location}
                  </div>
                )}
                {job.company.website && (
                  <div className="flex items-center text-gray-600">
                    <Building2 className="h-4 w-4 mr-2" />
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {job.company.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Applications Section for Job Creator */}
          {isJobCreator && job.applications && job.applications.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Applications ({job.applications.length})
                </h2>
                <button
                  onClick={() => setShowApplicants(!showApplicants)}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Users className="h-4 w-4 mr-1" />
                  {showApplicants ? 'Hide' : 'View'} Applicants
                </button>
              </div>

              {showApplicants && (
                <div className="space-y-4">
                  {job.applications.map((application) => (
                    <div
                      key={application._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium text-gray-900">
                            {application.applicant?.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {application.applicant?.email}
                          </p>
                          {application.applicant?.phoneNumber && (
                            <p className="text-sm text-gray-600">
                              {application.applicant.phoneNumber}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                          </p>

                          {application.applicant?.profile?.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {application.applicant.profile.skills.map((skill, idx) => (
                                <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {application.applicant?.profile?.resume && (
                            <div className="pt-2">
                              <a
                                href={application.applicant.profile.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-sm"
                              >
                                {application.applicant.profile.resumeOriginalName || 'View Resume'}
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {application.status}
                          </span>
                          {application.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusUpdate(application._id, 'accepted')}
                                className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <Calendar className="h-4 w-4 inline mr-1" />
              Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </div>
            <div className="flex space-x-3">
              {user?.role === 'student' && !hasApplied && (
                <button
                  onClick={handleApply}
                  disabled={applyJobMutation.isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applyJobMutation.isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Applying...
                    </>
                  ) : (
                    'Apply Now'
                  )}
                </button>
              )}
              {user?.role === 'student' && hasApplied && (
                <span className="px-6 py-2 bg-green-100 text-green-700 rounded-md">
                  Applied
                </span>
              )}
              {!user && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Login to Apply
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
