'use client';

import { useState } from 'react';

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
  url?: string;
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
    quizQuestions: QuizQuestion[];
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

interface EnhancedCourseDisplayProps {
  outline: CourseOutline;
  generatedWith: string;
}

export default function EnhancedCourseDisplay({ outline, generatedWith }: EnhancedCourseDisplayProps) {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  // Safety check for outline
  if (!outline) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No course outline available
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Please generate a course outline first.
        </p>
      </div>
    );
  }

  const toggleModule = (index: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedModules(newExpanded);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'ppt': return '📊';
      case 'doc': return '📝';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {outline.courseTitle}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {outline.description}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>⏱️ {outline.totalDuration || 0} hours</span>
          <span>📚 {outline.modules?.length || 0} modules</span>
          <span>🤖 Generated with {generatedWith}</span>
        </div>
      </div>

      {/* Prerequisites */}
      {outline.prerequisites && outline.prerequisites.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            📋 Prerequisites
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            {outline.prerequisites.map((prereq, index) => (
              <li key={index}>{prereq}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Learning Outcomes */}
      {outline.learningOutcomes && outline.learningOutcomes.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            🎯 Learning Outcomes
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            {outline.learningOutcomes.map((outcome, index) => (
              <li key={index}>{outcome}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Modules */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          📖 Course Modules
        </h3>
        {outline.modules?.map((module, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toggleModule(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {module.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ⏱️ {module.estimatedDuration} minutes
                  </p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedModules.has(index) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedModules.has(index) && (
              <div className="px-6 pb-6 space-y-6">
                {/* Learning Objectives */}
                <div>
                  <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                    🎯 Learning Objectives
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    {module.learningObjectives?.map((objective, objIndex) => (
                      <li key={objIndex}>{objective}</li>
                    ))}
                  </ul>
                </div>

                {/* Key Topics */}
                <div>
                  <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                    📝 Key Topics
                  </h5>
                  <ul className="space-y-2">
                    {module.bulletPoints?.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    📚 Learning Resources
                  </h5>
                  
                  {/* Videos */}
                  {module.resources?.videos?.length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🎥 Videos
                      </h6>
                      <div className="space-y-2">
                        {module.resources.videos.map((video, videoIndex) => (
                          <div key={videoIndex} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                            <div className="font-medium text-gray-900 dark:text-white text-sm">
                              {video.title}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                              {video.description}
                              {video.duration && ` • ${video.duration} min`}
                            </div>
                            {video.url && (
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium"
                              >
                                📺 Watch Video →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {module.resources?.documents?.length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        📄 Documents
                      </h6>
                      <div className="space-y-2">
                        {module.resources.documents.map((doc, docIndex) => (
                          <div key={docIndex} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                            <div className="flex items-center space-x-2">
                              <span>{getDocumentIcon(doc.type)}</span>
                              <div className="font-medium text-gray-900 dark:text-white text-sm">
                                {doc.title}
                              </div>
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                              {doc.description}
                            </div>
                            {doc.url && (
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium"
                              >
                                📄 View Document →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External Links */}
                  {module.resources?.externalLinks?.length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🔗 External Resources
                      </h6>
                      <div className="space-y-2">
                        {module.resources.externalLinks.map((link, linkIndex) => (
                          <div key={linkIndex} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                            <div className="font-medium text-gray-900 dark:text-white text-sm">
                              {link.title}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                              {link.description}
                            </div>
                            {link.url && (
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium"
                              >
                                🔗 Visit Resource →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Assessment */}
                {module.assessment?.quizQuestions?.length > 0 && (
                  <div>
                    <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                      🧠 Assessment
                    </h5>
                    <div className="space-y-4">
                      {module.assessment.quizQuestions.map((question, qIndex) => (
                        <div key={qIndex} className="bg-gray-50 dark:bg-gray-700 rounded p-4">
                          <div className="font-medium text-gray-900 dark:text-white text-sm mb-3">
                            {question.question}
                          </div>
                          <div className="space-y-2">
                            {question.options?.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`text-sm p-2 rounded ${
                                  optIndex === question.correctAnswer
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                    : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                                {optIndex === question.correctAnswer && (
                                  <span className="ml-2 text-green-600 dark:text-green-400">✓ Correct</span>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                            <strong>Explanation:</strong> {question.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 