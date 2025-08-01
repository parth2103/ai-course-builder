'use client';

import { useUser } from "@clerk/nextjs";

interface RoleBadgeProps {
  className?: string;
}

export default function UserRoleBadge({ className = "" }: RoleBadgeProps) {
  const { user } = useUser();

  if (!user) return null;

  // For now, all users are admins. In the future, you can check user metadata
  // for different roles like: user.publicMetadata.role
  const userRole = user.publicMetadata?.role as string || 'admin';

  const getRoleConfig = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return {
          label: 'Admin',
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        };
      case 'instructor':
        return {
          label: 'Instructor',
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };
      case 'student':
        return {
          label: 'Student',
          className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        };
      default:
        return {
          label: 'User',
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        };
    }
  };

  const roleConfig = getRoleConfig(userRole);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleConfig.className} ${className}`}>
      {roleConfig.label}
    </span>
  );
} 