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
          { name: "Generate Course", href: "/hub/generate", icon: "robot", color: "bg-purple-500" },
          { name: "System Analytics", href: "/hub/analytics", icon: "chart", color: "bg-green-500" }
        ]
      };
    } else if (isInstructor) {
      return {
        title: "Instructor Dashboard",
        subtitle: "Create and manage your courses",
        description: "Welcome to your instructor dashboard. Create engaging courses, track student progress, and manage your teaching content.",
        quickActions: [
          { name: "Create Course", href: "/hub/generate", icon: "plus", color: "bg-green-500" },
          { name: "My Courses", href: "/hub/instructor/courses", icon: "book", color: "bg-blue-500" },
          { name: "My Analytics", href: "/hub/instructor/analytics", icon: "chart", color: "bg-purple-500" }
        ]
      };
    } else {
      return {
        title: "Student Dashboard",
        subtitle: "Track your learning journey",
        description: "Welcome to your learning dashboard. Continue your courses, track your progress, and discover new learning opportunities.",
        quickActions: [
          { name: "My Learning", href: "/hub/student/learning", icon: "graduation-cap", color: "bg-purple-500" },
          { name: "Enrolled Courses", href: "/hub/student/learning", icon: "book-open", color: "bg-blue-500" },
          { name: "Browse Courses", href: "/marketplace", icon: "book", color: "bg-green-500" }
        ]
      };
    }
  };

  const content = getWelcomeContent();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'robot':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'plus':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'book':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'book-open':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'graduation-cap':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
        );
    }
  };

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
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
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
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mr-4`}>
                <span className="text-white">{getIcon(action.icon)}</span>
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
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
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
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
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
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
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