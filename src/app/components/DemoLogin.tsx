'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';

export default function DemoLogin() {
  const [showCredentials, setShowCredentials] = useState(false);
  const [showRoleOptions, setShowRoleOptions] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { signIn } = useSignIn();

  const demoAccounts = [
    {
      role: 'Student',
      email: 'demo.student@aicoursebuilder.com',
      password: 'DemoStudent123!',
      description: 'Browse and enroll in courses, track learning progress'
    },
    {
      role: 'Instructor',
      email: 'demo.instructor@aicoursebuilder.com',
      password: 'DemoInstructor123!',
      description: 'Create AI-powered courses, manage content, track students'
    },
    {
      role: 'Admin',
      email: 'demo.admin@aicoursebuilder.com',
      password: 'DemoAdmin123!',
      description: 'Manage all users and courses, view platform analytics'
    }
  ];

  const handleDemoLogin = async (role: string) => {
    setIsLoggingIn(true);
    setShowRoleOptions(false);
    
    try {
      const account = demoAccounts.find(acc => acc.role.toLowerCase() === role.toLowerCase());
      if (!account) {
        throw new Error('Demo account not found');
      }

      // Use Clerk's signIn method
      const result = await signIn?.create({
        identifier: account.email,
        password: account.password,
      });

      if (result?.status === 'complete') {
        // Redirect to dashboard after successful login
        window.location.href = '/dashboard';
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      alert('Demo login failed. Please try again or use the manual sign-in.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="relative">
      {/* Demo Login Button */}
      <button
        onClick={() => setShowCredentials(!showCredentials)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        🚀 Try Demo
      </button>

      {/* Credentials Dropdown */}
      {showCredentials && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 max-w-[85vw] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 sm:right-0 right-1/2 sm:transform-none transform translate-x-1/2">
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Demo Accounts
                </h3>
              <button
                onClick={() => setShowCredentials(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
              Choose a role to automatically log in and explore the platform:
            </p>

            <div className="space-y-2 sm:space-y-3">
              {demoAccounts.map((account, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-2 sm:p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {account.role}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      account.role === 'Student' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      account.role === 'Instructor' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {account.role}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    {account.description}
                  </p>

                  <div className="space-y-2 mb-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Email:</span>
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 sm:px-3 py-1 sm:py-2 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 break-all">
                        {account.email}
                      </code>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Password:</span>
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 sm:px-3 py-1 sm:py-2 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 break-all">
                        {account.password}
                      </code>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDemoLogin(account.role)}
                    disabled={isLoggingIn}
                    className={`w-full px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      isLoggingIn
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : account.role === 'Student' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                          account.role === 'Instructor' ? 'bg-green-600 hover:bg-green-700 text-white' :
                          'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {isLoggingIn ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </div>
                    ) : (
                      `Login as ${account.role}`
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Demo accounts have full access to all features
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showCredentials && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowCredentials(false)}
        />
      )}
    </div>
  );
} 