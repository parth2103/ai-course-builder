'use client';

import { useUser } from "@clerk/nextjs";

export interface RolePermissions {
  canCreateCourses: boolean;
  canEditCourses: boolean;
  canDeleteCourses: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canEnrollInCourses: boolean;
  canViewCourses: boolean;
}

export function useRoleAccess() {
  const { user } = useUser();

  const getRolePermissions = (role: string): RolePermissions => {
    switch (role.toLowerCase()) {
      case 'admin':
        return {
          canCreateCourses: true,
          canEditCourses: true,
          canDeleteCourses: true,
          canManageUsers: true,
          canViewAnalytics: true,
          canEnrollInCourses: true,
          canViewCourses: true,
        };
      case 'instructor':
        return {
          canCreateCourses: true,
          canEditCourses: true,
          canDeleteCourses: false, // Can only delete their own courses
          canManageUsers: false,
          canViewAnalytics: true, // Only their own analytics
          canEnrollInCourses: true,
          canViewCourses: true,
        };
      case 'student':
        return {
          canCreateCourses: false,
          canEditCourses: false,
          canDeleteCourses: false,
          canManageUsers: false,
          canViewAnalytics: false,
          canEnrollInCourses: true,
          canViewCourses: true,
        };
      default:
        return {
          canCreateCourses: false,
          canEditCourses: false,
          canDeleteCourses: false,
          canManageUsers: false,
          canViewAnalytics: false,
          canEnrollInCourses: false,
          canViewCourses: true,
        };
    }
  };

  // Get role from Clerk's publicMetadata
  const userRole = user?.publicMetadata?.role as string || 'student';
  
  const permissions = getRolePermissions(userRole);

  return {
    user,
    userRole,
    permissions,
    isAdmin: userRole === 'admin',
    isInstructor: userRole === 'instructor',
    isStudent: userRole === 'student',
  };
} 