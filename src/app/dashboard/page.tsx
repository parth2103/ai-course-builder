'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && user) {
      checkUserAndRedirect();
    }
  }, [isLoaded, user]);

  const checkUserAndRedirect = async () => {
    try {
      console.log('Dashboard: Checking user:', user?.id);
      console.log('Dashboard: User publicMetadata:', user?.publicMetadata);
      
      // First check if user has a role in Clerk's publicMetadata
      const userRole = user?.publicMetadata?.role;
      
      if (userRole) {
        // User has a role, redirect to course hub
        console.log('Dashboard: User has role:', userRole, 'redirecting to hub');
        router.push('/hub');
        return;
      }
      
      // If no role in Clerk, check if user exists in our database
      console.log('Dashboard: No role in Clerk, checking database...');
      const response = await fetch(`/api/users/${user?.id}`);
      console.log('Dashboard: Response status:', response.status);
      
      if (response.status === 404) {
        // User doesn't exist in our database, redirect to role selection
        console.log('Dashboard: User not found, redirecting to role selection');
        router.push('/role-selection');
      } else if (response.ok) {
        // User exists in database, redirect to course hub
        console.log('Dashboard: User found in database, redirecting to hub');
        router.push('/hub');
      } else {
        // Some other error
        console.log('Dashboard: Error response:', response.status, response.statusText);
        setDebugInfo({ status: response.status, statusText: response.statusText });
      }
    } catch (error) {
      console.error('Dashboard: Error checking user:', error);
      setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsChecking(false);
    }
  };

  if (!isLoaded || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Setting up your dashboard...</p>
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Dashboard Debug Information</h2>
          <pre className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-4 rounded">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
          <div className="mt-4 space-x-4">
            <button 
              onClick={() => router.push('/role-selection')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Go to Role Selection
            </button>
            <button 
              onClick={() => router.push('/hub')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Go to Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
} 