'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      checkUserAndRedirect();
    }
  }, [isLoaded, user]);

  const checkUserAndRedirect = async () => {
    try {
      const response = await fetch(`/api/users/${user?.id}`);
      if (response.status === 404) {
        // User doesn't exist in our database, redirect to role selection
        router.push('/role-selection');
      } else if (response.ok) {
        // User exists, redirect to course hub
        router.push('/hub');
      }
    } catch (error) {
      console.error('Error checking user:', error);
      // On error, redirect to role selection as fallback
      router.push('/role-selection');
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
} 