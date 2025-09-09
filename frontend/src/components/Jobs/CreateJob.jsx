import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Users, 
  FileText,
  Building2,
  Loader2,
  Zap 
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreateJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    skills: '',
    description: '',
    requirements: '',
    salary: '',
    experienceLevel: '0',
    location: '',
    jobType: 'Full-time',
    position: '1',
    companyId: '',
  });

  // Fetch user's companies
  const { data: companies } = useQuery(
    'userCompanies',
    async () => {
      const response = await api.get('/company/get');
      return response.data.companies;
    },
    {
      enabled: user?.role === 'recruiter',
    }
  );

  const createJobMutation = useMutation(
    async (jobData) => {
      const response = await api.post('/job/create', jobData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data.message);
        navigate('/my-jobs');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create job');
      },
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.companyId) {
      toast.error('Please select a company');
      return;
    }

    createJobMutation.mutate(formData);
  };

  if (user?.role !== 'recruiter') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Access denied. Only recruiters can create jobs.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Job</h1>
        <p className="text-gray-600">Post a new job opportunity for job seekers.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Selection */}
          <div>
            <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="h-4 w-4 inline mr-1" />
              Company *
            </label>
            <select
              id="companyId"
              name="companyId"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.companyId}
              onChange={handleChange}
            >
              <option value="">Select a company</option>
              {companies?.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
            {!companies || companies.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                No companies found. <a href="/company" className="text-blue-600 hover:text-blue-700">Create a company</a> first.
              </p>
            )}
          </div>

          {/* Job Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="h-4 w-4 inline mr-1" />
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Senior Software Engineer"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Job Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Job Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Requirements */}
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="List key requirements separated by commas (e.g., React, Node.js, 3+ years experience)"
              value={formData.requirements}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate multiple requirements with commas
            </p>
          </div>
          
          {/* Skills - Added missing field */}
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
              <Zap className="h-4 w-4 inline mr-1" />
              Required Skills *
            </label>
            <textarea
              id="skills"
              name="skills"
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="List required skills separated by commas (e.g., JavaScript, React, Node.js, MongoDB)"
              value={formData.skills}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate multiple skills with commas
            </p>
          </div>

          {/* Location and Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Mumbai, India"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Salary (₹) *
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 500000"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Experience Level and Job Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level *
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="0">Fresher (0 years)</option>
                <option value="1">0-1 years</option>
                <option value="2">1-3 years</option>
                <option value="3">3-5 years</option>
                <option value="4">5-10 years</option>
                <option value="5">10+ years</option>
              </select>
            </div>

            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                id="jobType"
                name="jobType"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          {/* Number of Positions */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="h-4 w-4 inline mr-1" />
              Number of Positions *
            </label>
            <input
              type="number"
              id="position"
              name="position"
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 2"
              value={formData.position}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/my-jobs')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createJobMutation.isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createJobMutation.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
