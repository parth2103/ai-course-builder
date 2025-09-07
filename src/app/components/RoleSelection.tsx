'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RoleSelectionProps {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function RoleSelection({ userId, email, firstName, lastName }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'instructor' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'I want to learn and take courses',
      icon: '🎓',
      color: 'bg-blue-500 hover:bg-blue-600',
      features: ['Browse and enroll in courses', 'Track learning progress', 'Access course materials', 'Take interactive quizzes']
    },
    {
      id: 'instructor',
      title: 'Instructor',
      description: 'I want to create and teach courses',
      icon: '👨‍🏫',
      color: 'bg-green-500 hover:bg-green-600',
      features: ['Create AI-powered courses', 'Manage course content', 'Track student progress', 'Publish courses to marketplace']
    }
  ];

  const handleRoleSelection = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    setError(null);
    try {
      // Create user in database with selected role
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          email,
          firstName: firstName || '',
          lastName: lastName || '',
          role: selectedRole
        }),
      });

      if (response.ok) {
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create user. Please try again.');
        console.error('Failed to create user:', errorData);
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Error creating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to AI Course Builder!
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Please select your role to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all ${
                selectedRole === role.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => setSelectedRole(role.id as any)}
            >
              <div className="text-center">
                <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white text-2xl">{role.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {role.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {role.description}
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {selectedRole === role.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          <button
            onClick={handleRoleSelection}
            disabled={!selectedRole || isLoading}
            className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${
              selectedRole && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Setting up your account...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
} 