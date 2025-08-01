import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { enrollmentService } from '../../../../../lib/db/services';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await currentUser();
    const { courseId } = await params;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { progress, completedLessons } = body;

    // Get the enrollment to update
    const enrollment = await enrollmentService.getEnrollmentByUserAndCourse(user.id, courseId);
    
    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Update enrollment progress
    const updatedEnrollment = await enrollmentService.updateEnrollmentProgress(
      enrollment.id,
      progress,
      completedLessons
    );

    return NextResponse.json({ 
      success: true,
      enrollment: updatedEnrollment
    });

  } catch (error) {
    console.error('Error updating enrollment progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
} 