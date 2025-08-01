import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { enrollmentService } from '../../../../../lib/db/services';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { userId: clerkUserId } = await auth();

    // Check if the user is authenticated
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the user is trying to access their own data
    if (clerkUserId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const enrollments = await enrollmentService.getUserEnrollments(userId);

    return NextResponse.json({ enrollments });

  } catch (error) {
    console.error('Get user enrollments error:', error);
    return NextResponse.json({ error: 'Failed to get user enrollments' }, { status: 500 });
  }
} 