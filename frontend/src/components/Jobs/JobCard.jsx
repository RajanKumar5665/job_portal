import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Briefcase, Building2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const JobCard = ({ job }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                </h3>
                <p className="text-sm text-gray-600">{job.company?.name}</p>
              </div>
            </div>

            <p className="text-gray-700 text-sm mb-4 line-clamp-2">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.requirements?.slice(0, 3).map((requirement, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {requirement}
                </span>
              ))}
              {job.requirements?.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  +{job.requirements.length - 3} more
                </span>
              )}
            </div>

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

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {job.jobType}
            </span>
            <Link
              to={`/jobs/${job._id}`}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
