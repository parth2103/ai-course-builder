'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page immediately
    router.replace('/landing');
  }, [router]);

  // Return null to avoid showing any content during redirect
  return null;
}