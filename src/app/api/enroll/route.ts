import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { enrollmentService, userService } from '../../../lib/db/services';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Get or create user in database
    let user = await userService.getUserById(userId);
    if (!user) {
      // Create user from Clerk data
      const clerkUser = await currentUser();
      if (clerkUser) {
        user = await userService.createUser({
          id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          role: 'student' // Default role
        });
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Enroll the user
    const enrollment = await enrollmentService.enrollUser(userId, courseId);

    return NextResponse.json({ 
      success: true, 
      enrollment,
      message: 'Successfully enrolled in course' 
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    if (error instanceof Error && error.message === 'User is already enrolled in this course') {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to enroll in course' }, { status: 500 });
  }
} 