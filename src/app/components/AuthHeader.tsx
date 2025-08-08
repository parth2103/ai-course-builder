'use client';

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import DarkModeToggle from "./DarkModeToggle";
import DemoLogin from "./DemoLogin";
import Image from "next/image";

export default function AuthHeader() {
  const { user } = useUser();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/images/logos/learnify-logo-black.svg"
                alt="Learnify Logo"
                width={160}
                height={50}
                className="dark:hidden w-32 h-10 md:w-[160px] md:h-[50px]"
              />
              <Image
                src="/images/logos/learnify-logo-white.svg"
                alt="Learnify Logo"
                width={160}
                height={50}
                className="hidden dark:block w-32 h-10 md:w-[160px] md:h-[50px]"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <DarkModeToggle />
            <SignedOut>
              <DemoLogin />
              <SignInButton mode="modal">
                <button className="text-sm md:text-base border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.publicMetadata?.role as string || 'Student'}
                  </div>
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                  afterSignOutUrl="/landing"
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
} 