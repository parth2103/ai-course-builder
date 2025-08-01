'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import RoleSelection from '../components/RoleSelection';

export default function RoleSelectionPage() {
  const { user, isLoaded } = useUser();
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      // Check if user exists in our database
      checkUserExists();
    }
  }, [isLoaded, user]);

  const checkUserExists = async () => {
    try {
      const response = await fetch(`/api/users/${user?.id}`);
      if (response.status === 404) {
        // User doesn't exist in our database, show role selection
        setIsNewUser(true);
      } else if (response.ok) {
        // User exists, redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Error checking user:', error);
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