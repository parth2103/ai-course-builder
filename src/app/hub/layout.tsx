'use client';

import { useRoleAccess } from '../hooks/useRoleAccess';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AuthHeader from '../components/AuthHeader';
import DarkModeToggle from '../components/DarkModeToggle';

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isInstructor, isStudent, userRole } = useRoleAccess();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    // Common items for all users
    {
      name: 'Course Hub',
      href: '/hub',
      icon: '🏠',
      show: true
    },
    {
      name: 'Browse Courses',
      href: '/marketplace',
      icon: '📚',
      show: true
    },
    
    // Admin items
    {
      name: 'Admin Dashboard',
      href: '/hub/admin',
      icon: '⚙️',
      show: isAdmin
    },
    {
      name: 'Generate Course',
      href: '/hub/generate',
      icon: '🤖',
      show: isAdmin
    },
    {
      name: 'User Management',
      href: '/hub/users',
      icon: '👥',
      show: isAdmin
    },
    {
      name: 'Analytics',
      href: '/hub/analytics',
      icon: '📊',
      show: isAdmin
    },
    
    // Instructor items
    {
      name: 'My Courses',
      href: '/hub/instructor/courses',
      icon: '📖',
      show: isInstructor
    },
    {
      name: 'Create Course',
      href: '/hub/instructor/create',
      icon: '➕',
      show: isInstructor
    },
    {
      name: 'My Analytics',
      href: '/hub/instructor/analytics',
      icon: '📈',
      show: isInstructor
    },
    
    // Student items
    {
      name: 'My Learning',
      href: '/hub/student/learning',
      icon: '🎓',
      show: isStudent
    },
    {
      name: 'Enrolled Courses',
      href: '/hub/student/enrolled',
      icon: '📋',
      show: isStudent
    },
    {
      name: 'My Progress',
      href: '/hub/student/progress',
      icon: '📊',
      show: isStudent
    }
  ];

  const filteredNavigation = navigationItems.filter(item => item.show);

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
          {/* Auth Header */}
          <div className="flex-shrink-0">
            <AuthHeader />
          </div>
          
          {/* Mobile sidebar toggle */}
          <div className="sidebar-toggle">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="fixed top-20 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Backdrop overlay */}
            {sidebarOpen && (
              <div 
                className="sidebar-backdrop fixed inset-0 bg-black bg-opacity-50 z-30"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            {/* Sidebar */}
            <div className={`sidebar w-64 bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out flex-shrink-0 ${
              sidebarOpen ? 'open' : ''
            }`}>
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">CH</span>
                    </div>
                    <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                      Course Hub
                    </span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {userRole?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {userRole} Dashboard
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Welcome back!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <p>Role: {userRole}</p>
                  <p>Version: 1.0.0</p>
                </div>
                <div className="flex items-center justify-center">
                  <DarkModeToggle />
                </div>
              </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="content-area flex-1">
              <main className="p-6 max-w-7xl mx-auto w-full">
                <div className="max-w-6xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
} 