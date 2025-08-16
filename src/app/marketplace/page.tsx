'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: number;
  category: string;
  instructorId: string;
  status: string;
  rating?: number;
  reviewCount?: number;
  instructorName?: string;
  enrollmentCount?: number;
  price?: number;
  isFree?: boolean;
}

export default function Marketplace() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: string) => {
    setEnrollingCourseId(courseId);
    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        alert('Successfully enrolled in course!');
        // Refresh courses to update enrollment status
        fetchCourses();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to enroll in course');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Failed to enroll in course. Please try again.');
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses/published');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      } else {
        console.error('Failed to fetch courses');
        // Set enhanced dummy data for testing
        setCourses([
          {
            id: '1',
            title: 'Introduction to C Programming: A Beginner\'s Guide',
            description: 'A comprehensive introduction to the C programming language, designed for beginner programmers with no prior experience.',
            difficulty: 'beginner',
            duration: 20,
            category: 'General',
            instructorId: 'instructor1',
            status: 'published',
            rating: 4.8,
            reviewCount: 1247,
            instructorName: 'Dr. Sarah Thompson',
            enrollmentCount: 5432,
            price: 99,
            isFree: false
          },
          {
            id: '2',
            title: 'Introduction to C Programming',
            description: 'A beginner-friendly course covering the fundamentals of the C programming language.',
            difficulty: 'beginner',
            duration: 20,
            category: 'General',
            instructorId: 'instructor2',
            status: 'published',
            rating: 4.6,
            reviewCount: 892,
            instructorName: 'Prof. Michael Chen',
            enrollmentCount: 2341,
            price: 99,
            isFree: false
          },
          {
            id: '3',
            title: 'Data Structures and Algorithms: A Visual Approach',
            description: 'A beginner-friendly course on fundamental data structures and algorithms, emphasizing visual learning methods.',
            difficulty: 'beginner',
            duration: 20,
            category: 'General',
            instructorId: 'instructor3',
            status: 'published',
            rating: 4.7,
            reviewCount: 1567,
            instructorName: 'Dr. Emily Rodriguez',
            enrollmentCount: 6789,
            price: 99,
            isFree: false
          },
          {
            id: '4',
            title: 'PMP Prep: A Beginner\'s Guide to Project Management',
            description: 'This comprehensive course provides a foundational understanding of project management principles and PMP certification preparation.',
            difficulty: 'beginner',
            duration: 20,
            category: 'General',
            instructorId: 'instructor4',
            status: 'published',
            rating: 4.5,
            reviewCount: 2341,
            instructorName: 'James Patterson',
            enrollmentCount: 3456,
            price: 99,
            isFree: false
          },
          {
            id: '5',
            title: 'Introduction to Financial Planning: An Intermediate Guide',
            description: 'This course provides a comprehensive overview of financial planning principles and strategies for intermediate learners.',
            difficulty: 'beginner',
            duration: 20,
            category: 'General',
            instructorId: 'instructor5',
            status: 'published',
            rating: 4.4,
            reviewCount: 1876,
            instructorName: 'Rebecca Martinez',
            enrollmentCount: 4321,
            price: 99,
            isFree: false
          },
          {
            id: '6',
            title: 'Software Maintenance Fundamentals',
            description: 'A beginner-friendly course covering essential aspects of software maintenance and best practices.',
            difficulty: 'beginner',
            duration: 20,
            category: 'General',
            instructorId: 'instructor6',
            status: 'published',
            rating: 4.3,
            reviewCount: 1234,
            instructorName: 'David Kumar',
            enrollmentCount: 2789,
            price: 99,
            isFree: false
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Set dummy data on error
              setCourses([
          {
            id: '1',
            title: 'Introduction to C Programming: A Beginner\'s Guide',
            description: 'A comprehensive introduction to the C programming language, designed for beginner programmers.',
            difficulty: 'beginner',
            duration: 20,
            category: 'General',
            instructorId: 'instructor1',
            status: 'published',
            rating: 4.8,
            reviewCount: 1247,
            instructorName: 'Dr. Sarah Thompson',
            enrollmentCount: 5432,
            price: 99,
            isFree: false
          }
        ]);
    } finally {
      setLoading(false);
    }
  };



  const getCardHeaderColor = (difficulty: string, index: number) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-200';
      case 'intermediate':
        return 'bg-yellow-200';
      case 'advanced':
        return 'bg-red-200';
      default:
        // Rotate through pastel colors for variety
        const colors = ['bg-blue-200', 'bg-purple-200', 'bg-pink-200', 'bg-indigo-200', 'bg-teal-200'];
        return colors[index % colors.length];
    }
  };

  const getCardHeaderTextColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'text-green-800';
      case 'intermediate':
        return 'text-yellow-800';
      case 'advanced':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Sort courses based on selected criteria
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'popularity':
        return (b.enrollmentCount || 0) - (a.enrollmentCount || 0);
      case 'price':
        return (a.price || 0) - (b.price || 0);
      case 'newest':
        return new Date(b.id).getTime() - new Date(a.id).getTime();
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSortBy('popularity');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Logo */}
              <div className="flex items-center">
                <Image
                  src="/images/logos/learnify-logo-black.svg"
                  alt="Learnify Logo"
                  width={80}
                  height={80}
                  className="dark:hidden w-20 h-20"
                />
                <Image
                  src="/images/logos/learnify-logo-white.svg"
                  alt="Learnify Logo"
                  width={80}
                  height={80}
                  className="hidden dark:block w-20 h-20"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Course Marketplace
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Discover amazing courses created by expert instructors
                </p>
                <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {courses.length}+ Courses
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                    50K+ Students
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    4.8★ Average Rating
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/landing"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-4 min-w-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-w-0 flex-1"
              >
                <option value="all">All Categories</option>
                <option value="Programming">Programming</option>
                <option value="Data Science">Data Science</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Finance">Finance</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Language Learning">Language Learning</option>
                <option value="Music">Music</option>
                <option value="Photography">Photography</option>
                <option value="Personal Development">Personal Development</option>
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-w-0 flex-1"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-w-0 flex-1"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price">Price: Low to High</option>
                <option value="newest">Newest First</option>
              </select>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
          
          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="ml-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedDifficulty !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                  Level: {selectedDifficulty}
                  <button
                    onClick={() => setSelectedDifficulty('all')}
                    className="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Counter */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {sortedCourses.length} of {courses.length} courses
          </p>
        </div>
        
        {sortedCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                {/* Course Header */}
                <div className={`${getCardHeaderColor(course.difficulty, sortedCourses.indexOf(course))} p-4 ${getCardHeaderTextColor(course.difficulty)} relative`}>
                  {/* Best Seller Badge */}
                  {course.enrollmentCount && course.enrollmentCount > 5000 && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                      BEST SELLER
                    </div>
                  )}
                  {/* Trending Badge */}
                  {course.rating && course.rating >= 4.8 && course.enrollmentCount && course.enrollmentCount < 5000 && (
                    <div className="absolute top-2 right-2 bg-orange-400 text-orange-900 px-2 py-1 rounded-full text-xs font-bold">
                      TRENDING
                    </div>
                  )}
                  {/* Limited Time Badge */}
                  {course.isFree && (
                    <div className="absolute top-2 right-2 bg-red-400 text-red-900 px-2 py-1 rounded-full text-xs font-bold">
                      LIMITED TIME
                    </div>
                  )}
                  {/* New Badge */}
                  {course.status === 'published' && !course.isFree && course.rating && course.rating < 4.8 && course.enrollmentCount && course.enrollmentCount < 5000 && (
                    <div className="absolute top-2 left-2 bg-green-400 text-green-900 px-2 py-1 rounded-full text-xs font-bold">
                      NEW
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white/30 backdrop-blur-sm`}>
                      {course.difficulty}
                    </span>
                    <span className="text-sm font-medium">
                      {course.duration} hours
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    {course.title}
                  </h3>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {course.category}
                    </span>
                  </div>

                  {/* Instructor Info */}
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <span className="text-gray-600 font-semibold text-sm">
                        {course.instructorName?.charAt(0) || 'I'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {course.instructorName || 'Instructor'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Expert Instructor
                      </p>
                    </div>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4" fill={i < Math.floor(course.rating || 0) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {course.rating && course.rating > 0 ? 
                          `${course.rating.toFixed(1)} (${course.reviewCount?.toLocaleString() || 0} reviews)` : 
                          `New Course (${course.reviewCount?.toLocaleString() || 0} reviews)`
                        }
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">
                        {course.enrollmentCount?.toLocaleString() || 0} students
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {course.duration} hours • {course.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {course.isFree ? (
                        <div className="flex items-center">
                          <span className="text-green-600 dark:text-green-400 font-semibold text-lg">Free</span>
                          <span className="text-gray-400 line-through ml-2 text-sm">$49</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-gray-900 dark:text-white font-semibold text-lg">
                            ${course.price}
                          </span>
                          <span className="text-gray-400 line-through ml-2 text-sm">$99</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/course-details/${course.id}`}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        Preview
                      </Link>
                      <button
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          enrollingCourseId === course.id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : course.isFree 
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrollingCourseId === course.id}
                      >
                        {enrollingCourseId === course.id ? 'Enrolling...' : course.isFree ? 'Enroll Free' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>

                  {/* Course Features */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Certificate
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          Lifetime Access
                        </span>
                      </div>
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Self-paced
                      </span>
                    </div>
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