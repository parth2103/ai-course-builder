import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { userService } from '../../../../lib/db/services';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, firstName, lastName, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    let user = await userService.getUserById(userId);
    
    if (user) {
      // User exists, update their role
      user = await userService.updateUserRole(userId, role);
    } else {
      // User doesn't exist, create new user
      user = await userService.createUser({
        id: userId,
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        role
      });
    }

    // Update Clerk's publicMetadata with the role
    const clerk = await clerkClient();
    await clerk.users.updateUser(userId, {
      publicMetadata: {
        role: role
      }
    });

    return NextResponse.json({ 
      success: true, 
      user,
      message: user ? 'User updated successfully' : 'User created successfully' 
    });

  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
} 