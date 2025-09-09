import React from 'react';
import JobList from '../components/Jobs/JobList';

const Jobs = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
        <p className="text-gray-600">Discover your next career opportunity from our curated list of jobs.</p>
      </div>
      <JobList />
    </div>
  );
};

export default Jobs;
