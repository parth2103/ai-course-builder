'use client';

import { useState, useRef } from 'react';

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'ppt' | 'doc' | 'image';
  size: number;
  url?: string;
  uploadedAt: Date;
}

interface ResourceUploadProps {
  onFileUpload: (file: UploadedFile) => void;
  onVideoAdd: (video: { title: string; url: string; description: string }) => void;
  onExternalLinkAdd: (link: { title: string; url: string; description: string }) => void;
}

export default function ResourceUpload({ onFileUpload, onVideoAdd, onExternalLinkAdd }: ResourceUploadProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'video' | 'link'>('upload');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    let type: 'pdf' | 'ppt' | 'doc' | 'image' = 'doc';
    if (fileType === 'pdf') type = 'pdf';
    else if (['ppt', 'pptx'].includes(fileType || '')) type = 'ppt';
    else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType || '')) type = 'image';

    const uploadedFile: UploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      type,
      size: file.size,
      uploadedAt: new Date()
    };

    onFileUpload(uploadedFile);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) return;

    onVideoAdd({
      title: videoTitle.trim(),
      url: videoUrl.trim(),
      description: videoDescription.trim()
    });

    setVideoTitle('');
    setVideoUrl('');
    setVideoDescription('');
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle.trim() || !linkUrl.trim()) return;

    onExternalLinkAdd({
      title: linkTitle.trim(),
      url: linkUrl.trim(),
      description: linkDescription.trim()
    });

    setLinkTitle('');
    setLinkUrl('');
    setLinkDescription('');
  };



  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add Resources</h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'upload'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          📁 Upload Files
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'video'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          🎥 Add Video
        </button>
        <button
          onClick={() => setActiveTab('link')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'link'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          🔗 Add Link
        </button>
      </div>

      <div className="p-4">
        {/* File Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span>
                  <span> or drag and drop</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF, PPT, DOC, Images up to 10MB
              </p>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.gif"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Video Tab */}
        {activeTab === 'video' && (
          <form onSubmit={handleVideoSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Video Title *
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Introduction to JavaScript"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                YouTube URL *
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Brief description of the video content..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Add Video
            </button>
          </form>
        )}

        {/* Link Tab */}
        {activeTab === 'link' && (
          <form onSubmit={handleLinkSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Link Title *
              </label>
              <input
                type="text"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., MDN JavaScript Documentation"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL *
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://developer.mozilla.org/..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={linkDescription}
                onChange={(e) => setLinkDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Brief description of the resource..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Add Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 