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
    const { 
      progress, 
      completedLessons, 
      completedModules, 
      quizResults, 
      quizAnswers, 
      quizSubmitted 
    } = body;

    // Get the enrollment to update
    const enrollment = await enrollmentService.getEnrollmentByUserAndCourse(user.id, courseId);
    
    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Prepare detailed progress data
    const detailedProgress = {
      completedModules: completedModules || [],
      quizResults: quizResults || {},
      quizAnswers: quizAnswers || {},
      quizSubmitted: quizSubmitted || {},
      lastUpdated: new Date().toISOString()
    };

    // Update both basic progress and detailed progress
    const updatedEnrollment = await enrollmentService.updateEnrollmentProgress(
      enrollment.id,
      progress || 0,
      completedLessons || 0
    );

    await enrollmentService.updateDetailedProgress(enrollment.id, detailedProgress);

    return NextResponse.json({ 
      success: true,
      enrollment: updatedEnrollment,
      detailedProgress
    });

  } catch (error) {
    console.error('Error updating detailed progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}

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

    // Get the enrollment with detailed progress
    const enrollment = await enrollmentService.getEnrollmentByUserAndCourse(user.id, courseId);
    
    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      enrollment,
      detailedProgress: enrollment.detailedProgress || {}
    });

  } catch (error) {
    console.error('Error fetching detailed progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
} 