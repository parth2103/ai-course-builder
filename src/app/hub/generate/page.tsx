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
  const { isAdmin } = useRoleAccess();
  const [outline, setOutline] = useState<CourseOutline | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'curate' | 'export'>('generate');

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This section is only available for administrators.
        </p>
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
            <div className="space-y-6">
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
                      throw new Error('Failed to generate course outline');
                    }

                    const generatedOutline = await response.json();
                    setOutline(generatedOutline);
                    setActiveTab('curate');
                  } catch (error) {
                    console.error('Error generating course:', error);
                    alert('Failed to generate course outline. Please try again.');
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                loading={isGenerating}
              />
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
                  <ExportOptions outline={outline} onClose={() => {}} />
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