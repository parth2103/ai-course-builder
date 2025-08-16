import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { enrollmentService, courseService } from '../../../lib/db/services';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    console.log('Unenrolling user:', user.id, 'from course:', courseId);

    // Check if user is enrolled in the course
    const enrollment = await enrollmentService.getEnrollmentByUserAndCourse(user.id, courseId);
    
    if (!enrollment) {
      return NextResponse.json({ error: 'User is not enrolled in this course' }, { status: 400 });
    }

    // Get course details to update enrollment count
    const course = await courseService.getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Remove enrollment
    await enrollmentService.unenrollUser(user.id, courseId);

    // Update course enrollment count
    const newEnrollmentCount = Math.max(0, (course.enrolledStudents || 1) - 1);
    await courseService.updateCourse(courseId, {
      enrolledStudents: newEnrollmentCount
    });

    console.log('Successfully unenrolled user from course');

    return NextResponse.json({ 
      success: true,
      message: 'Successfully unenrolled from course'
    });

  } catch (error) {
    console.error('Error unenrolling user:', error);
    return NextResponse.json({ 
      error: 'Failed to unenroll from course',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}