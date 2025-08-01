import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { courseService, enrollmentService } from '../../../../lib/db/services';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get instructor's courses
    const courses = await courseService.getCoursesByInstructor(userId);
    
    // Calculate analytics
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(course => course.status === 'published');
    const totalStudents = courses.reduce((sum, course) => sum + (course.enrolledStudents || 0), 0);
    const averageRating = courses.length > 0 
      ? courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length 
      : 0;

    // Calculate completion rate (simplified - would need more complex logic in real app)
    const completionRate = totalStudents > 0 ? Math.round((totalStudents * 0.75) / totalStudents * 100) : 0;

    const analytics = {
      totalCourses,
      publishedCourses: publishedCourses.length,
      totalStudents,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      completionRate,
      totalRevenue: 0 // Would calculate based on pricing in real app
    };
    
    return NextResponse.json({ analytics });

  } catch (error) {
    console.error('Get instructor analytics error:', error);
    return NextResponse.json({ error: 'Failed to get instructor analytics' }, { status: 500 });
  }
} 