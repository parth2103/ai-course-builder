'use client';

import { useRoleAccess } from '../hooks/useRoleAccess';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface Stats {
  totalCourses: number;
  students: number;
  instructors: number;
  totalEnrollments: number;
  totalUsers: number;
  publishedCourses: number;
}

export default function CourseHub() {
  const { isAdmin, isInstructor, isStudent, userRole } = useRoleAccess();
  const { user } = useUser();
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    students: 0,
    instructors: 0,
    totalEnrollments: 0,
    totalUsers: 0,
    publishedCourses: 0
  });
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user-specific data from database
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch platform stats (for admin)
      if (isAdmin) {
        const statsResponse = await fetch('/api/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      }

      // Fetch user enrollments (for students)
      if (isStudent) {
        const enrollmentsResponse = await fetch(`/api/enrollments/user/${user?.id}`);
        if (enrollmentsResponse.ok) {
          const enrollmentsData = await enrollmentsResponse.json();
          setUserEnrollments(enrollmentsData.enrollments || []);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWelcomeContent = () => {
    if (isAdmin) {
      return {
        title: "Admin Dashboard",
        subtitle: "Manage your course platform",
        description: "Welcome to the admin dashboard. You have full control over the platform, including user management, course oversight, and system analytics.",
        quickActions: [
          { name: "Generate Course", href: "/hub/generate", icon: "🤖", color: "bg-purple-500" },
      
          { name: "System Analytics", href: "/hub/analytics", icon: "📊", color: "bg-green-500" }
        ]
      };
    } else if (isInstructor) {
      return {
        title: "Instructor Dashboard",
        subtitle: "Create and manage your courses",
        description: "Welcome to your instructor dashboard. Create engaging courses, track student progress, and manage your teaching content.",
        quickActions: [
          { name: "Create Course", href: "/hub/generate", icon: "➕", color: "bg-green-500" },
          { name: "My Courses", href: "/hub/instructor/courses", icon: "📖", color: "bg-blue-500" },
          { name: "My Analytics", href: "/hub/instructor/analytics", icon: "📈", color: "bg-purple-500" }
        ]
      };
    } else {
      return {
        title: "Student Dashboard",
        subtitle: "Track your learning journey",
        description: "Welcome to your learning dashboard. Continue your courses, track your progress, and discover new learning opportunities.",
        quickActions: [
          { name: "My Learning", href: "/hub/student/learning", icon: "🎓", color: "bg-purple-500" },
          { name: "Enrolled Courses", href: "/hub/student/learning", icon: "📋", color: "bg-blue-500" },
          { name: "Browse Courses", href: "/marketplace", icon: "📚", color: "bg-green-500" }
        ]
      };
    }
  };

  const content = getWelcomeContent();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {content.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              {content.subtitle}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl">
              {content.description}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {userRole?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.quickActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mr-4`}>
                <span className="text-white text-xl">{action.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Access {action.name.toLowerCase()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Role-Specific Content */}
      {isAdmin && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            System Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Courses</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.students}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Students</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.instructors}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Instructors</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.totalEnrollments}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Enrollments</div>
            </div>
          </div>
        </div>
      )}

      {isInstructor && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats.totalEnrollments} total student enrollments across all courses
              </span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats.publishedCourses} courses currently published on platform
              </span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Platform serving {stats.totalUsers} registered users
              </span>
            </div>
          </div>
        </div>
      )}

      {isStudent && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Continue Learning
          </h2>
          {userEnrollments.length > 0 ? (
            <div className="space-y-4">
              {userEnrollments.slice(0, 2).map((enrollment: any) => (
                <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {enrollment.course?.title || 'Course'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Progress: {enrollment.progress || 0}%
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{enrollment.progress || 0}%</div>
                    <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${enrollment.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't enrolled in any courses yet.
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 