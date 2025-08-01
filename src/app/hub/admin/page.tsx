'use client';

import { useRoleAccess } from '../../hooks/useRoleAccess';
import { dataStore } from '../../lib/dataStore';
import { useEffect, useState } from 'react';

export default function HubAdmin() {
  const { isAdmin } = useRoleAccess();
  const [stats, setStats] = useState(dataStore.getStats());

  // Refresh stats when component mounts
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
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your course platform, users, and system settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Course Management
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Total Courses</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active courses on platform</p>
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Published</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Publicly available</p>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.publishedCourses}</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Draft</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">In development</p>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{stats.draftCourses}</div>
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            User Statistics
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Total Users</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">All registered users</p>
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.totalUsers}</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Students</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active learners</p>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.students}</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Instructors</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Course creators</p>
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.instructors}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <div className="text-blue-600 text-lg mb-2">👥</div>
            <h3 className="font-medium text-gray-900 dark:text-white">Manage Users</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">View and edit user roles</p>
          </button>
          <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-left hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <div className="text-green-600 text-lg mb-2">📊</div>
            <h3 className="font-medium text-gray-900 dark:text-white">View Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Platform performance metrics</p>
          </button>
          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <div className="text-purple-600 text-lg mb-2">⚙️</div>
            <h3 className="font-medium text-gray-900 dark:text-white">System Settings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Configure platform options</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Total enrollments: {stats.totalEnrollments} students
            </span>
            <span className="ml-auto text-xs text-gray-500">Live</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {stats.publishedCourses} courses currently published
            </span>
            <span className="ml-auto text-xs text-gray-500">Live</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Platform active with {stats.totalUsers} registered users
            </span>
            <span className="ml-auto text-xs text-gray-500">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
} 