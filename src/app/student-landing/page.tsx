'use client';

import Link from 'next/link';
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import AuthHeader from '../components/AuthHeader';

import Image from "next/image";

export default function StudentLandingPage() {
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
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="text-center">
            {/* Logo */}
            <div className="-mb-2 md:-mb-6 flex justify-center">
              <Image
                src="/images/logos/learnify-logo-black.svg"
                alt="Learnify Logo"
                width={400}
                height={200}
                className="drop-shadow-2xl dark:hidden w-48 h-24 md:w-[400px] md:h-[200px]"
              />
              <Image
                src="/images/logos/learnify-logo-white.svg"
                alt="Learnify Logo"
                width={400}
                height={200}
                className="drop-shadow-2xl hidden dark:block w-48 h-24 md:w-[400px] md:h-[200px]"
              />
            </div>
            
            <div className="inline-flex items-center px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6 animate-fade-in-up mt-4 md:mt-0">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              Discover Amazing Courses
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Learn from the Best Instructors
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up px-4" style={{ animationDelay: '0.4s' }}>
              Access high-quality courses created by expert instructors. 
              Enhance your skills and advance your career with our curated learning platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <SignedOut>
                <Link href="/marketplace">
                  <button className="bg-[#8ebb7a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#7daa69] transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Browse Courses
                  </button>
                </Link>
                <SignUpButton mode="modal">
                  <button className="border-2 border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-200">
                    Start Learning Free
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/marketplace">
                  <button className="bg-[#8ebb7a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#7daa69] transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Browse Courses
                  </button>
                </Link>
                <Link href="/hub/student/learning">
                  <button className="border-2 border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-200">
                    My Learning
                  </button>
                </Link>
              </SignedIn>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free courses available
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Learn at your own pace
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Certificate upon completion
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
              Simple Learning
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started with AI-generated courses in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-200">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Step 1: Choose a Course
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Browse our vast collection of AI-generated courses. Select one that interests you.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-200">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Step 2: Start Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Begin your journey with interactive content, quizzes, and hands-on projects.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-200">
              <div className="bg-gradient-to-r from-green-600 to-green-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Step 3: Complete and Earn
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Complete your course, earn a certificate, and apply your new skills to real-world projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-600/10 border border-green-500/20 rounded-full text-green-600 dark:text-green-400 text-sm font-medium mb-4">
              Featured Courses
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Amazing Courses
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our curated collection of AI-generated courses designed for modern learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Course Card 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-200">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Web Development Fundamentals
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Master HTML, CSS, and JavaScript to build modern websites from scratch.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                  Beginner
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">20 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">4.9 (2.1k)</span>
                </div>
                <Link href="/marketplace">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Enroll Free
                  </button>
                </Link>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-200">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Data Science Essentials
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Learn Python, statistics, and machine learning fundamentals for data analysis.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                  Intermediate
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">35 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">4.8 (1.8k)</span>
                </div>
                <Link href="/marketplace">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Enroll Free
                  </button>
                </Link>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-200">
              <div className="bg-gradient-to-r from-green-600 to-green-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Digital Marketing Mastery
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Master SEO, social media, and content marketing strategies for business growth.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                  Beginner
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">25 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">4.7 (1.5k)</span>
                </div>
                <Link href="/marketplace">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Enroll Free
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Benefits Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
              Why Choose Our Platform
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Learn Smarter, Not Harder
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our AI-generated courses are designed to maximize your learning efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI-Optimized Content
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Courses are generated and refined using advanced AI for optimal learning outcomes.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Learn at Your Pace
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Self-paced learning with lifetime access to course materials and updates.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-green-600 to-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Practical Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Hands-on projects and real-world applications to reinforce your learning.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Completion Certificates
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Earn certificates upon completion to showcase your new skills to employers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-600/10 border border-yellow-500/20 rounded-full text-yellow-600 dark:text-yellow-400 text-sm font-medium mb-4">
              Student Success
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of successful learners who transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Sarah Chen</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Software Developer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                "The web development course helped me land my first developer job. The AI-generated content was surprisingly comprehensive and practical."
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">M</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Mike Rodriguez</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Data Analyst</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                "The data science course was perfect for my career transition. The AI-generated projects were challenging but achievable."
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Alex Johnson</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Marketing Manager</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                "The digital marketing course gave me the skills to grow our company's online presence by 300% in just 6 months."
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
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
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already mastering new skills with our AI-generated courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <SignedOut>
                <Link href="/marketplace">
                  <button className="bg-white text-[#8ebb7a] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Browse All Courses
                  </button>
                </Link>
                <SignUpButton mode="modal">
                  <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#8ebb7a] transition-all duration-200">
                    Start Learning Free
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/marketplace">
                  <button className="bg-white text-[#8ebb7a] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Browse All Courses
                  </button>
                </Link>
                <Link href="/hub/student/learning">
                  <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#8ebb7a] transition-all duration-200">
                    Continue Learning
                  </button>
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
                Free courses available
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Certificate upon completion
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
                  width={40}
                  height={40}
                />
              </div>
              <p className="text-gray-400">
                Empowering students to learn with AI-generated courses designed for modern learners.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Browse Courses</Link></li>
                <li><Link href="/hub/student/learning" className="hover:text-white transition-colors">My Learning</Link></li>
                <li><Link href="/hub/student/progress" className="hover:text-white transition-colors">Track Progress</Link></li>
                <li><Link href="/student-landing" className="hover:text-white transition-colors">Student Home</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Instructors</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/landing" className="hover:text-white transition-colors">Create Courses</Link></li>
                <li><Link href="/hub/generate" className="hover:text-white transition-colors">AI Course Generator</Link></li>
                <li><Link href="/hub/instructor/courses" className="hover:text-white transition-colors">My Courses</Link></li>
                <li><Link href="/hub/instructor/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Community</li>
                <li>Privacy Policy</li>
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
