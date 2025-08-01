'use client';

import { useState } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  label?: string;
}

export default function FileUpload({ 
  onFileUpload, 
  acceptedTypes = ".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov,.avi,.jpg,.jpeg,.png", 
  maxSize = 50,
  label = "Upload File" 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    setUploading(true);
    
    // Simulate file upload (in a real app, you'd upload to a service like AWS S3)
    setTimeout(() => {
      onFileUpload(file);
      setUploading(false);
    }, 1000);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept={acceptedTypes}
          disabled={uploading}
        />
        
        <div className="space-y-2">
          <div className="text-4xl mb-2">
            {uploading ? '⏳' : '📁'}
          </div>
          
          {uploading ? (
            <div>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Uploading...
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Accepted formats: PDF, DOC, PPT, MP4, Images (max {maxSize}MB)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 