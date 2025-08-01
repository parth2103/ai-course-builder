'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function Dashboard() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Redirect to Course Hub immediately after Clerk is loaded and user is signed in
      router.replace('/hub');
    } else if (isLoaded && !isSignedIn) {
      // If Clerk is loaded but user is not signed in, redirect to sign-in
      router.replace('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Return null to avoid showing any content during redirect
  return null;
} 