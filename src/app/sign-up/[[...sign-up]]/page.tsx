import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Start building amazing courses with AI
          </p>
        </div>
        <SignUp 
          redirectUrl="/hub"
          appearance={{
            elements: {
              formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white",
              card: "bg-white dark:bg-gray-800 shadow-lg",
              headerTitle: "text-gray-900 dark:text-white",
              headerSubtitle: "text-gray-600 dark:text-gray-400",
            }
          }}
        />
      </div>
    </div>
  );
} 