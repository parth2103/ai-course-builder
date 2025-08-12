'use client';

import { useState } from 'react';
import FileUpload from './FileUpload';

interface EditableCourseContentProps {
  outline: any;
  onOutlineChange: (outline: any) => void;
}

export default function EditableCourseContent({ outline, onOutlineChange }: EditableCourseContentProps) {
  const [activeModule, setActiveModule] = useState(0);
  const [editingField, setEditingField] = useState<string | null>(null);

  const updateOutline = (updates: any) => {
    onOutlineChange({ ...outline, ...updates });
  };

  const updateModule = (moduleIndex: number, updates: any) => {
    const newModules = [...outline.modules];
    newModules[moduleIndex] = { ...newModules[moduleIndex], ...updates };
    updateOutline({ modules: newModules });
  };

  const addResource = (moduleIndex: number, resourceType: 'videos' | 'documents' | 'externalLinks', resource: any) => {
    const newModules = [...outline.modules];
    if (!newModules[moduleIndex].resources) {
      newModules[moduleIndex].resources = { videos: [], documents: [], externalLinks: [] };
    }
    if (!newModules[moduleIndex].resources[resourceType]) {
      newModules[moduleIndex].resources[resourceType] = [];
    }
    newModules[moduleIndex].resources[resourceType].push(resource);
    updateOutline({ modules: newModules });
  };

  const removeResource = (moduleIndex: number, resourceType: 'videos' | 'documents' | 'externalLinks', resourceIndex: number) => {
    const newModules = [...outline.modules];
    newModules[moduleIndex].resources[resourceType].splice(resourceIndex, 1);
    updateOutline({ modules: newModules });
  };

  const updateResource = (moduleIndex: number, resourceType: 'videos' | 'documents' | 'externalLinks', resourceIndex: number, updates: any) => {
    const newModules = [...outline.modules];
    newModules[moduleIndex].resources[resourceType][resourceIndex] = {
      ...newModules[moduleIndex].resources[resourceType][resourceIndex],
      ...updates
    };
    updateOutline({ modules: newModules });
  };

  const addAssessmentQuestion = (moduleIndex: number, question: any) => {
    const newModules = [...outline.modules];
    if (!newModules[moduleIndex].assessment) {
      newModules[moduleIndex].assessment = { quizQuestions: [] };
    }
    if (!newModules[moduleIndex].assessment.quizQuestions) {
      newModules[moduleIndex].assessment.quizQuestions = [];
    }
    newModules[moduleIndex].assessment.quizQuestions.push(question);
    updateOutline({ modules: newModules });
  };

  const updateAssessmentQuestion = (moduleIndex: number, questionIndex: number, updates: any) => {
    const newModules = [...outline.modules];
    newModules[moduleIndex].assessment.quizQuestions[questionIndex] = {
      ...newModules[moduleIndex].assessment.quizQuestions[questionIndex],
      ...updates
    };
    updateOutline({ modules: newModules });
  };

  const removeAssessmentQuestion = (moduleIndex: number, questionIndex: number) => {
    const newModules = [...outline.modules];
    newModules[moduleIndex].assessment.quizQuestions.splice(questionIndex, 1);
    updateOutline({ modules: newModules });
  };

  const handleFileUpload = (moduleIndex: number, file: File) => {
    const resource = {
      title: file.name,
      description: `Uploaded file: ${file.name}`,
      type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'document',
      url: URL.createObjectURL(file), // In real app, this would be the uploaded file URL
      size: file.size,
      uploadedAt: new Date().toISOString()
    };
    addResource(moduleIndex, 'documents', resource);
  };

  const EditableField = ({ 
    value, 
    onSave, 
    fieldName, 
    type = 'text',
    placeholder = 'Enter value...'
  }: {
    value: string;
    onSave: (value: string) => void;
    fieldName: string;
    type?: string;
    placeholder?: string;
  }) => {
    const [editValue, setEditValue] = useState(value);

    const handleSave = () => {
      onSave(editValue);
      setEditingField(null);
    };

    const handleCancel = () => {
      setEditValue(value);
      setEditingField(null);
    };

    if (editingField === fieldName) {
      return (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={placeholder}
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              ✓ Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
        <span className="text-gray-900 dark:text-white flex-1">{value || placeholder}</span>
        <button
          onClick={() => setEditingField(fieldName)}
          className="ml-3 px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
        >
          ✏️ Edit
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Course Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Course Overview
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Course Title
            </label>
            <EditableField
              value={outline.courseTitle}
              onSave={(value) => updateOutline({ courseTitle: value })}
              fieldName="courseTitle"
              placeholder="Enter course title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <EditableField
              value={outline.description}
              onSave={(value) => updateOutline({ description: value })}
              fieldName="description"
              type="textarea"
              placeholder="Enter course description..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Duration (hours)
              </label>
              <EditableField
                value={outline.totalDuration?.toString() || ''}
                onSave={(value) => updateOutline({ totalDuration: parseInt(value) || 0 })}
                fieldName="totalDuration"
                type="number"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Prerequisites
        </h2>
        <div className="space-y-2">
          {outline.prerequisites?.map((prereq: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <EditableField
                value={prereq}
                onSave={(value) => {
                  const newPrereqs = [...outline.prerequisites];
                  newPrereqs[index] = value;
                  updateOutline({ prerequisites: newPrereqs });
                }}
                fieldName={`prereq-${index}`}
                placeholder="Enter prerequisite..."
              />
              <button
                onClick={() => {
                  const newPrereqs = outline.prerequisites.filter((_: string, i: number) => i !== index);
                  updateOutline({ prerequisites: newPrereqs });
                }}
                className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newPrereqs = [...(outline.prerequisites || []), ''];
              updateOutline({ prerequisites: newPrereqs });
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            + Add Prerequisite
          </button>
        </div>
      </div>

      {/* Learning Outcomes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Learning Outcomes
        </h2>
        <div className="space-y-2">
          {outline.learningOutcomes?.map((outcome: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <EditableField
                value={outcome}
                onSave={(value) => {
                  const newOutcomes = [...outline.learningOutcomes];
                  newOutcomes[index] = value;
                  updateOutline({ learningOutcomes: newOutcomes });
                }}
                fieldName={`outcome-${index}`}
                placeholder="Enter learning outcome..."
              />
              <button
                onClick={() => {
                  const newOutcomes = outline.learningOutcomes.filter((_: string, i: number) => i !== index);
                  updateOutline({ learningOutcomes: newOutcomes });
                }}
                className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newOutcomes = [...(outline.learningOutcomes || []), ''];
              updateOutline({ learningOutcomes: newOutcomes });
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            + Add Learning Outcome
          </button>
        </div>
      </div>

      {/* Modules */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Course Modules
        </h2>
        
        {/* Module Navigation */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {outline.modules?.map((module: any, index: number) => (
            <button
              key={index}
              onClick={() => setActiveModule(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                activeModule === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Module {index + 1}
            </button>
          ))}
        </div>

        {/* Active Module Content */}
        {outline.modules?.[activeModule] && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Module Title
              </label>
              <EditableField
                value={outline.modules[activeModule].title}
                onSave={(value) => updateModule(activeModule, { title: value })}
                fieldName={`module-title-${activeModule}`}
                placeholder="Enter module title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estimated Duration (minutes)
              </label>
              <EditableField
                value={outline.modules[activeModule].estimatedDuration?.toString() || ''}
                onSave={(value) => updateModule(activeModule, { estimatedDuration: parseInt(value) || 0 })}
                fieldName={`module-duration-${activeModule}`}
                type="number"
                placeholder="0"
              />
            </div>

            {/* Learning Objectives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Learning Objectives
              </label>
              <div className="space-y-2">
                {outline.modules[activeModule].learningObjectives?.map((objective: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <EditableField
                      value={objective}
                      onSave={(value) => {
                        const newObjectives = [...outline.modules[activeModule].learningObjectives];
                        newObjectives[index] = value;
                        updateModule(activeModule, { learningObjectives: newObjectives });
                      }}
                      fieldName={`objective-${activeModule}-${index}`}
                      placeholder="Enter learning objective..."
                    />
                    <button
                      onClick={() => {
                        const newObjectives = outline.modules[activeModule].learningObjectives.filter((_: string, i: number) => i !== index);
                        updateModule(activeModule, { learningObjectives: newObjectives });
                      }}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newObjectives = [...(outline.modules[activeModule].learningObjectives || []), ''];
                    updateModule(activeModule, { learningObjectives: newObjectives });
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  + Add Learning Objective
                </button>
              </div>
            </div>

            {/* Resources */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resources
              </label>
              
              {/* File Upload */}
              <div className="mb-4">
                <FileUpload
                  onFileUpload={(file) => handleFileUpload(activeModule, file)}
                  label="Upload Course Material"
                />
              </div>

              {/* Add New Resource */}
              <div className="mb-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Add New Resource</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      const newVideo = {
                        title: 'New Video',
                        description: 'Video description',
                        url: 'https://youtube.com/watch?v=',
                        duration: '10:00'
                      };
                      addResource(activeModule, 'videos', newVideo);
                    }}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">🎥</div>
                    <div className="text-sm font-medium">Add Video</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      const newLink = {
                        title: 'New External Link',
                        description: 'Link description',
                        url: 'https://example.com'
                      };
                      addResource(activeModule, 'externalLinks', newLink);
                    }}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">🔗</div>
                    <div className="text-sm font-medium">Add Link</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      const newDoc = {
                        title: 'New Document',
                        description: 'Document description',
                        url: '#',
                        type: 'pdf'
                      };
                      addResource(activeModule, 'documents', newDoc);
                    }}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">📄</div>
                    <div className="text-sm font-medium">Add Document</div>
                  </button>
                </div>
              </div>

              {/* Existing Resources */}
              <div className="space-y-4">
                {/* Videos */}
                {outline.modules[activeModule].resources?.videos?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Videos</h4>
                    <div className="space-y-2">
                      {outline.modules[activeModule].resources.videos.map((video: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <EditableField
                              value={video.title}
                              onSave={(value) => updateResource(activeModule, 'videos', index, { title: value })}
                              fieldName={`video-title-${activeModule}-${index}`}
                              placeholder="Video title..."
                            />
                            <button
                              onClick={() => removeResource(activeModule, 'videos', index)}
                              className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                          <EditableField
                            value={video.url}
                            onSave={(value) => updateResource(activeModule, 'videos', index, { url: value })}
                            fieldName={`video-url-${activeModule}-${index}`}
                            placeholder="Video URL..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {outline.modules[activeModule].resources?.documents?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Documents</h4>
                    <div className="space-y-2">
                      {outline.modules[activeModule].resources.documents.map((doc: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <EditableField
                              value={doc.title}
                              onSave={(value) => updateResource(activeModule, 'documents', index, { title: value })}
                              fieldName={`doc-title-${activeModule}-${index}`}
                              placeholder="Document title..."
                            />
                            <button
                              onClick={() => removeResource(activeModule, 'documents', index)}
                              className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                          <EditableField
                            value={doc.url}
                            onSave={(value) => updateResource(activeModule, 'documents', index, { url: value })}
                            fieldName={`doc-url-${activeModule}-${index}`}
                            placeholder="Document URL..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* External Links */}
                {outline.modules[activeModule].resources?.externalLinks?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">External Links</h4>
                    <div className="space-y-2">
                      {outline.modules[activeModule].resources.externalLinks.map((link: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <EditableField
                              value={link.title}
                              onSave={(value) => updateResource(activeModule, 'externalLinks', index, { title: value })}
                              fieldName={`link-title-${activeModule}-${index}`}
                              placeholder="Link title..."
                            />
                            <button
                              onClick={() => removeResource(activeModule, 'externalLinks', index)}
                              className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                          <EditableField
                            value={link.url}
                            onSave={(value) => updateResource(activeModule, 'externalLinks', index, { url: value })}
                            fieldName={`link-url-${activeModule}-${index}`}
                            placeholder="Link URL..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Assessment Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assessment Questions
              </label>
              
              {/* Add New Question */}
              <div className="mb-4">
                <button
                  onClick={() => {
                    const newQuestion = {
                      question: 'New question?',
                      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                      correctAnswer: 0,
                      explanation: 'Explanation for the correct answer'
                    };
                    addAssessmentQuestion(activeModule, newQuestion);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add Assessment Question
                </button>
              </div>

              {/* Existing Questions */}
              {outline.modules[activeModule].assessment?.quizQuestions?.length > 0 && (
                <div className="space-y-4">
                  {outline.modules[activeModule].assessment.quizQuestions.map((question: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900 dark:text-white">Question {index + 1}</h5>
                        <button
                          onClick={() => removeAssessmentQuestion(activeModule, index)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      
                      {/* Question Text */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Question
                        </label>
                        <EditableField
                          value={question.question}
                          onSave={(value) => updateAssessmentQuestion(activeModule, index, { question: value })}
                          fieldName={`question-${activeModule}-${index}`}
                          placeholder="Enter question..."
                        />
                      </div>

                      {/* Options */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Options
                        </label>
                        <div className="space-y-2">
                          {question.options?.map((option: string, optionIndex: number) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`correct-${activeModule}-${index}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() => updateAssessmentQuestion(activeModule, index, { correctAnswer: optionIndex })}
                                className="text-blue-600"
                              />
                              <EditableField
                                value={option}
                                onSave={(value) => {
                                  const newOptions = [...question.options];
                                  newOptions[optionIndex] = value;
                                  updateAssessmentQuestion(activeModule, index, { options: newOptions });
                                }}
                                fieldName={`option-${activeModule}-${index}-${optionIndex}`}
                                placeholder={`Option ${optionIndex + 1}...`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Explanation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Explanation
                        </label>
                        <EditableField
                          value={question.explanation}
                          onSave={(value) => updateAssessmentQuestion(activeModule, index, { explanation: value })}
                          fieldName={`explanation-${activeModule}-${index}`}
                          placeholder="Enter explanation..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 