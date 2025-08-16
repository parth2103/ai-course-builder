'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import RoleSelection from '../components/RoleSelection';

export default function RoleSelectionPage() {
  const { user, isLoaded } = useUser();
  const [isNewUser, setIsNewUser] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && user) {
      // First check if user has a role in Clerk's publicMetadata
      checkUserRole();
    }
  }, [isLoaded, user]);

  const checkUserRole = async () => {
    try {
      // Check if user has a role in Clerk's publicMetadata
      const userRole = user?.publicMetadata?.role;
      
      if (userRole) {
        // User has a role, redirect to dashboard
        window.location.href = '/dashboard';
        return;
      }
      
      // If no role in Clerk, check if user exists in our database
      const response = await fetch(`/api/users/${user?.id}`);
      
      if (response.status === 404) {
        // User doesn't exist in our database, show role selection
        setIsNewUser(true);
      } else if (response.ok) {
        // User exists in database, redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        // Some other error
        setDebugInfo({ status: response.status, statusText: response.statusText });
      }
    } catch (error) {
      setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Please sign in to continue</p>
        </div>
      </div>
    );
  }

  if (debugInfo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Debug Information</h2>
          <pre className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-4 rounded">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isNewUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleSelection
      userId={user.id}
      email={user.emailAddresses[0]?.emailAddress || ''}
      firstName={user.firstName || ''}
      lastName={user.lastName || ''}
    />
  );
} 