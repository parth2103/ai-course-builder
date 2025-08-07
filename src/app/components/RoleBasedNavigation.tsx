'use client';

import Link from 'next/link';
import { useRoleAccess } from '../hooks/useRoleAccess';

export default function RoleBasedNavigation() {
  const { userRole, permissions, isAdmin, isInstructor, isStudent } = useRoleAccess();

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {/* Course Viewing - Available to all */}
          <Link 
            href="/"
            className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Browse Courses
          </Link>

          {/* Admin Navigation */}
          {isAdmin && (
            <>
              <Link 
                href="/admin"
                className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Admin Dashboard
              </Link>
              <Link 
                href="/admin/users"
                className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Manage Users
              </Link>
              <Link 
                href="/admin/analytics"
                className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Analytics
              </Link>
            </>
          )}

          {/* Instructor Navigation */}
          {isInstructor && (
            <>
              <Link 
                href="/instructor/dashboard"
                className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              >
                My Courses
              </Link>
              <Link 
                href="/hub/generate"
                className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Create Course
              </Link>
              <Link 
                href="/instructor/analytics"
                className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              >
                My Analytics
              </Link>
            </>
          )}

          {/* Student Navigation */}
          {isStudent && (
            <>
              <Link 
                href="/hub/student/learning"
                className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              >
                My Learning
              </Link>
              <Link 
                href="/hub/student/learning"
                className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Enrolled Courses
              </Link>
              <Link 
                href="/student/progress"
                className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              >
                My Progress
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 