'use client';

import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import CourseForm, { CourseFormData } from '../components/CourseForm';
import EnhancedCourseDisplay from '../components/EnhancedCourseDisplay';
import ResourceUpload from '../components/ResourceUpload';
import ResourceLibrary from '../components/ResourceLibrary';
import ContentCurator from '../components/ContentCurator';
import DarkModeToggle from '../components/DarkModeToggle';
import AccountSettings from '../components/AccountSettings';
import Image from 'next/image';

import { useRoleAccess } from '../hooks/useRoleAccess';

interface VideoResource {
  title: string;
  description: string;
  url?: string;
  duration?: number;
}

interface DocumentResource {
  title: string;
  description: string;
  type: 'pdf' | 'ppt' | 'doc';
}

interface ExternalLink {
  title: string;
  description: string;
  url?: string;
}

interface ModuleOutline {
  title: string;
  bulletPoints: string[];
  learningObjectives: string[];
  estimatedDuration: number;
  resources: {
    videos: VideoResource[];
    documents: DocumentResource[];
    externalLinks: ExternalLink[];
  };
  assessment: {
    quizQuestions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  };
}

interface CourseOutline {
  courseTitle: string;
  description: string;
  totalDuration: number;
  modules: ModuleOutline[];
  prerequisites: string[];
  learningOutcomes: string[];
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'link';
  url?: string;
  tags: string[];
  addedAt: Date;
}

interface ApiResponse {
  success: boolean;
  outline: CourseOutline;
  generatedWith: string;
  error?: string;
  details?: string;
}

