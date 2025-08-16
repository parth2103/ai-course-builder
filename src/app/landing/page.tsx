'use client';

import Link from 'next/link';
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import AuthHeader from '../components/AuthHeader';

import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fixed Background - Doesn't move with scroll */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)] dark:bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
      </div>

      {/* Auth Header */}
      <AuthHeader />
      
      {/* Hero Section */}
      <section className="text-gray-900 dark:text-white relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-20 h-20 bg-[#8ebb7a]/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-yellow-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="text-center">
            {/* Logo Image */}
            <div className="-mb-2 md:-mb-6 flex justify-center">
              <div className="relative">
                <Image
                  src="/images/logos/learnify-logo-black.svg"
                  alt="Learnify Logo"
                  width={400}
                  height={200}
                  className="transition-all duration-300 dark:hidden w-48 h-24 md:w-[400px] md:h-[200px]"
                />
                <Image
                  src="/images/logos/learnify-logo-white.svg"
                  alt="Learnify Logo"
                  width={400}
                  height={200}
                  className="transition-all duration-300 hidden dark:block w-48 h-24 md:w-[400px] md:h-[200px]"
                />
              </div>
            </div>
            
            <div className="inline-flex items-center px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6 animate-fade-in-up mt-4 md:mt-0">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              AI-Powered Course Creation Platform
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Create Professional Courses in Minutes, Not Weeks
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up px-4" style={{ animationDelay: '0.4s' }}>
              Transform your expertise into engaging learning experiences with AI-powered course generation. 
              From outline to assessment, our platform handles everything while you focus on what matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="bg-[#8ebb7a] hover:bg-[#7daa69] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Start Creating Free
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="border-2 border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-200">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/hub"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Go to Course Hub
                </Link>
              </SignedIn>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free forever plan
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Setup in 2 minutes
              </div>
            </div>
          </div>
                </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
              See It In Action
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Dashboard Built for Educators
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the intuitive interface that makes course creation and management effortless
            </p>
          </div>

          <div className="relative">
            {/* Browser Mockup */}
            <div className="bg-gray-800 rounded-t-lg p-4 flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 bg-gray-700 rounded px-3 py-1 text-gray-300 text-sm ml-4">
                ai-course-builder.com/hub
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-2xl overflow-hidden">
              {/* Desktop Layout */}
              <div className="hidden lg:flex">
                {/* Sidebar */}
                <div className="w-64 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">CH</span>
                      </div>
                      <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                        Course Hub
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">I</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Instructor Dashboard</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back!</p>
                      </div>
                    </div>
                  </div>

                  <nav className="p-4 space-y-2">
                    <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                      Course Hub
                    </div>
                    <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      My Courses
                    </div>
                    <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Course
                    </div>
                    <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      My Analytics
                    </div>
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Instructor Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Create and manage your courses</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Create Course</h3>
                          <p className="text-green-100 text-sm">Access create course</p>
                        </div>
                        <svg className="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">My Courses</h3>
                          <p className="text-blue-100 text-sm">Access my courses</p>
                        </div>
                        <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">My Analytics</h3>
                          <p className="text-purple-100 text-sm">Access my analytics</p>
                        </div>
                        <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">View all</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Course "JavaScript Fundamentals" published</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">New student enrolled in "React Basics"</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Course "Python for Beginners" updated</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden">
                {/* Mobile Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">CH</span>
                      </div>
                      <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                        Course Hub
                      </span>
                    </div>
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">I</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Content */}
                <div className="p-4">
                  <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Instructor Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Create and manage your courses</p>
                  </div>

                  {/* Mobile Action Cards */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold mb-1">Create Course</h3>
                          <p className="text-green-100 text-xs">Access create course</p>
                        </div>
                        <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold mb-1">My Courses</h3>
                          <p className="text-blue-100 text-xs">Access my courses</p>
                        </div>
                        <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold mb-1">My Analytics</h3>
                          <p className="text-purple-100 text-xs">Access my analytics</p>
                        </div>
                        <svg className="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Navigation</h3>
                    <div className="space-y-2">
                      <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
                        Course Hub
                      </div>
                      <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        My Courses
                      </div>
                      <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Course
                      </div>
                      <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        My Analytics
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Time Comparison Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-orange-600/10 border border-orange-500/20 rounded-full text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
              Time Savings
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Traditional vs AI Course Builder
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See how much time you can save with our AI-powered platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Traditional Method */}
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Traditional Method</h3>
                  <p className="text-red-600 dark:text-red-400 font-medium">40-80 hours per course</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Research & Planning</span>
                  <span className="text-red-600 font-semibold">8-12 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Content Creation</span>
                  <span className="text-red-600 font-semibold">20-30 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Assessment Design</span>
                  <span className="text-red-600 font-semibold">6-10 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Formatting & Structure</span>
                  <span className="text-red-600 font-semibold">6-8 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Review & Revisions</span>
                  <span className="text-red-600 font-semibold">10-20 hours</span>
                </div>
              </div>
            </div>

            {/* AI Course Builder */}
            <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">AI Course Builder</h3>
                  <p className="text-green-600 dark:text-green-400 font-medium">2-4 hours per course</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">AI Generation</span>
                  <span className="text-green-600 font-semibold">30-45 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Content Review</span>
                  <span className="text-green-600 font-semibold">1-2 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Customization</span>
                  <span className="text-green-600 font-semibold">30-60 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Final Polish</span>
                  <span className="text-green-600 font-semibold">30-45 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Publishing</span>
                  <span className="text-green-600 font-semibold">5-10 minutes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-[#8ebb7a] to-[#7daa69] rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Save Up to 95% of Your Time</h3>
              <p className="text-lg text-white/90 mb-6">
                Focus on what you do best - teaching and inspiring students
              </p>
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="bg-white text-[#8ebb7a] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Start Saving Time Today
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/hub"
                  className="bg-white text-[#8ebb7a] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Go to Course Hub
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
              What AI Course Builder Offers
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Create Amazing Courses
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From AI-powered content generation to comprehensive learning management, we've got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI-Powered Generation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Generate comprehensive course outlines, learning objectives, and assessments in minutes using advanced AI.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
              <div className="bg-gradient-to-r from-green-600 to-green-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Rich Content Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Add videos, documents, external links, and interactive assessments to create engaging learning experiences.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Role-Based Access
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Different interfaces for admins, instructors, and students with appropriate permissions and features.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Monitor student progress, track completion rates, and generate detailed analytics for better insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-600/10 border border-yellow-500/20 rounded-full text-yellow-600 dark:text-yellow-400 text-sm font-medium mb-4">
              Simple Process
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How to Use AI Course Builder
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From idea to published course in just three simple steps
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 transform -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  1
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Sign Up & Access Dashboard
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create your account and access your personalized instructor dashboard with all the tools you need.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  2
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/20 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Generate Course with AI
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Describe your course topic and let our AI create a comprehensive outline with modules, objectives, and assessments.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  3
                </div>
                <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Customize & Publish
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Review the AI-generated content, add your personal touch, and publish your course to start teaching.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#8ebb7a] to-[#7daa69] rounded-2xl p-12 border border-[#8ebb7a]/20 shadow-xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Teaching?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of educators who are already using AI Course Builder to create amazing learning experiences in minutes, not weeks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="bg-white text-[#8ebb7a] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Start Creating Free
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#8ebb7a] transition-all duration-200">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/hub"
                  className="bg-white text-[#8ebb7a] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Go to Course Hub
                </Link>
              </SignedIn>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-white/80">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free forever plan
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Setup in 2 minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Image
                  src="/images/logos/learnify-logo-white.svg"
                  alt="Learnify Logo"
                  width={100}
                  height={40}
                />
              </div>
              <p className="text-gray-400">
                Empowering educators to create amazing learning experiences with AI.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/student-landing" className="hover:text-white transition-colors">Student Home</Link></li>
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Browse Courses</Link></li>
                <li><Link href="/hub/student/learning" className="hover:text-white transition-colors">My Learning</Link></li>
                <li><Link href="/hub/student/progress" className="hover:text-white transition-colors">Track Progress</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
                <li>GDPR</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Learnify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 