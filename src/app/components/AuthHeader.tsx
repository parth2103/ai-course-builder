'use client';

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import DarkModeToggle from "./DarkModeToggle";
import DemoLogin from "./DemoLogin";

export default function AuthHeader() {
  const { user } = useUser();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Course Builder
            </h1>
          </div>
          
                            <div className="flex items-center space-x-4">
                    <DarkModeToggle />
                    <SignedOut>
                      <DemoLogin />
                      <SignInButton mode="modal">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          Sign Up
                        </button>
                      </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
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