export default function AdminDashboard() {
  const { isAdmin: _isAdmin } = useRoleAccess();
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState<CourseOutline | null>(null);
  const [error, setError] = useState<string>('');
  const [generatedWith, setGeneratedWith] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'generate' | 'curate' | 'resources' | 'courses'>('generate');
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(null);
  const [savedCourses, setSavedCourses] = useState<Array<{
    id: string;
    title: string;
    outline: CourseOutline;
    createdAt: Date;
    lastModified: Date;
  }>>([]);
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);

  // Load saved courses from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedCourses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedCourses(parsed.map((course: any) => ({
          ...course,
          createdAt: new Date(course.createdAt),
          lastModified: new Date(course.lastModified)
        })));
      } catch (error) {
        console.error('Error loading saved courses:', error);
      }
    }
  }, []);

  // Save courses to localStorage whenever savedCourses changes
  useEffect(() => {
    localStorage.setItem('savedCourses', JSON.stringify(savedCourses));
  }, [savedCourses]);

  const saveCurrentCourse = () => {
    if (!outline) return;
    
    const courseId = currentCourseId || Date.now().toString();
    const courseData = {
      id: courseId,
      title: outline.courseTitle,
      outline: outline,
      createdAt: currentCourseId ? savedCourses.find(c => c.id === currentCourseId)?.createdAt || new Date() : new Date(),
      lastModified: new Date()
    };

    if (currentCourseId) {
      // Update existing course
      setSavedCourses(prev => prev.map(course => 
        course.id === currentCourseId ? courseData : course
      ));
    } else {
      // Add new course
      setSavedCourses(prev => [...prev, courseData]);
      setCurrentCourseId(courseId);
    }
  };

  const loadCourse = (courseId: string) => {
    const course = savedCourses.find(c => c.id === courseId);
    if (course) {
      setOutline(course.outline);
      setCurrentCourseId(courseId);
      setActiveTab('curate');
    }
  };

  const deleteCourse = (courseId: string) => {
    setSavedCourses(prev => prev.filter(course => course.id !== courseId));
    if (currentCourseId === courseId) {
      setOutline(null);
      setCurrentCourseId(null);
      setActiveTab('generate');
    }
  };

  const createNewCourse = () => {
    setOutline(null);
    setCurrentCourseId(null);
    setActiveTab('generate');
  };

  const handleSubmit = async (formData: CourseFormData) => {
    setLoading(true);
    setError('');
    setOutline(null);

    try {
      const response = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate outline');
      }

      setOutline(data.outline);
      setGeneratedWith(data.generatedWith);
      setActiveTab('curate');
      
      // Auto-save the generated course
      const courseId = Date.now().toString();
      const courseData = {
        id: courseId,
        title: data.outline.courseTitle,
        outline: data.outline,
        createdAt: new Date(),
        lastModified: new Date()
      };
      setSavedCourses(prev => [...prev, courseData]);
      setCurrentCourseId(courseId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleUpdate = (moduleIndex: number, updatedModule: ModuleOutline) => {
    if (!outline) return;
    
    const updatedModules = [...outline.modules];
    updatedModules[moduleIndex] = updatedModule;
    
    setOutline({
      ...outline,
      modules: updatedModules
    });
  };

  const handleFileUpload = (file: any) => {
    const newResource: Resource = {
      id: file.id,
      title: file.name,
      description: `Uploaded ${file.type} file`,
      type: file.type === 'pdf' || file.type === 'ppt' || file.type === 'doc' ? 'document' : 'link',
      tags: ['uploaded', file.type],
      addedAt: new Date()
    };
    
    setResources([...resources, newResource]);
  };

  const handleVideoAdd = (video: { title: string; url: string; description: string }) => {
    const newResource: Resource = {
      id: Date.now().toString(),
      title: video.title,
      description: video.description,
      type: 'video',
      url: video.url,
      tags: ['video', 'youtube'],
      addedAt: new Date()
    };
    
    setResources([...resources, newResource]);
  };

  const handleExternalLinkAdd = (link: { title: string; url: string; description: string }) => {
    const newResource: Resource = {
      id: Date.now().toString(),
      title: link.title,
      description: link.description,
      type: 'link',
      url: link.url,
      tags: ['external', 'link'],
      addedAt: new Date()
    };
    
    setResources([...resources, newResource]);
  };

  const handleResourceSelect = (resource: Resource) => {
    // Add resource to the currently selected module
    if (selectedModuleIndex !== null && outline) {
      const updatedModules = [...outline.modules];
      const module = updatedModules[selectedModuleIndex];
      
      if (resource.type === 'video') {
        module.resources.videos.push({
          title: resource.title,
          description: resource.description,
          url: resource.url,
          duration: 0
        });
      } else if (resource.type === 'document') {
        module.resources.documents.push({
          title: resource.title,
          description: resource.description,
          type: 'pdf'
        });
      } else {
        module.resources.externalLinks.push({
          title: resource.title,
          description: resource.description,
          url: resource.url
        });
      }
      
      setOutline({
        ...outline,
        modules: updatedModules
      });
    }
  };

  const handleResourceDelete = (resourceId: string) => {
    setResources(resources.filter(r => r.id !== resourceId));
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900" suppressHydrationWarning={true}>
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
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Course Management</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <AccountSettings />
                  <DarkModeToggle />
                </div>
              </div>
            </div>
          </header>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('generate')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'generate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🚀 Generate Course
            </button>
            <button
              onClick={() => setActiveTab('curate')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'curate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ✏️ Curate Content
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resources'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📚 Resource Library
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📖 My Courses ({savedCourses.length})
            </button>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Generation Form */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Generate New Course</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Create a comprehensive course outline with AI
                  </p>
                </div>
                <div className="p-6">
                  <CourseForm onSubmit={handleSubmit} loading={loading} />
                  
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                          <div className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Course Preview */}
            <div className="lg:col-span-2">
              {!outline ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-12 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No course outline</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Generate a course outline to see the preview here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Course Preview</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Generated with {generatedWith}
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('curate')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Start Curating
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <EnhancedCourseDisplay outline={outline} generatedWith={generatedWith} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'curate' && (
          <div className="space-y-6">
            {!outline ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Course Generated</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Generate a course first to start curating content.
                </p>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  🚀 Generate Course
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Curate Course Content</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={saveCurrentCourse}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      💾 Save Course
                    </button>
                    <button
                      onClick={() => setActiveTab('resources')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      📚 Add Resources
                    </button>
                    <button
                      onClick={() => setActiveTab('generate')}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                    >
                      New Course
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Module List */}
                  <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Modules</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2">
                          {outline.modules.map((module, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedModuleIndex(index)}
                              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                selectedModuleIndex === index
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                    {index + 1}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {module.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    ⏱️ {module.estimatedDuration} min
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Curator */}
                  <div className="lg:col-span-3">
                    {selectedModuleIndex !== null ? (
                      <ContentCurator
                        module={outline.modules[selectedModuleIndex]}
                        moduleIndex={selectedModuleIndex}
                        onModuleUpdate={handleModuleUpdate}
                      />
                    ) : (
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                        <div className="text-gray-400 mb-4">
                          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Module</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Choose a module from the list to start curating its content.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resource Upload */}
            <div>
              <ResourceUpload
                onFileUpload={handleFileUpload}
                onVideoAdd={handleVideoAdd}
                onExternalLinkAdd={handleExternalLinkAdd}
              />
            </div>

            {/* Resource Library */}
            <div>
              <ResourceLibrary
                resources={resources}
                onResourceSelect={handleResourceSelect}
                onResourceDelete={handleResourceDelete}
              />
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage and edit your saved courses
                </p>
              </div>
              <button
                onClick={createNewCourse}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                + Create New Course
              </button>
            </div>

            {/* Course Grid */}
            {savedCourses.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Generate your first course to get started
                </p>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Generate Course
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {course.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>📚 {course.outline.modules.length} modules</span>
                            <span>⏱️ {course.outline.totalDuration}h</span>
                          </div>
                        </div>
                        {currentCourseId === course.id && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {course.outline.description}
                        </p>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <div>Created: {course.createdAt.toLocaleDateString()}</div>
                          <div>Modified: {course.lastModified.toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => loadCourse(course.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Edit Course
                        </button>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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