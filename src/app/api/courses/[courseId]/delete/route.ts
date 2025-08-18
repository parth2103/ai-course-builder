import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { courseService, enrollmentService } from '../../../../../lib/db/services';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await params;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    console.log('Attempting to delete course:', courseId, 'by user:', user.id);

    // Get course details to verify ownership and check enrollments
    const course = await courseService.getCourseById(courseId);
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user is authorized to delete this course
    const userRole = user.publicMetadata?.role as string;
    const isAdmin = userRole === 'admin';
    const isOwner = course.instructorId === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ 
        error: 'Unauthorized. You can only delete your own courses.' 
      }, { status: 403 });
    }

    // For non-admin users, check if course has enrollments
    if (!isAdmin && course.enrolledStudents && course.enrolledStudents > 0) {
      return NextResponse.json({ 
        error: `Cannot delete course with ${course.enrolledStudents} enrolled students. Please contact an administrator.`,
        enrolledStudents: course.enrolledStudents
      }, { status: 400 });
    }

    // Check for force delete parameter (admin only)
    const url = new URL(request.url);
    const forceDelete = url.searchParams.get('force') === 'true';
    
    if (course.enrolledStudents && course.enrolledStudents > 0 && !forceDelete) {
      return NextResponse.json({ 
        error: `Course has ${course.enrolledStudents} enrolled students. Use force=true to delete anyway.`,
        enrolledStudents: course.enrolledStudents,
        requiresForce: true
      }, { status: 400 });
    }

    // If force deleting or no enrollments, proceed with deletion
    console.log('Proceeding with course deletion...');

    // First, delete all enrollments and related data
    if (course.enrolledStudents && course.enrolledStudents > 0) {
      console.log('Cleaning up enrollments...');
      // This will be handled by the database cascade, but we can add explicit cleanup here if needed
    }

    // Delete the course
    await courseService.deleteCourse(courseId);

    console.log('Course deleted successfully:', courseId);

    // Log the deletion for audit purposes
    const auditLog = {
      action: 'course_deleted',
      courseId,
      courseTitle: course.title,
      deletedBy: user.id,
      deletedByRole: userRole,
      forceDelete,
      enrolledStudents: course.enrolledStudents || 0,
      timestamp: new Date().toISOString()
    };
    console.log('Audit log:', auditLog);

    return NextResponse.json({ 
      success: true,
      message: 'Course deleted successfully',
      courseTitle: course.title,
      enrolledStudents: course.enrolledStudents || 0
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ 
      error: 'Failed to delete course',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}