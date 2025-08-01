'use client';

import { useRoleAccess } from '../../hooks/useRoleAccess';
import RoleManager from '../../components/RoleManager';

export default function HubUsers() {
  const { isAdmin } = useRoleAccess();

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This section is only available for administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage user roles, permissions, and account settings.
        </p>
      </div>

      <RoleManager />
    </div>
  );
} 