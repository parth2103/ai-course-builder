'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRoleAccess } from '../../../../hooks/useRoleAccess';
import VideoPlayer from '../../../../components/VideoPlayer';

interface CourseOutline {
  courseTitle: string;
  description: string;
  totalDuration: number;
  modules: any[];
  prerequisites: string[];
  learningOutcomes: string[];
}

interface Module {
  title: string;
  bulletPoints: string[];
  learningObjectives: string[];
  estimatedDuration: number;
  resources: {
    videos: any[];
    documents: any[];
    externalLinks: any[];
  };
  assessment: {
    quizQuestions: any[];
  };
}

export default function StudentLearning() {
  const { isStudent } = useRoleAccess();
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<any>(null);
  const [outline, setOutline] = useState<CourseOutline | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [key: string]: boolean }>({});
  const [quizResults, setQuizResults] = useState<{ [key: string]: { correct: number; total: number } }>({});

  const loadCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const courseData = await response.json();
        setCourse(courseData);
        setOutline(courseData.outline);
      } else {
        console.error('Failed to load course');
        router.push('/hub/student/learning');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      router.push('/hub/student/learning');
    } finally {
      setIsLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await fetch(`/api/enrollments/check/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setIsEnrolled(data.isEnrolled);
        if (data.enrollment) {
          setCurrentProgress(data.enrollment.progress || 0);
        }
        
        // Load detailed progress if available
        if (data.detailedProgress) {
          setCompletedModules(data.detailedProgress.completedModules || []);
          setQuizResults(data.detailedProgress.quizResults || {});
          setQuizAnswers(data.detailedProgress.quizAnswers || {});
          setQuizSubmitted(data.detailedProgress.quizSubmitted || {});
        }
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const loadDetailedProgress = async () => {
    try {
      const response = await fetch(`/api/enrollments/detailed-progress/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        const detailedProgress = data.detailedProgress || {};
        
        // Load saved progress data
        setCompletedModules(detailedProgress.completedModules || []);
        setQuizResults(detailedProgress.quizResults || {});
        setQuizAnswers(detailedProgress.quizAnswers || {});
        setQuizSubmitted(detailedProgress.quizSubmitted || {});
        
        // Update current progress
        if (data.enrollment) {
          setCurrentProgress(data.enrollment.progress || 0);
        }
      }
    } catch (error) {
      console.error('Error loading detailed progress:', error);
    }
  };

  useEffect(() => {
    if (courseId) {
      loadCourse();
      checkEnrollment();
      loadDetailedProgress();
    }
  }, [courseId]);

  const markModuleComplete = async (moduleIndex: number) => {
    if (!completedModules.includes(moduleIndex)) {
      const newCompletedModules = [...completedModules, moduleIndex];
      setCompletedModules(newCompletedModules);
      
      // Calculate new progress
      const totalModules = outline?.modules?.length || 1;
      const newProgress = Math.round((newCompletedModules.length / totalModules) * 100);
      setCurrentProgress(newProgress);
      
      // Save all progress data to database
      try {
        await fetch(`/api/enrollments/detailed-progress/${courseId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            progress: newProgress,
            completedLessons: newCompletedModules.length,
            completedModules: newCompletedModules,
            quizResults,
            quizAnswers,
            quizSubmitted
          }),
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const getModuleProgress = (moduleIndex: number) => {
    return completedModules.includes(moduleIndex) ? 100 : 0;
  };

  const handleModuleChange = (moduleIndex: number) => {
    setCurrentModule(moduleIndex);
    // Reset quiz state for the new module
    const moduleKey = `module-${moduleIndex}`;
    if (!quizSubmitted[moduleKey]) {
      setQuizAnswers(prev => {
        const newAnswers = { ...prev };
        // Clear answers for this module
        Object.keys(newAnswers).forEach(key => {
          if (key.startsWith(`module-${moduleIndex}-`)) {
            delete newAnswers[key];
          }
        });
        return newAnswers;
      });
    }
  };

  const handleQuizAnswerChange = (questionIndex: number, answerIndex: number) => {
    const answerKey = `module-${currentModule}-question-${questionIndex}`;
    setQuizAnswers(prev => ({
      ...prev,
      [answerKey]: answerIndex
    }));
  };

  const handleQuizSubmit = async () => {
    const moduleKey = `module-${currentModule}`;
    const questions = outline?.modules?.[currentModule]?.assessment?.quizQuestions || [];
    
    let correctAnswers = 0;
    questions.forEach((question: any, index: number) => {
      const answerKey = `module-${currentModule}-question-${index}`;
      const userAnswer = quizAnswers[answerKey];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const newQuizResults = {
      ...quizResults,
      [moduleKey]: {
        correct: correctAnswers,
        total: questions.length
      }
    };

    const newQuizSubmitted = {
      ...quizSubmitted,
      [moduleKey]: true
    };

    setQuizResults(newQuizResults);
    setQuizSubmitted(newQuizSubmitted);

    // Save quiz results to database
    try {
      await fetch(`/api/enrollments/detailed-progress/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progress: currentProgress,
          completedLessons: completedModules.length,
          completedModules,
          quizResults: newQuizResults,
          quizAnswers,
          quizSubmitted: newQuizSubmitted
        }),
      });
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  };

  const canSubmitQuiz = () => {
    const questions = outline?.modules?.[currentModule]?.assessment?.quizQuestions || [];
    const moduleKey = `module-${currentModule}`;
    
    if (quizSubmitted[moduleKey]) return false;
    
    return questions.every((_: any, index: number) => {
      const answerKey = `module-${currentModule}-question-${index}`;
      return quizAnswers[answerKey] !== undefined;
    });
  };

  if (!isStudent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This section is only available for students.
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
          The course you're looking for doesn't exist.
        </p>
        <button
          onClick={() => router.push('/hub/student/learning')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Back to My Learning
        </button>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Not Enrolled
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You need to enroll in this course to access its content.
        </p>
        <button
          onClick={() => router.push('/marketplace')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Browse Courses
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
              {course.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {course.description}
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                📚 {outline?.modules?.length || 0} modules
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ⏱️ {course.duration} hours
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                📊 {course.difficulty} level
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Enrolled
            </span>
          </div>
        </div>
        
        {/* Overall Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">{currentProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Module Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Course Modules
            </h3>
            <div className="space-y-2">
              {outline?.modules?.map((module: Module, index: number) => (
                <button
                  key={index}
                  onClick={() => handleModuleChange(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentModule === index
                      ? 'bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        Module {index + 1}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {module.title}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {completedModules.includes(index) && (
                        <span className="text-green-600 text-sm">✅</span>
                      )}
                      <div className="w-8 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getModuleProgress(index)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Module Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {outline?.modules?.[currentModule] ? (
              <div className="space-y-6">
                {/* Module Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {outline.modules[currentModule].title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Estimated Duration: {outline.modules[currentModule].estimatedDuration} minutes
                  </p>
                </div>

                {/* Learning Objectives */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Learning Objectives
                  </h3>
                  <ul className="space-y-2">
                    {outline.modules[currentModule].learningObjectives?.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Points */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {outline.modules[currentModule].bulletPoints?.map((point: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Learning Resources
                  </h3>
                  
                  {/* Videos */}
                  {outline.modules[currentModule].resources?.videos?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">📹 Video Learning</h4>
                      <div className="space-y-6">
                        {outline.modules[currentModule].resources.videos.map((video: any, index: number) => (
                          <VideoPlayer
                            key={index}
                            title={video.title}
                            description={video.description}
                            url={video.url}
                            duration={video.duration}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {outline.modules[currentModule].resources?.documents?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">📄 Documents</h4>
                      <div className="space-y-2">
                        {outline.modules[currentModule].resources.documents.map((doc: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <h5 className="font-medium text-gray-900 dark:text-white">{doc.title}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{doc.description}</p>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                            >
                              View Document →
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External Links */}
                  {outline.modules[currentModule].resources?.externalLinks?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">🔗 External Resources</h4>
                      <div className="space-y-2">
                        {outline.modules[currentModule].resources.externalLinks.map((link: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <h5 className="font-medium text-gray-900 dark:text-white">{link.title}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{link.description}</p>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                            >
                              Visit Resource →
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Assessment */}
                {outline.modules[currentModule].assessment?.quizQuestions?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Knowledge Check
                    </h3>
                    
                    {/* Quiz Results */}
                    {quizSubmitted[`module-${currentModule}`] && (
                      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                          Quiz Results
                        </h4>
                        <p className="text-blue-800 dark:text-blue-200">
                          You got {quizResults[`module-${currentModule}`]?.correct || 0} out of {quizResults[`module-${currentModule}`]?.total || 0} questions correct!
                        </p>
                        <div className="mt-2 w-full bg-blue-200 dark:bg-blue-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${quizResults[`module-${currentModule}`]?.total ? 
                                (quizResults[`module-${currentModule}`]?.correct || 0) / quizResults[`module-${currentModule}`]?.total * 100 : 0
                              }%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {outline.modules[currentModule].assessment.quizQuestions.map((question: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                            {index + 1}. {question.question}
                          </h4>
                          <div className="space-y-2">
                            {question.options.map((option: string, optionIndex: number) => (
                              <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`question-${currentModule}-${index}`}
                                  value={optionIndex}
                                  checked={quizAnswers[`module-${currentModule}-question-${index}`] === optionIndex}
                                  onChange={() => handleQuizAnswerChange(index, optionIndex)}
                                  className="text-blue-600"
                                  disabled={quizSubmitted[`module-${currentModule}`]}
                                />
                                <span className="text-gray-700 dark:text-gray-300">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Submit Button */}
                    {!quizSubmitted[`module-${currentModule}`] && (
                      <div className="mt-4">
                        <button
                          onClick={handleQuizSubmit}
                          disabled={!canSubmitQuiz()}
                          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                            canSubmitQuiz()
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Submit Quiz
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Module Completion */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <button
                    onClick={() => markModuleComplete(currentModule)}
                    disabled={completedModules.includes(currentModule)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      completedModules.includes(currentModule)
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {completedModules.includes(currentModule) ? '✅ Module Completed' : 'Mark Module as Complete'}
                  </button>
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
                  This course doesn't have any content yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 