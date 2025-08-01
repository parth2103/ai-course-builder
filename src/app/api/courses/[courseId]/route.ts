import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { courseService } from '../../../../lib/db/services';

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

    const course = await courseService.getCourseById(courseId);
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user is the instructor, admin, or an enrolled student
    const isInstructor = course.instructorId === user.id;
    const isAdmin = user.publicMetadata?.role === 'admin';
    
    // If not instructor or admin, check if student is enrolled
    if (!isInstructor && !isAdmin) {
      const { enrollmentService } = await import('../../../../lib/db/services');
      const enrollment = await enrollmentService.getEnrollmentByUserAndCourse(user.id, courseId);
      
      if (!enrollment) {
        return NextResponse.json({ error: 'Forbidden - Not enrolled in this course' }, { status: 403 });
      }
    }

    return NextResponse.json(course);

  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}

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
    const { courseTitle, description, totalDuration, modules, prerequisites, learningOutcomes, status } = body;

    // Validate required fields
    if (!courseTitle || !description || !modules || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the course to check permissions
    const existingCourse = await courseService.getCourseById(courseId);
    
    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user is the instructor or admin
    if (existingCourse.instructorId !== user.id && user.publicMetadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update course in database
    const course = await courseService.updateCourse(courseId, {
      title: courseTitle,
      description,
      totalDuration: totalDuration || 0,
      status: status as 'draft' | 'published',
      outline: {
        courseTitle,
        description,
        totalDuration,
        modules,
        prerequisites: prerequisites || [],
        learningOutcomes: learningOutcomes || []
      },
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      course,
      message: status === 'published' ? 'Course published successfully!' : 'Course saved as draft!'
    });

  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
} 