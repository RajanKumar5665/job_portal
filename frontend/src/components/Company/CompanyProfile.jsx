import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Edit, 
  Save, 
  X,
  Loader2,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

const CompanyProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    website: '',
  });

  // Fetch user's companies
  const { data: companies, isLoading } = useQuery(
    'userCompanies',
    async () => {
      const response = await api.get('/company/get');
      return response.data.companies;
    },
    {
      enabled: user?.role === 'recruiter',
    }
  );

  const createCompanyMutation = useMutation(
    async (companyData) => {
      const response = await api.post('/company/register', companyData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries('userCompanies');
        setIsCreating(false);
        setFormData({ name: '', description: '', location: '', website: '' });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create company');
      },
    }
  );

  const updateCompanyMutation = useMutation(
    async ({ companyId, companyData }) => {
      const response = await api.put(`/company/update/${companyId}`, companyData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries('userCompanies');
        setIsEditing(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update company');
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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }
    createCompanyMutation.mutate({ CompanyName: formData.name });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const company = companies[0]; // Assuming single company for now
    updateCompanyMutation.mutate({
      companyId: company._id,
      companyData: formData,
    });
  };

  const startEditing = () => {
    if (companies && companies.length > 0) {
      const company = companies[0];
      setFormData({
        name: company.name || '',
        description: company.description || '',
        location: company.location || '',
        website: company.website || '',
      });
    }
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormData({ name: '', description: '', location: '', website: '' });
  };

  if (user?.role !== 'recruiter') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Access denied. Only recruiters can manage companies.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading company information...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Profile</h1>
        <p className="text-gray-600">Manage your company information and settings.</p>
      </div>

      {!companies || companies.length === 0 ? (
        // Create Company Form
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Create Your Company Profile
            </h2>
            <p className="text-gray-600">
              Set up your company profile to start posting jobs and attracting talent.
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your company name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createCompanyMutation.isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createCompanyMutation.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Company'
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Company Profile Display/Edit
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {companies[0].logo ? (
                  <img
                    src={companies[0].logo}
                    alt={companies[0].name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {companies[0].name}
                  </h2>
                  <p className="text-gray-600">Company Profile</p>
                </div>
              </div>
              <button
                onClick={startEditing}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              // Edit Form
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Mumbai, India"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="h-4 w-4 inline mr-1" />
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.company.com"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your company..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateCompanyMutation.isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateCompanyMutation.isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // Display Mode
              <div className="space-y-6">
                {companies[0].description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About Us</h3>
                    <p className="text-gray-700">{companies[0].description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {companies[0].location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3" />
                      <span>{companies[0].location}</span>
                    </div>
                  )}

                  {companies[0].website && (
                    <div className="flex items-center text-gray-600">
                      <Globe className="h-5 w-5 mr-3" />
                      <a
                        href={companies[0].website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {companies[0].website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Company Statistics</h3>
                      <p className="text-gray-600">Track your company's performance</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {companies[0].jobs?.length || 0}
                      </p>
                      <p className="text-sm text-gray-600">Jobs Posted</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
