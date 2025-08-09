'use client';

import { useRoleAccess } from '../hooks/useRoleAccess';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AuthHeader from '../components/AuthHeader';
import DarkModeToggle from '../components/DarkModeToggle';
import Image from 'next/image';

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isInstructor, isStudent, userRole } = useRoleAccess();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
        );
      case 'book':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'robot':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'book-open':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'plus':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'trending-up':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'graduation-cap':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        );
      case 'chart-bar':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
        );
    }
  };

  const navigationItems = [
    // Common items for all users
    {
      name: 'Course Hub',
      href: '/hub',
      icon: 'home',
      show: true
    },
    {
      name: 'Browse Courses',
      href: '/marketplace',
      icon: 'book',
      show: true
    },
    
    // Admin items
    {
      name: 'Admin Dashboard',
      href: '/hub/admin',
      icon: 'settings',
      show: isAdmin
    },
    {
      name: 'Generate Course',
      href: '/hub/generate',
      icon: 'robot',
      show: isAdmin
    },

    {
      name: 'Analytics',
      href: '/hub/analytics',
      icon: 'chart',
      show: isAdmin
    },
    
    // Instructor items
    {
      name: 'My Courses',
      href: '/hub/instructor/courses',
      icon: 'book-open',
      show: isInstructor
    },
    {
      name: 'Create Course',
      href: '/hub/generate',
      icon: 'plus',
      show: isInstructor
    },
    {
      name: 'My Analytics',
      href: '/hub/instructor/analytics',
      icon: 'trending-up',
      show: isInstructor
    },
    
    // Student items
    {
      name: 'My Learning',
      href: '/hub/student/learning',
      icon: 'graduation-cap',
      show: isStudent
    },
    {
      name: 'My Progress',
      href: '/hub/student/progress',
      icon: 'chart-bar',
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
              className="fixed top-20 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg md:hidden"
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
            <div className={`sidebar w-64 xl:w-64 lg:w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex-shrink-0 ${
              sidebarOpen ? 'open' : ''
            }`}>
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        src="/images/logos/learnify-logo-black.svg"
                        alt="Learnify Logo"
                        width={120}
                        height={40}
                        className="dark:hidden w-24 h-8 md:w-[120px] md:h-[40px]"
                      />
                      <Image
                        src="/images/logos/learnify-logo-white.svg"
                        alt="Learnify Logo"
                        width={120}
                        height={40}
                        className="hidden dark:block w-24 h-8 md:w-[120px] md:h-[40px]"
                      />
                    </div>
                    <span className="ml-3 text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                      Course Hub
                    </span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
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
                        className={`flex items-center px-3 py-2 text-sm lg:text-sm text-xs font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="mr-3">{getIcon(item.icon)}</span>
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
              <main className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
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