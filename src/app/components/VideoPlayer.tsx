'use client';

import { useState, useEffect } from 'react';

interface VideoPlayerProps {
  title: string;
  description: string;
  url: string;
  duration?: number;
  onVideoEnd?: () => void;
  onVideoProgress?: (progress: number) => void;
}

export default function VideoPlayer({ 
  title, 
  description, 
  url, 
  duration, 
  onVideoEnd,
  onVideoProgress 
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract YouTube video ID from URL with enhanced patterns
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtu\.be\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        // Clean the video ID (remove any additional parameters)
        return match[1].split('&')[0].split('?')[0];
      }
    }
    return null;
  };

  // Validate if video ID exists and is embeddable
  const validateYouTubeVideo = async (videoId: string): Promise<boolean> => {
    try {
      // Try to fetch the video page to check if it exists
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
        method: 'GET',
        mode: 'cors'
      });
      return response.ok;
    } catch (error) {
      console.log('Video validation failed, but will still attempt embed:', error);
      return true; // Assume valid if check fails
    }
  };

  useEffect(() => {
    const id = extractYouTubeId(url);
    if (id) {
      setVideoId(id);
      setError(null);
    } else {
      setError('Invalid YouTube URL');
    }
    setIsLoading(false);
  }, [url]);

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Handle external link fallback
  const handleExternalLink = () => {
    // If it's a search URL, try to convert it to a proper watch URL
    if (url.includes('youtube.com/results?search_query=')) {
      // Extract search query and create a direct search on YouTube
      const searchQuery = url.split('search_query=')[1];
      if (searchQuery) {
        const decodedQuery = decodeURIComponent(searchQuery);
        window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank', 'noopener,noreferrer');
        return;
      }
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="bg-gray-300 dark:bg-gray-600 h-48 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !videoId) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <span className="text-red-600 dark:text-red-400 text-2xl">📹</span>
            </div>
          </div>
          <div className="flex-1">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">{title}</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ This video cannot be embedded. Click below to watch on YouTube.
              </p>
            </div>
            <button
              onClick={handleExternalLink}
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Watch on YouTube {duration && `(${duration} min)`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Video Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h5 className="font-medium text-gray-900 dark:text-white mb-2">{title}</h5>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        {duration && (
          <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Duration: {duration} minutes
          </div>
        )}
      </div>

      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
          title={title}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={() => {
            console.log('Iframe failed to load, showing fallback');
            setError('Video cannot be embedded');
          }}
        />
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">Loading video...</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Controls/Info */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Video Learning
            </span>
            <span>•</span>
            <span>Embedded Player</span>
          </div>
          <button
            onClick={handleExternalLink}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Open in YouTube ↗
          </button>
        </div>
      </div>
    </div>
  );
}