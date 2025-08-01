'use client';

import { useRoleAccess } from '../../../hooks/useRoleAccess';
import { dataStore } from '../../../lib/dataStore';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function StudentLearning() {
  const { isStudent } = useRoleAccess();
  const { user } = useUser();
  const [userStats, setUserStats] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      // Get user stats and enrollments
      const stats = dataStore.getUserStats(user.id);
      const userEnrollments = dataStore.getEnrollmentsByUserId(user.id);
      
      // Get course details for each enrollment
      const enrollmentDetails = userEnrollments.map(enrollment => {
        const course = dataStore.getCourseById(enrollment.courseId);
        return {
          ...enrollment,
          course: course
        };
      });

      setUserStats(stats);
      setEnrollments(enrollmentDetails);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Learning Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning progress and continue your courses.
        </p>
      </div>

      {/* Current Courses */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Continue Learning
        </h2>
        {enrollments.length > 0 ? (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {enrollment.course?.title || 'Unknown Course'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Progress: {enrollment.completedLessons} of {enrollment.totalLessons} lessons
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{enrollment.progress}%</div>
                  <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${enrollment.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
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

      {/* Learning Stats */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.totalCourses}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Enrolled Courses</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.completedLessons}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Lessons Completed</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.averageProgress}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Progress</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 