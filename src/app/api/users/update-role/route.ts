import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { userService } from '../../../../lib/db/services';

export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await request.json();
    const { userId: currentUserId } = await auth();

    // Check if current user is admin
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if current user has admin role in database
    const currentUser = await userService.getUserById(currentUserId);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Update role in database
    await userService.updateUserRole(userId, role);

    // Update Clerk's publicMetadata with the new role
    const clerk = await clerkClient();
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        role: role
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'User role updated successfully',
      userId,
      role,
      updatedBy: currentUserId
    });

  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' }, 
      { status: 500 }
    );
  }
} 