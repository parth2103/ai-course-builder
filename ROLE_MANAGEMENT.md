# Role Management System

## Overview

The AI Course Builder implements a comprehensive role-based access control (RBAC) system using Clerk authentication and custom role management.

## User Roles

### 1. **Admin** 🔵
- **Full System Access**: Can access all features and manage all users
- **Permissions**:
  - Create, edit, and delete any course
  - Manage user roles and permissions
  - View system-wide analytics
  - Access admin dashboard
  - Manage resource library
  - User management

### 2. **Instructor** 🟢
- **Course Creation Access**: Can create and manage their own courses
- **Permissions**:
  - Create and edit their own courses
  - Upload resources for their courses
  - View their course analytics
  - Cannot delete courses (safety feature)
  - Cannot manage other users

### 3. **Student** 🟣
- **Learning Access**: Can view and enroll in courses
- **Permissions**:
  - Browse and enroll in courses
  - Track learning progress
  - View course content
  - Cannot create or edit courses

## Implementation Details

### Role Storage
Roles are stored in Clerk's user metadata:
```typescript
user.publicMetadata.role = 'admin' | 'instructor' | 'student'
```

### Role Checking
Use the `useRoleAccess` hook to check permissions:
```typescript
const { isAdmin, isInstructor, isStudent, permissions } = useRoleAccess();

if (permissions.canCreateCourses) {
  // Show course creation UI
}
```

### Role-Based Navigation
The `RoleBasedNavigation` component automatically shows different navigation options based on user role.

## Setting Up Roles

### 1. **For Development**
Currently, all users default to "admin" role. To test different roles:

1. **Update UserRoleBadge.tsx**:
```typescript
// Change this line to test different roles
const userRole = 'instructor'; // or 'student'
```

2. **Or use Clerk Dashboard**:
   - Go to your Clerk Dashboard
   - Find the user
   - Update their `publicMetadata.role` field

### 2. **For Production**
Implement proper role assignment:

1. **Admin Assignment**: Only super admins can assign admin roles
2. **Instructor Approval**: Admins approve instructor applications
3. **Student Registration**: Default role for new sign-ups

## Database Integration

When you implement the database, roles will be stored in the `users` table:

```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Considerations

1. **Role Validation**: Always validate roles on both client and server
2. **Permission Checks**: Use the `useRoleAccess` hook for consistent permission checking
3. **API Protection**: Protect API routes with role-based middleware
4. **UI Hiding**: Hide UI elements based on permissions, but don't rely solely on this

## Future Enhancements

1. **Role Hierarchy**: Implement role inheritance
2. **Custom Permissions**: Allow granular permission control
3. **Role Auditing**: Track role changes and who made them
4. **Temporary Roles**: Time-limited role assignments
5. **Role-Based Analytics**: Different analytics views per role

## Testing Different Roles

To test the system with different roles:

1. **Create multiple test accounts** in Clerk
2. **Assign different roles** to each account
3. **Test the navigation** and permissions for each role
4. **Verify that features are properly restricted** based on role

## API Endpoints

- `POST /api/users/update-role` - Update user role (admin only)
- `GET /api/users` - List users (admin only)
- `GET /api/users/[id]` - Get user details (admin only)

## Components

- `RoleManager` - Admin interface for managing user roles
- `UserRoleBadge` - Displays user role with appropriate styling
- `RoleBasedNavigation` - Shows navigation based on user role
- `useRoleAccess` - Hook for checking permissions and roles 