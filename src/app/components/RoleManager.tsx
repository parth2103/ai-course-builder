'use client';

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: string;
}

export default function RoleManager() {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([
    // Real user data from your Clerk setup
    {
      id: "user_parth2103",
      firstName: "Parth",
      lastName: "Gohil",
      emailAddress: "parth2103@gmail.com",
      role: "admin"
    },
    {
      id: "user_student", 
      firstName: "Student",
      lastName: "User",
      emailAddress: "pkg@csu.fullerton.edu",
      role: "student"
    }
  ]);

  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const roles = [
    { value: "admin", label: "Admin", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    { value: "instructor", label: "Instructor", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    { value: "student", label: "Student", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" }
  ];

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    // In real app, you would update the user's role in your database
    console.log(`Updated user ${userId} role to ${newRole}`);
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = roles.find(r => r.value === role);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleConfig?.color || 'bg-gray-100 text-gray-800'}`}>
        {roleConfig?.label || 'User'}
      </span>
    );
  };

  // Only show if current user is admin
  if (!user || user.publicMetadata?.role !== 'admin') {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">User Role Management</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage user roles and permissions
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.emailAddress}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {getRoleBadge(user.role)}
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Role Permissions</h4>
          <div className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <div><strong>Admin:</strong> Full access to all features, can manage users</div>
            <div><strong>Instructor:</strong> Can create and edit courses, manage their own content</div>
            <div><strong>Student:</strong> Can view and enroll in courses, track progress</div>
          </div>
        </div>
      </div>
    </div>
  );
} 