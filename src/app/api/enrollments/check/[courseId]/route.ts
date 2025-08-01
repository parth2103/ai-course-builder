import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { enrollmentService } from '../../../../../lib/db/services';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId } = await params;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is enrolled in this course
    const enrollment = await enrollmentService.getEnrollmentByUserAndCourse(user.id, courseId);
    
    return NextResponse.json({ 
      isEnrolled: !!enrollment,
      enrollment,
      detailedProgress: enrollment?.detailedProgress || {}
    });

  } catch (error) {
    console.error('Error checking enrollment:', error);
    return NextResponse.json({ error: 'Failed to check enrollment' }, { status: 500 });
  }
} 