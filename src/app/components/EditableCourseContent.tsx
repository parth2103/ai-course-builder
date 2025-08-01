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
        <div className="flex items-center space-x-2">
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder={placeholder}
            autoFocus
          />
          <button
            onClick={handleSave}
            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
          >
            ✓
          </button>
          <button
            onClick={handleCancel}
            className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
          >
            ✕
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between group">
        <span className="text-gray-900 dark:text-white">{value || placeholder}</span>
        <button
          onClick={() => setEditingField(fieldName)}
          className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-opacity"
        >
          ✏️
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

              {/* Existing Resources */}
              <div className="space-y-4">
                {/* Videos */}
                {outline.modules[activeModule].resources?.videos?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Videos</h4>
                    <div className="space-y-2">
                      {outline.modules[activeModule].resources.videos.map((video: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{video.title}</span>
                          <button
                            onClick={() => removeResource(activeModule, 'videos', index)}
                            className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                          >
                            Remove
                          </button>
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
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{doc.title}</span>
                          <button
                            onClick={() => removeResource(activeModule, 'documents', index)}
                            className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                          >
                            Remove
                          </button>
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
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{link.title}</span>
                          <button
                            onClick={() => removeResource(activeModule, 'externalLinks', index)}
                            className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 