'use client';

import { useState, useEffect } from 'react';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import CourseForm from '../../components/CourseForm';

import EditableCourseContent from '../../components/EditableCourseContent';
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
  const [formData, setFormData] = useState<any>(null); // Store form data including difficulty
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'curate' | 'export'>('generate');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // Progress steps for the generation process
  const progressSteps = [
    'Analyzing course requirements...',
    'Generating module structure...',
    'Creating learning resources...',
    'Finalizing course outline...'
  ];

  // Simulate progress when loading starts
  useEffect(() => {
    if (isGenerating) {
      setProgress(0);
      setCurrentStep(0);
      
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 1000);

      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= progressSteps.length - 1) return prev;
          return prev + 1;
        });
      }, 3000);

      return () => {
        clearInterval(progressInterval);
        clearInterval(stepInterval);
      };
    } else {
      setProgress(0);
      setCurrentStep(0);
    }
  }, [isGenerating]);

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
          difficulty: formData?.difficulty || 'beginner',
          category: formData?.category || 'General',
          status: 'draft',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save course');
      }

      const data = await response.json();
      alert('Course saved successfully as draft!');
      
      // Navigate to course edit page
      setTimeout(() => {
        window.location.href = `/hub/instructor/courses/${data.courseId}/edit`;
      }, 1000);
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
          difficulty: formData?.difficulty || 'beginner',
          category: formData?.category || 'General',
          status: 'published',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish course');
      }

      // const data = await response.json();
      alert('Course published successfully! Students can now enroll.');
      
      // Navigate to instructor courses page
      setTimeout(() => {
        window.location.href = '/hub/instructor/courses';
      }, 1000);
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
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
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
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50">
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
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Course Configuration
                  </h3>
                  <CourseForm
                    onSubmit={async (data) => {
                      setIsGenerating(true);
                      setFormData(data); // Store form data for later use
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
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Generation Status
                  </h3>
                  
                  {isGenerating ? (
                    <div className="space-y-6">
                      {/* Progress Bar Animation */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>AI is generating your course outline...</span>
                          <span>Estimated time: 15-30 seconds</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(progress, 95)}%` }}
                          >
                            <div 
                              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                              style={{
                                background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #3b82f6 100%)',
                                backgroundSize: '200% 100%',
                                animation: 'progress 2s ease-in-out infinite'
                              }}
                            >
                            </div>
                          </div>
                        </div>

                        {/* Progress Percentage */}
                        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(progress)}% Complete
                        </div>

                        {/* Status Messages */}
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          {progressSteps.map((step, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div 
                                className={`w-2 h-2 rounded-full ${
                                  index <= currentStep 
                                    ? 'bg-green-500 animate-pulse' 
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                                style={{ animationDelay: `${index * 0.5}s` }}
                              ></div>
                              <span className={index <= currentStep ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}>
                                {step}
                              </span>
                            </div>
                          ))}
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
                    Edit and customize your AI-generated course outline. Modify course details, 
                    module content, learning objectives, resources, and assessment questions.
                  </p>
                  
                  {/* Course Preview */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                          {outline.courseTitle}
                        </h3>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          Generated with AI Course Builder • {outline.totalDuration || 0} hours • {outline.modules?.length || 0} modules
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Editable Course Content */}
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
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Save as Draft
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
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Publish Course
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
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
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