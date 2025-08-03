'use client';

import { useState } from 'react';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import CourseForm from '../../components/CourseForm';
import EnhancedCourseDisplay from '../../components/EnhancedCourseDisplay';
import ExportOptions from '../../components/ExportOptions';

interface CourseOutline {
  courseTitle: string;
  description: string;
  totalDuration: number;
  modules: ModuleOutline[];
  prerequisites: string[];
  learningOutcomes: string[];
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
    quizQuestions: QuizQuestion[];
  };
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

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

export default function HubGenerate() {
  const { isAdmin, isInstructor } = useRoleAccess();
  const [outline, setOutline] = useState<CourseOutline | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'curate' | 'export'>('generate');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

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

  const handleSaveCourse = async () => {
    if (!outline) return;
    
    setIsSaving(true);
    try {
      // Save course to database (draft status)
      const response = await fetch('/api/courses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...outline,
          status: 'draft',
          instructorId: 'current-user-id', // This should come from auth context
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
      // Save course to database (published status)
      const response = await fetch('/api/courses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...outline,
          status: 'published',
          instructorId: 'current-user-id', // This should come from auth context
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Course Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create comprehensive courses using artificial intelligence
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle is handled globally in the layout */}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('generate')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'generate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🤖 Generate Course
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
              ✏️ Curate Content
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
          {activeTab === 'generate' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Course Form - Left Side (50%) */}
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Course Configuration
                  </h3>
                  <CourseForm
                    onSubmit={async (data) => {
                      setIsGenerating(true);
                      try {
                        const response = await fetch('/api/generate-outline', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(data),
                        });

                        if (!response.ok) {
                          const errorData = await response.json();
                          throw new Error(errorData.error || 'Failed to generate course outline');
                        }

                        const responseData = await response.json();
                        // Extract just the outline data from the response
                        const generatedOutline = responseData.outline || responseData;
                        setOutline(generatedOutline);
                        setActiveTab('curate');
                      } catch (error) {
                        console.error('Error generating course:', error);
                        alert(`Failed to generate course outline: ${error instanceof Error ? error.message : 'Unknown error'}`);
                      } finally {
                        setIsGenerating(false);
                      }
                    }}
                    loading={isGenerating}
                  />
                </div>
              </div>

              {/* Animation Area - Right Side (50%) */}
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Generation Status
                  </h3>
                  
                  {isGenerating ? (
                    <div className="space-y-6">
                      {/* AI Generation Animation */}
                      <div className="text-center">
                        <div className="relative">
                          <div className="w-24 h-24 mx-auto mb-4">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                            <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                              <svg className="w-12 h-12 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            AI is Generating Your Course
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            This usually takes 15-30 seconds
                          </p>
                        </div>
                      </div>

                      {/* Progress Steps */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Analyzing course requirements...</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Generating module structure...</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Creating learning resources...</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                          <span className="text-sm text-gray-400 dark:text-gray-500">Finalizing course outline...</span>
                        </div>
                      </div>

                      {/* Tips */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                          💡 Tips for Better Results
                        </h5>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• Be specific about your course topic</li>
                          <li>• Include relevant prerequisites</li>
                          <li>• Choose appropriate difficulty level</li>
                          <li>• Consider your target audience</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Ready to Generate
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Fill out the form on the left and click "Generate Course Outline" to start
                      </p>
                    </div>
                  )}
                </div>
              </div>
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
                    Review and customize the AI-generated course outline. You can edit module titles, 
                    learning objectives, add resources, and modify assessment questions.
                  </p>
                  <EnhancedCourseDisplay outline={outline} generatedWith="AI Course Builder" />
                  
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
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                      Save as draft to work on it later, or publish to make it available to students.
                    </p>
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
                    No course generated yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Generate a course outline first to start curating content.
                  </p>
                  <button
                    onClick={() => setActiveTab('generate')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Generate Course
                  </button>
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
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Generate and curate a course first to export it.
                  </p>
                  <button
                    onClick={() => setActiveTab('generate')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Generate Course
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 