'use client';

import { useRoleAccess } from '../../../hooks/useRoleAccess';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Enrollment {
  id: string;
  courseId: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  enrolledAt: string;
  lastAccessed: string;
  course?: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    duration: number;
    category: string;
  };
}

export default function StudentLearning() {
  const { isStudent } = useRoleAccess();
  const { user } = useUser();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalProgress: 0,
    completedLessons: 0,
    totalLessons: 0
  });

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`/api/enrollments/user/${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        const enrollmentsData = data.enrollments || [];
        setEnrollments(enrollmentsData);
        
        // Calculate stats
        const totalCourses = enrollmentsData.length;
        const totalProgress = enrollmentsData.reduce((sum: number, enrollment: Enrollment) => sum + enrollment.progress, 0);
        const completedLessons = enrollmentsData.reduce((sum: number, enrollment: Enrollment) => sum + enrollment.completedLessons, 0);
        const totalLessons = enrollmentsData.reduce((sum: number, enrollment: Enrollment) => sum + enrollment.totalLessons, 0);
        
        const calculatedStats = {
          totalCourses,
          totalProgress: totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0,
          completedLessons,
          totalLessons
        };
        
        setStats(calculatedStats);
      } else {
        console.error('Failed to fetch enrollments:', response.status);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (!isStudent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This section is only available for students.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Learning Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your learning progress and continue your courses
          </p>
        </div>
        <Link
          href="/marketplace"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse More Courses
        </Link>
      </div>

      {/* Stats Overview */}
      {enrollments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProgress}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lessons Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedLessons}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalLessons}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          My Enrolled Courses ({enrollments.length})
        </h2>
        
        {enrollments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses enrolled yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start your learning journey by enrolling in courses from our marketplace
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {enrollment.course?.title || 'Course Title'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {enrollment.course?.description || 'Course description'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {enrollment.progress}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Lessons Completed</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {enrollment.completedLessons} / {enrollment.totalLessons}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          enrollment.course?.difficulty || 'beginner'
                        )}`}
                      >
                        {enrollment.course?.difficulty || 'Beginner'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {enrollment.course?.duration || 0} hours
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <Link
                      href={`/hub/student/learning/${enrollment.courseId}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium text-center block"
                    >
                      Continue Learning
                    </Link>
                    <Link
                      href={`/course-details/${enrollment.courseId}`}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-center block"
                    >
                      View Details
                    </Link>
                  </div>

                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 