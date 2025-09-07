'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import DottedBackground from '../../components/DottedBackground';

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: number;
  category: string;
  instructorId: string;
  status: string;
  outline?: any;
  enrolledStudents?: number;
  rating?: number;
}

interface Enrollment {
  id: string;
  courseId: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  enrolledAt: string;
  detailedProgress?: any;
}

export default function CourseDetails() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'progress' | 'certificate' | 'preview'>('overview');
  const [isUnenrolling, setIsUnenrolling] = useState(false);

  // Check user role
  const userRole = user?.publicMetadata?.role as string;
  const isInstructor = userRole === 'instructor' || userRole === 'admin';


  useEffect(() => {
    if (courseId && user) {
      loadCourseDetails();
      checkEnrollment();
    }
  }, [courseId, user]);

  const loadCourseDetails = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const courseData = await response.json();
        setCourse(courseData);
      } else {
        router.push('/marketplace');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      router.push('/marketplace');
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
          setEnrollment(data.enrollment);
          
          // Load detailed progress
          const progressResponse = await fetch(`/api/enrollments/detailed-progress/${courseId}`);
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            setEnrollment(prev => ({
              ...prev!,
              detailedProgress: progressData.detailedProgress
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleUnenroll = async () => {
    if (!confirm('Are you sure you want to leave this course? Your progress will be saved but you will lose access to course materials.')) {
      return;
    }

    setIsUnenrolling(true);
    try {
      const response = await fetch('/api/unenroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      });

      if (response.ok) {
        alert('Successfully left the course.');
        setIsEnrolled(false);
        setEnrollment(null);
      } else {
        alert('Failed to leave course. Please try again.');
      }
    } catch (error) {
      console.error('Error leaving course:', error);
      alert('Failed to leave course. Please try again.');
    } finally {
      setIsUnenrolling(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCompletionPercentage = () => {
    if (!enrollment) return 0;
    return enrollment.progress || 0;
  };

  const isCompleted = () => {
    return getCompletionPercentage() >= 100;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <DottedBackground />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">The course you're looking for doesn't exist.</p>
        <Link href="/marketplace" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <DottedBackground />
      <div className="relative z-10 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">{course.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
                {course.difficulty || 'Beginner'}
              </span>
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {course.duration} hours
              </span>
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {course.enrolledStudents || 0} students
              </span>
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {course.category || 'General'}
              </span>
            </div>

            {/* Enrollment Status */}
            {isEnrolled && enrollment && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Progress</span>
                  <span className="text-lg font-bold text-blue-600">{getCompletionPercentage()}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {enrollment.completedLessons || 0} of {enrollment.totalLessons || 0} lessons completed
                </div>
                {isCompleted() && (
                  <div className="mt-2 flex items-center text-green-600 dark:text-green-400">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Course Completed!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 lg:w-64">
            {isEnrolled ? (
              <>
                <Link
                  href={`/hub/student/learning/${courseId}`}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center transition-colors"
                >
                  Continue Learning
                </Link>
                {isCompleted() && (
                  <button
                    onClick={() => {/* Certificate functionality */}}
                    className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    View Certificate
                  </button>
                )}
                <button
                  onClick={handleUnenroll}
                  disabled={isUnenrolling}
                  className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors"
                >
                  {isUnenrolling ? 'Leaving...' : 'Leave Course'}
                </button>
              </>
            ) : isInstructor ? (
              <button
                onClick={() => alert('You cannot enroll in courses as an instructor. Only students can enroll in courses.')}
                className="w-full px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium text-center transition-colors cursor-not-allowed"
              >
                Cannot Enroll (Instructor)
              </button>
            ) : (
              <button
                onClick={async () => {
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
                      // Reload to update enrollment status
                      window.location.reload();
                    } else {
                      const errorData = await response.json();
                      alert(errorData.error || 'Failed to enroll in course');
                    }
                  } catch (error) {
                    console.error('Enrollment error:', error);
                    alert('Failed to enroll in course. Please try again.');
                  }
                }}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center transition-colors"
              >
                Enroll in Course
              </button>
            )}
            <Link
              href="/hub/student/learning"
              className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium text-center transition-colors"
            >
              Back to My Learning
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50">
        <div className="border-b border-gray-200/50 dark:border-gray-700/50">
          <nav className="flex space-x-1 p-1">
            {['overview', 'syllabus', ...(!isEnrolled ? ['preview'] : []), ...(isEnrolled ? ['progress'] : []), ...(isCompleted() ? ['certificate'] : [])].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 capitalize ${
                  activeTab === tab
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Overview</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{course.description}</p>
              </div>

              {course.outline?.learningOutcomes && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Learning Outcomes</h4>
                  <ul className="space-y-2">
                    {course.outline.learningOutcomes.map((outcome: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {course.outline?.prerequisites && course.outline.prerequisites.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Prerequisites</h4>
                  <ul className="space-y-2">
                    {course.outline.prerequisites.map((prereq: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Syllabus Tab */}
          {activeTab === 'syllabus' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Course Syllabus</h3>
              
              {course.outline?.modules && course.outline.modules.length > 0 ? (
                <div className="space-y-4">
                  {course.outline.modules.map((module: any, index: number) => (
                    <div key={index} className="border border-gray-200/50 dark:border-gray-600/50 rounded-lg p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          Module {index + 1}: {module.title}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {module.estimatedDuration} minutes
                        </span>
                      </div>
                      
                      {module.learningObjectives && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Learning Objectives:</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {module.learningObjectives.map((objective: string, objIndex: number) => (
                              <li key={objIndex} className="flex items-start space-x-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {module.bulletPoints && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Topics:</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {module.bulletPoints.map((point: string, pointIndex: number) => (
                              <li key={pointIndex} className="flex items-start space-x-2">
                                <span className="text-green-600 mt-0.5">✓</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Preview Resources for Non-Enrolled Users */}
                      {!isEnrolled && index === 0 && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                          <h6 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">🔍 Preview Sample Resources:</h6>
                          
                          {/* Sample Video Preview */}
                          {module.resources?.videos && module.resources.videos.length > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                                <span>📹</span>
                                <span className="font-medium">{module.resources.videos[0].title}</span>
                                <span className="text-xs text-blue-600 dark:text-blue-400">({module.resources.videos[0].duration} min)</span>
                              </div>
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 ml-6">{module.resources.videos[0].description}</p>
                            </div>
                          )}

                          {/* Sample Documents Preview */}
                          {module.resources?.documents && module.resources.documents.length > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                                <span>📄</span>
                                <span className="font-medium">{module.resources.documents[0].title}</span>
                              </div>
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 ml-6">{module.resources.documents[0].description}</p>
                            </div>
                          )}

                          {/* Sample Quiz Preview */}
                          {module.assessment?.quizQuestions && module.assessment.quizQuestions.length > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                                <span>❓</span>
                                <span className="font-medium">Sample Quiz:</span>
                              </div>
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 ml-6">"{module.assessment.quizQuestions[0].question}"</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-blue-200 dark:border-blue-700">
                            <p className="text-xs text-blue-600 dark:text-blue-400 italic">
                              ✨ Enroll to access all videos, documents, quizzes, and interactive content!
                            </p>
                            <span className="text-xs text-blue-500 dark:text-blue-400 font-medium">
                              +{(module.resources?.videos?.length || 0) + (module.resources?.documents?.length || 0) + (module.assessment?.quizQuestions?.length || 0) - 3} more resources
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">Course syllabus is being prepared.</p>
              )}
            </div>
          )}

          {/* Preview Tab - Only for non-enrolled users */}
          {activeTab === 'preview' && !isEnrolled && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Course Content Preview</h3>
                <p className="text-gray-600 dark:text-gray-400">Get a sneak peek at what you'll learn in this course!</p>
              </div>

              {course.outline?.modules && course.outline.modules.length > 0 && (
                <div className="space-y-4">
                  {course.outline.modules.slice(0, 2).map((module: any, index: number) => (
                    <div key={index} className="border border-gray-200/50 dark:border-gray-600/50 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          Module {index + 1}: {module.title}
                        </h4>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                          {module.estimatedDuration} min
                        </span>
                      </div>
                      
                      {/* Sample Resources */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {/* Video Preview */}
                        {module.resources?.videos && module.resources.videos[0] && (
                          <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                            <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">
                              <span className="mr-2">🎬</span>
                              Video Content
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{module.resources.videos[0].title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{module.resources.videos[0].description}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Duration: {module.resources.videos[0].duration} minutes</p>
                          </div>
                        )}

                        {/* Document Preview */}
                        {module.resources?.documents && module.resources.documents[0] && (
                          <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg border border-green-200/50 dark:border-green-700/50">
                            <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium mb-2">
                              <span className="mr-2">📚</span>
                              Study Material
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{module.resources.documents[0].title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{module.resources.documents[0].description}</p>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-2">Format: {module.resources.documents[0].type?.toUpperCase()}</p>
                          </div>
                        )}

                        {/* Quiz Preview */}
                        {module.assessment?.quizQuestions && module.assessment.quizQuestions[0] && (
                          <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                            <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium mb-2">
                              <span className="mr-2">🧠</span>
                              Interactive Quiz
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">Sample Question</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">"{module.assessment.quizQuestions[0].question}"</p>
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">{module.assessment.quizQuestions.length} total questions</p>
                          </div>
                        )}
                      </div>

                      {/* Resource Count */}
                      <div className="mt-4 p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded text-center">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          This module includes {module.resources?.videos?.length || 0} videos, {module.resources?.documents?.length || 0} documents, 
                          {module.resources?.externalLinks?.length || 0} external resources, and {module.assessment?.quizQuestions?.length || 0} quiz questions
                        </p>
                      </div>
                    </div>
                  ))}

                  {course.outline.modules.length > 2 && (
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        +{course.outline.modules.length - 2} More Modules Available!
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Unlock access to all {course.outline.modules.length} modules with comprehensive learning materials, interactive quizzes, and expert guidance.
                      </p>
                      <div className="flex justify-center">
                        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                          🚀 Enroll Now to Access Everything!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && isEnrolled && enrollment && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Learning Progress</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{getCompletionPercentage()}%</div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">Overall Progress</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{enrollment.completedLessons || 0}</div>
                  <div className="text-sm text-green-800 dark:text-green-200">Lessons Completed</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{enrollment.totalLessons || 0}</div>
                  <div className="text-sm text-purple-800 dark:text-purple-200">Total Lessons</div>
                </div>
              </div>

              {/* Module Progress */}
              {course.outline?.modules && enrollment.detailedProgress?.completedModules && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Module Progress</h4>
                  <div className="space-y-3">
                    {course.outline.modules.map((module: any, index: number) => {
                      const isCompleted = enrollment.detailedProgress?.completedModules?.includes(index);
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                              isCompleted 
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                                : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
                            }`}>
                              {isCompleted ? '✓' : index + 1}
                            </div>
                            <span className="text-gray-900 dark:text-white font-medium">{module.title}</span>
                          </div>
                          <span className={`text-sm px-2 py-1 rounded ${
                            isCompleted 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
                          }`}>
                            {isCompleted ? 'Completed' : 'Not Started'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
              </div>
            </div>
          )}

          {/* Certificate Tab */}
          {activeTab === 'certificate' && isCompleted() && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Course Completion Certificate</h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">
                  <svg className="w-16 h-16 mx-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Congratulations!</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You have successfully completed <strong>{course.title}</strong>
                </p>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 mb-6 text-left">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Course Completion Summary:</h5>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>✓ Completed all {enrollment?.totalLessons || 0} lessons</li>
                    <li>✓ Achieved {getCompletionPercentage()}% completion rate</li>
                    <li>✓ Demonstrated proficiency in {course.outline?.modules?.length || 0} modules</li>
                    <li>✓ Total learning time: {course.duration} hours</li>
                  </ul>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Download Certificate
                </button>
              </div>

              {course.outline?.learningOutcomes && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills Acquired</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.outline.learningOutcomes.map((outcome: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <svg className="w-5 h-5 text-green-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}