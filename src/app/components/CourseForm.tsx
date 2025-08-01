'use client';

import React, { useState, useEffect } from 'react';

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => void;
  loading: boolean;
}

export interface CourseFormData {
  topic: string;
  modules: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningStyle: 'visual' | 'audio' | 'hands-on' | 'mixed';
  duration: number; // in hours
  prerequisites: string;
}

export default function CourseForm({ onSubmit, loading }: CourseFormProps) {
  const [topic, setTopic] = useState('');
  const [modules, setModules] = useState(4);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [learningStyle, setLearningStyle] = useState<'visual' | 'audio' | 'hands-on' | 'mixed'>('mixed');
  const [duration, setDuration] = useState(20);
  const [prerequisites, setPrerequisites] = useState('');
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
    if (loading) {
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
  }, [loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      return;
    }

    onSubmit({
      topic: topic.trim(),
      modules,
      difficulty,
      learningStyle,
      duration,
      prerequisites
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course Topic */}
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Course Topic *
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Introduction to Web Security, Machine Learning Basics, Digital Marketing..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={loading}
            required
          />
        </div>

        {/* Number of Modules */}
        <div>
          <label htmlFor="modules" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Number of Modules
          </label>
          <select
            id="modules"
            value={modules}
            onChange={(e) => setModules(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={loading}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} Module{num !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Level */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Difficulty Level
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={loading}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Learning Style */}
        <div>
          <label htmlFor="learningStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Learning Style Preference
          </label>
          <select
            id="learningStyle"
            value={learningStyle}
            onChange={(e) => setLearningStyle(e.target.value as 'visual' | 'audio' | 'hands-on' | 'mixed')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={loading}
          >
            <option value="mixed">Mixed (Recommended)</option>
            <option value="visual">Visual</option>
            <option value="audio">Audio</option>
            <option value="hands-on">Hands-on</option>
          </select>
        </div>

        {/* Course Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estimated Course Duration (hours)
          </label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 20)}
            min="1"
            max="200"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={loading}
          />
        </div>

        {/* Prerequisites */}
        <div>
          <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prerequisites (Optional)
          </label>
          <textarea
            id="prerequisites"
            value={prerequisites}
            onChange={(e) => setPrerequisites(e.target.value)}
            placeholder="e.g., Basic computer skills, familiarity with web browsers..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Course Outline...
            </>
          ) : (
            'Generate Course Outline'
          )}
        </button>

        {/* Progress Bar */}
        {loading && (
          <div className="mt-4 space-y-3">
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
        )}
      </form>
  );
} 