'use client';

import { useState, useEffect } from 'react';
import { useRoleAccess } from '../hooks/useRoleAccess';
import { dataStore } from '../lib/dataStore';
import { useUser } from '@clerk/nextjs';

export default function Marketplace() {
  const { userRole } = useRoleAccess();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [appliedCategory, setAppliedCategory] = useState('all');
  const [appliedDifficulty, setAppliedDifficulty] = useState('all');
  const [courses, setCourses] = useState(dataStore.getPublishedCourses());
  const [enrolling, setEnrolling] = useState<string | null>(null);

  const categories = [
    { name: 'All', value: 'all' },
    { name: 'Programming', value: 'Programming' },
    { name: 'Design', value: 'Design' },
    { name: 'Business', value: 'Business' },
    { name: 'Marketing', value: 'Marketing' }
  ];

  const difficulties = [
    { name: 'All Levels', value: 'all' },
    { name: 'Beginner', value: 'beginner' },
    { name: 'Intermediate', value: 'intermediate' },
    { name: 'Advanced', value: 'advanced' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleFilter = () => {
    setAppliedCategory(selectedCategory);
    setAppliedDifficulty(selectedDifficulty);
  };

  const handleResetFilter = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setAppliedCategory('all');
    setAppliedDifficulty('all');
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      alert('Please sign in to enroll in courses');
      return;
    }

    setEnrolling(courseId);
    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Successfully enrolled in course!');
        // Refresh courses to update enrollment counts
        setCourses(dataStore.getPublishedCourses());
      } else {
        alert(data.error || 'Failed to enroll in course');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Failed to enroll in course');
    } finally {
      setEnrolling(null);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = appliedCategory === 'all' || course.category === appliedCategory;
    const matchesDifficulty = appliedDifficulty === 'all' || course.difficulty === appliedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const featuredCourses = filteredCourses.filter(course => course.rating >= 4.5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Course Marketplace
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Discover and enroll in amazing courses
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome, {userRole}!
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Courses
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={handleResetFilter}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Active Filters */}
          {(appliedCategory !== 'all' || appliedDifficulty !== 'all') && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {appliedCategory !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {appliedCategory}
                </span>
              )}
              {appliedDifficulty !== 'all' && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(appliedDifficulty)}`}>
                  {appliedDifficulty}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onEnroll={handleEnroll}
                enrolling={enrolling === course.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Courses */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          All Courses ({filteredCourses.length})
        </h2>
        {filteredCourses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onEnroll={handleEnroll}
                enrolling={enrolling === course.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course, onEnroll, enrolling }: { 
  course: any; 
  onEnroll: (courseId: string) => void;
  enrolling: boolean;
}) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {course.description}
            </p>
          </div>
          {course.rating >= 4.5 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Featured
            </span>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>⭐ {course.rating}</span>
          <span>⏱️ {course.duration}h</span>
          <span>📚 {course.modules} modules</span>
          <span>👥 {course.enrolledStudents}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {course.instructor}
          </span>
        </div>

        <button 
          onClick={() => onEnroll(course.id)}
          disabled={enrolling}
          className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            enrolling 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {enrolling ? 'Enrolling...' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
} 