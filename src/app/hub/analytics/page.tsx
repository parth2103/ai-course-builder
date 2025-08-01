'use client';

import { useRoleAccess } from '../../hooks/useRoleAccess';
import { dataStore } from '../../lib/dataStore';
import { useEffect, useState } from 'react';

export default function Analytics() {
  const { isAdmin } = useRoleAccess();
  const [stats, setStats] = useState(dataStore.getStats());

  useEffect(() => {
    setStats(dataStore.getStats());
  }, []);

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This section is only available for administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Platform Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor platform performance and user engagement metrics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Courses</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalEnrollments}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Enrollments</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.publishedCourses}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Published Courses</div>
          </div>
        </div>
      </div>

      {/* User Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          User Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.students}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.instructors}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Instructors</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.totalUsers - stats.students - stats.instructors}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Admins</div>
          </div>
        </div>
      </div>

      {/* Course Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Course Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.publishedCourses}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.draftCourses}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Draft</div>
          </div>
        </div>
      </div>

      {/* Platform Health */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Platform Health
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900 dark:text-white">System Status</span>
            </div>
            <span className="text-sm font-medium text-green-600">Operational</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900 dark:text-white">Database</span>
            </div>
            <span className="text-sm font-medium text-blue-600">Connected</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900 dark:text-white">AI Services</span>
            </div>
            <span className="text-sm font-medium text-purple-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
} 