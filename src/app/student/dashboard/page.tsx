'use client';

import { useRoleAccess } from '../../hooks/useRoleAccess';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useState } from 'react';
import Image from 'next/image';

// Mock data for student courses
const enrolledCourses = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    progress: 75,
    lastAccessed: '2024-01-15',
    instructor: 'John Doe',
    nextLesson: 'Functions and Scope'
  },
  {
    id: '2', 
    title: 'React Development',
    progress: 30,
    lastAccessed: '2024-01-10',
    instructor: 'Jane Smith',
    nextLesson: 'State Management'
  }
];

const recommendedCourses = [
  {
    id: '3',
    title: 'Python for Data Science',
    difficulty: 'intermediate',
    duration: 15,
    rating: 4.8,
    students: 1234
  },
  {
    id: '4',
    title: 'UI/UX Design Principles',
    difficulty: 'beginner', 
    duration: 10,
    rating: 4.7,
    students: 567
  }
];

export default function StudentDashboard() {
  const { isStudent } = useRoleAccess();
  const [activeTab, setActiveTab] = useState<'learning' | 'recommended'>('learning');

  if (!isStudent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This dashboard is only available for students.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Image
                      src="/images/logos/learnify-logo-black.svg"
                      alt="Learnify Logo"
                      width={160}
                      height={50}
                      className="dark:hidden w-32 h-10 md:w-[160px] md:h-[50px]"
                    />
                    <Image
                      src="/images/logos/learnify-logo-white.svg"
                      alt="Learnify Logo"
                      width={160}
                      height={50}
                      className="hidden dark:block w-32 h-10 md:w-[160px] md:h-[50px]"
                    />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Student Dashboard</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Track your learning progress</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Navigation */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('learning')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'learning'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📖 My Learning
                </button>
                <button
                  onClick={() => setActiveTab('recommended')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'recommended'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🎯 Recommended Courses
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'learning' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Enrolled Courses</h2>
                  
                  {enrolledCourses.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No enrolled courses yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Start your learning journey by enrolling in a course
                      </p>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Browse Courses
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {enrolledCourses.map((course) => (
                        <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                          <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                              Instructor: {course.instructor}
                            </p>
                            
                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                              <div>Last accessed: {course.lastAccessed}</div>
                              <div>Next lesson: {course.nextLesson}</div>
                            </div>
                            
                            <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                              Continue Learning
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'recommended' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recommended for You</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedCourses.map((course) => (
                      <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {course.title}
                          </h3>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <span>⭐ {course.rating}</span>
                            <span>⏱️ {course.duration}h</span>
                            <span>👥 {course.students}</span>
                          </div>
                          
                          <div className="mb-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.difficulty === 'beginner' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : course.difficulty === 'intermediate'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {course.difficulty}
                            </span>
                          </div>
                          
                          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
} 