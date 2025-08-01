'use client';

import { useRoleAccess } from '../../../hooks/useRoleAccess';

export default function StudentProgress() {
  const { isStudent } = useRoleAccess();

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

  const progressData = [
    {
      course: 'JavaScript Fundamentals',
      completed: 18,
      total: 24,
      percentage: 75,
      lastActivity: '2 days ago',
      averageScore: 88
    },
    {
      course: 'React Development',
      completed: 10,
      total: 32,
      percentage: 30,
      lastActivity: '1 week ago',
      averageScore: 92
    },
    {
      course: 'Python for Data Science',
      completed: 13,
      total: 28,
      percentage: 45,
      lastActivity: '3 days ago',
      averageScore: 85
    }
  ];

  const overallStats = {
    totalCourses: 3,
    totalLessons: 84,
    completedLessons: 41,
    averageScore: 88,
    studyStreak: 5
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning journey and achievements.
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{overallStats.totalCourses}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Enrolled Courses</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{overallStats.completedLessons}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Lessons Completed</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{overallStats.averageScore}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{overallStats.studyStreak}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Course Progress
        </h2>
        <div className="space-y-4">
          {progressData.map((course, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {course.course}
                </h3>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {course.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${course.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{course.completed} of {course.total} lessons completed</span>
                <span>Avg Score: {course.averageScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Achievements
        </h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">🏆</span>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Course Completed</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">JavaScript Fundamentals - 2 days ago</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">⭐</span>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Perfect Score</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">React Quiz - 1 week ago</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">🔥</span>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">5-Day Streak</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Consistent learning - 3 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 