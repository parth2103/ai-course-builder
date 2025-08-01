'use client';

import { useRoleAccess } from '../../../hooks/useRoleAccess';
import { dataStore } from '../../../lib/dataStore';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function StudentEnrolled() {
  const { isStudent } = useRoleAccess();
  const { user } = useUser();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      
      // For now, use the mock student user ID directly
      // In production, this would be handled by the database
      const mockUserId = 'user_student'; // This matches our mock data
      
      // Get user enrollments with course details
      const userEnrollments = dataStore.getEnrollmentsByUserId(mockUserId);
      
      const enrollmentDetails = userEnrollments.map(enrollment => {
        const course = dataStore.getCourseById(enrollment.courseId);
        return {
          ...enrollment,
          course: course
        };
      });

      setEnrollments(enrollmentDetails);
      setLoading(false);
    }
  }, [user]);

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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading your enrolled courses...</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Enrolled Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Continue learning from where you left off.
        </p>
      </div>

      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {enrollment.course?.title || 'Unknown Course'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Instructor: {enrollment.course?.instructor || 'Unknown'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {enrollment.progress}%
                  </div>
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress:</span>
                  <span className="text-gray-900 dark:text-white">
                    {enrollment.completedLessons} of {enrollment.totalLessons} lessons
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Last accessed:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(enrollment.lastAccessed)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Enrolled:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(enrollment.enrolledAt)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="text-gray-400 text-4xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No courses enrolled yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start your learning journey by enrolling in courses from the marketplace.
          </p>
          <a 
            href="/marketplace" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Browse Courses
          </a>
        </div>
      )}
    </div>
  );
} 