import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
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

    // Create user in database
    const user = await userService.createUser({
      id: userId,
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      role
    });

    return NextResponse.json({ 
      success: true, 
      user,
      message: 'User created successfully' 
    });

  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
} 