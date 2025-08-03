'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRoleAccess } from '../../../../../hooks/useRoleAccess';
import CourseForm from '../../../../../components/CourseForm';
import EnhancedCourseDisplay from '../../../../../components/EnhancedCourseDisplay';
import EditableCourseContent from '../../../../../components/EditableCourseContent';
import ExportOptions from '../../../../../components/ExportOptions';

interface CourseOutline {
  courseTitle: string;
  description: string;
  totalDuration: number;
  modules: any[];
  prerequisites: string[];
  learningOutcomes: string[];
}

export default function EditCourse() {
  const { isAdmin, isInstructor } = useRoleAccess();
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<any>(null);
  const [outline, setOutline] = useState<CourseOutline | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'curate' | 'export'>('edit');
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const courseData = await response.json();
        setCourse(courseData);
        setOutline(courseData.outline);
      } else {
        console.error('Failed to load course');
        router.push('/hub/instructor/courses');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      router.push('/hub/instructor/courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCourse = async () => {
    if (!outline) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...outline,
          status: 'draft',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save course');
      }

      alert('Course saved successfully as draft!');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishCourse = async () => {
    if (!outline) return;
    
    setIsPublishing(true);
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...outline,
          status: 'published',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish course');
      }

      alert('Course published successfully! Students can now enroll.');
    } catch (error) {
      console.error('Error publishing course:', error);
      alert('Failed to publish course. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isAdmin && !isInstructor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This section is only available for administrators and instructors.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Course Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The course you're looking for doesn't exist or you don't have permission to edit it.
        </p>
        <button
          onClick={() => router.push('/hub/instructor/courses')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Course: {course.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Modify your course content and settings
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              course.status === 'published' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {course.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('edit')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'edit'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ✏️ Edit Course
            </button>
            <button
              onClick={() => setActiveTab('curate')}
              disabled={!outline}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'curate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${!outline ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              📝 Curate Content
            </button>
            <button
              onClick={() => setActiveTab('export')}
              disabled={!outline}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'export'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${!outline ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              📤 Export Course
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'edit' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Course Information
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  This course was created on {new Date(course.createdAt).toLocaleDateString()}. 
                  You can modify the content below and save your changes.
                </p>
              </div>
              
              {outline && (
                <EditableCourseContent 
                  outline={outline} 
                  onOutlineChange={setOutline}
                />
              )}
            </div>
          )}

          {activeTab === 'curate' && (
            <div className="space-y-6">
              {outline ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Curate Your Course Content
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Edit every aspect of your course: module titles, learning objectives, 
                    resources, assessment questions, and more. All changes are saved automatically.
                  </p>
                  
                  {/* Full Editable Course Content */}
                  <EditableCourseContent 
                    outline={outline} 
                    onOutlineChange={setOutline}
                  />
                  
                  {/* Save and Publish Buttons */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleSaveCourse}
                        disabled={isSaving || isPublishing}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            💾 Save as Draft
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={handlePublishCourse}
                        disabled={isSaving || isPublishing}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        {isPublishing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Publishing...
                          </>
                        ) : (
                          <>
                            🚀 Publish Course
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No course content available
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    This course doesn't have any content to curate.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              {outline ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Export Your Course
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Export your course in various formats for different use cases.
                  </p>
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <button
                        onClick={() => setShowExportModal(true)}
                        className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center"
                      >
                        <div className="text-2xl mb-2">📤</div>
                        <div className="font-medium text-gray-900 dark:text-white">Export Options</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Choose format</div>
                      </button>
                    </div>
                  </div>
                  
                  {showExportModal && (
                    <ExportOptions 
                      outline={outline} 
                      onClose={() => setShowExportModal(false)} 
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No course to export
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    This course doesn't have any content to export.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 