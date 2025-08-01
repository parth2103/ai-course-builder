'use client';

import { useState } from 'react';

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

interface ModuleContent {
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
    quizQuestions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  };
}

interface ContentCuratorProps {
  module: ModuleContent;
  moduleIndex: number;
  onModuleUpdate: (moduleIndex: number, updatedModule: ModuleContent) => void;
}

export default function ContentCurator({ module, moduleIndex, onModuleUpdate }: ContentCuratorProps) {
  const [editingSection, setEditingSection] = useState<'title' | 'objectives' | 'topics' | 'resources' | 'assessment' | null>(null);
  const [editedModule, setEditedModule] = useState<ModuleContent>(module);

  const handleSave = () => {
    onModuleUpdate(moduleIndex, editedModule);
    setEditingSection(null);
  };

  const handleCancel = () => {
    setEditedModule(module);
    setEditingSection(null);
  };

  const addVideo = () => {
    const newVideo: VideoResource = {
      title: '',
      description: '',
      url: '',
      duration: 0
    };
    setEditedModule({
      ...editedModule,
      resources: {
        ...editedModule.resources,
        videos: [...editedModule.resources.videos, newVideo]
      }
    });
  };

  const updateVideo = (index: number, field: keyof VideoResource, value: string | number) => {
    const updatedVideos = [...editedModule.resources.videos];
    updatedVideos[index] = { ...updatedVideos[index], [field]: value };
    setEditedModule({
      ...editedModule,
      resources: {
        ...editedModule.resources,
        videos: updatedVideos
      }
    });
  };

  const removeVideo = (index: number) => {
    const updatedVideos = editedModule.resources.videos.filter((_, i) => i !== index);
    setEditedModule({
      ...editedModule,
      resources: {
        ...editedModule.resources,
        videos: updatedVideos
      }
    });
  };

  const addDocument = () => {
    const newDocument: DocumentResource = {
      title: '',
      description: '',
      type: 'pdf'
    };
    setEditedModule({
      ...editedModule,
      resources: {
        ...editedModule.resources,
        documents: [...editedModule.resources.documents, newDocument]
      }
    });
  };

  const updateDocument = (index: number, field: keyof DocumentResource, value: string) => {
    const updatedDocuments = [...editedModule.resources.documents];
    updatedDocuments[index] = { ...updatedDocuments[index], [field]: value };
    setEditedModule({
      ...editedModule,
      resources: {
        ...editedModule.resources,
        documents: updatedDocuments
      }
    });
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = editedModule.resources.documents.filter((_, i) => i !== index);
    setEditedModule({
      ...editedModule,
      resources: {
        ...editedModule.resources,
        documents: updatedDocuments
      }
    });
  };

  // External Links logic
  const addExternalLink = () => {
    const newLink: ExternalLink = {
      title: '',
      description: '',
      url: ''
    };
    setEditedModule({
      ...editedModule,
      resources: {
        ...editedModule.resources,
        externalLinks: [...editedModule.resources.externalLinks, newLink]
      }
    });
  };

  const updateExternalLink = (index: number, field: keyof ExternalLink, value: string) => {
    const updatedLinks = [...editedModule.resources.externalLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setEditedModule({
      ...editedModule,
      resources: {
        ...editedModule.resources,
        externalLinks: updatedLinks
      }
    });
  };

  const removeExternalLink = (index: number) => {
    const updatedLinks = editedModule.resources.externalLinks.filter((_, i) => i !== index);
    setEditedModule({
      ...editedModule,
      resources: {
        ...editedModule.resources,
        externalLinks: updatedLinks
      }
    });
  };

  // Assessment logic
  const addQuizQuestion = () => {
    setEditedModule({
      ...editedModule,
      assessment: {
        ...editedModule.assessment,
        quizQuestions: [
          ...editedModule.assessment.quizQuestions,
          {
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: ''
          }
        ]
      }
    });
  };

  const updateQuizQuestion = (index: number, field: keyof (typeof editedModule.assessment.quizQuestions[0]), value: any) => {
    const updatedQuestions = [...editedModule.assessment.quizQuestions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setEditedModule({
      ...editedModule,
      assessment: {
        ...editedModule.assessment,
        quizQuestions: updatedQuestions
      }
    });
  };

  const updateQuizOption = (qIndex: number, optIndex: number, value: string) => {
    const updatedQuestions = [...editedModule.assessment.quizQuestions];
    const updatedOptions = [...updatedQuestions[qIndex].options];
    updatedOptions[optIndex] = value;
    updatedQuestions[qIndex].options = updatedOptions;
    setEditedModule({
      ...editedModule,
      assessment: {
        ...editedModule.assessment,
        quizQuestions: updatedQuestions
      }
    });
  };

  const removeQuizQuestion = (index: number) => {
    const updatedQuestions = editedModule.assessment.quizQuestions.filter((_, i) => i !== index);
    setEditedModule({
      ...editedModule,
      assessment: {
        ...editedModule.assessment,
        quizQuestions: updatedQuestions
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Module {moduleIndex + 1}: {module.title}
          </h3>
          {editingSection && (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Module Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Module Title</h4>
            <button
              onClick={() => setEditingSection(editingSection === 'title' ? null : 'title')}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {editingSection === 'title' ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editingSection === 'title' ? (
            <input
              type="text"
              value={editedModule.title}
              onChange={(e) => setEditedModule({ ...editedModule, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <p className="text-gray-700 dark:text-gray-300">{module.title}</p>
          )}
        </div>

        {/* Learning Objectives */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Learning Objectives</h4>
            <button
              onClick={() => setEditingSection(editingSection === 'objectives' ? null : 'objectives')}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {editingSection === 'objectives' ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editingSection === 'objectives' ? (
            <div className="space-y-2">
              {editedModule.learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => {
                      const updated = [...editedModule.learningObjectives];
                      updated[index] = e.target.value;
                      setEditedModule({ ...editedModule, learningObjectives: updated });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      const updated = editedModule.learningObjectives.filter((_, i) => i !== index);
                      setEditedModule({ ...editedModule, learningObjectives: updated });
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  setEditedModule({
                    ...editedModule,
                    learningObjectives: [...editedModule.learningObjectives, '']
                  });
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Objective
              </button>
            </div>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {module.learningObjectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Resources */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Learning Resources</h4>
            <button
              onClick={() => setEditingSection(editingSection === 'resources' ? null : 'resources')}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {editingSection === 'resources' ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editingSection === 'resources' ? (
            <div className="space-y-4">
              {/* Videos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">🎥 Videos</h5>
                  <button
                    onClick={addVideo}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    + Add Video
                  </button>
                </div>
                <div className="space-y-2">
                  {editedModule.resources.videos.map((video, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded p-3">
                      <div className="grid grid-cols-1 gap-2">
                        <input
                          type="text"
                          placeholder="Video title"
                          value={video.title}
                          onChange={(e) => updateVideo(index, 'title', e.target.value)}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <input
                          type="url"
                          placeholder="YouTube URL"
                          value={video.url || ''}
                          onChange={(e) => updateVideo(index, 'url', e.target.value)}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={video.description}
                          onChange={(e) => updateVideo(index, 'description', e.target.value)}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <div className="flex items-center justify-between">
                          <input
                            type="number"
                            placeholder="Duration (minutes)"
                            value={video.duration || ''}
                            onChange={(e) => updateVideo(index, 'duration', parseInt(e.target.value) || 0)}
                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-32"
                          />
                          <button
                            onClick={() => removeVideo(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">📄 Documents</h5>
                  <button
                    onClick={addDocument}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    + Add Document
                  </button>
                </div>
                <div className="space-y-2">
                  {editedModule.resources.documents.map((doc, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded p-3">
                      <div className="grid grid-cols-1 gap-2">
                        <input
                          type="text"
                          placeholder="Document title"
                          value={doc.title}
                          onChange={(e) => updateDocument(index, 'title', e.target.value)}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={doc.description}
                          onChange={(e) => updateDocument(index, 'description', e.target.value)}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <div className="flex items-center justify-between">
                          <select
                            value={doc.type}
                            onChange={(e) => updateDocument(index, 'type', e.target.value as 'pdf' | 'ppt' | 'doc')}
                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="pdf">PDF</option>
                            <option value="ppt">PowerPoint</option>
                            <option value="doc">Document</option>
                          </select>
                          <button
                            onClick={() => removeDocument(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* External Links */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">🔗 External Links</h5>
                  <button
                    onClick={addExternalLink}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    + Add Link
                  </button>
                </div>
                <div className="space-y-2">
                  {editedModule.resources.externalLinks.map((link, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded p-3">
                      <div className="grid grid-cols-1 gap-2">
                        <input
                          type="text"
                          placeholder="Link title"
                          value={link.title}
                          onChange={(e) => updateExternalLink(index, 'title', e.target.value)}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <input
                          type="url"
                          placeholder="URL"
                          value={link.url || ''}
                          onChange={(e) => updateExternalLink(index, 'url', e.target.value)}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={link.description}
                          onChange={(e) => updateExternalLink(index, 'description', e.target.value)}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => removeExternalLink(index)}
                          className="text-red-600 hover:text-red-800 text-sm mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {module.resources.videos.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🎥 Videos</h5>
                  <div className="space-y-2">
                    {module.resources.videos.map((video, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                        <div className="font-medium text-sm text-gray-900 dark:text-white">{video.title}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{video.description}</div>
                        {video.duration && <div className="text-xs text-gray-500">⏱️ {video.duration} min</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {module.resources.documents.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">📄 Documents</h5>
                  <div className="space-y-2">
                    {module.resources.documents.map((doc, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                        <div className="font-medium text-sm text-gray-900 dark:text-white">{doc.title}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{doc.description}</div>
                        <div className="text-xs text-gray-500">📄 {doc.type.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {module.resources.externalLinks.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🔗 External Links</h5>
                  <div className="space-y-2">
                    {module.resources.externalLinks.map((link, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                        <div className="font-medium text-sm text-gray-900 dark:text-white">{link.title}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{link.description}</div>
                        {link.url && (
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                            {link.url}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Assessment (Quiz Questions) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Assessment (Quiz Questions)</h4>
            <button
              onClick={() => setEditingSection(editingSection === 'assessment' ? null : 'assessment')}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {editingSection === 'assessment' ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editingSection === 'assessment' ? (
            <div className="space-y-4">
              {editedModule.assessment.quizQuestions.map((q, qIndex) => (
                <div key={qIndex} className="border border-gray-200 dark:border-gray-600 rounded p-3 space-y-2">
                  <input
                    type="text"
                    placeholder="Question"
                    value={q.question}
                    onChange={(e) => updateQuizQuestion(qIndex, 'question', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder={`Option ${optIndex + 1}`}
                          value={opt}
                          onChange={(e) => updateQuizOption(qIndex, optIndex, e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswer === optIndex}
                          onChange={() => updateQuizQuestion(qIndex, 'correctAnswer', optIndex)}
                        />
                        <span className="text-xs">Correct</span>
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Explanation"
                    value={q.explanation}
                    onChange={(e) => updateQuizQuestion(qIndex, 'explanation', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => removeQuizQuestion(qIndex)}
                    className="text-red-600 hover:text-red-800 text-sm mt-1"
                  >
                    Remove Question
                  </button>
                </div>
              ))}
              <button
                onClick={addQuizQuestion}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Quiz Question
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {module.assessment.quizQuestions.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400">No quiz questions for this module.</div>
              ) : (
                module.assessment.quizQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                    <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">Q{qIndex + 1}: {q.question}</div>
                    <ul className="list-decimal list-inside text-xs text-gray-700 dark:text-gray-300 mb-1">
                      {q.options.map((opt, optIndex) => (
                        <li key={optIndex} className={q.correctAnswer === optIndex ? 'font-bold text-green-600 dark:text-green-400' : ''}>
                          {opt}
                          {q.correctAnswer === optIndex && ' (Correct)'}
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Explanation: {q.explanation}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 