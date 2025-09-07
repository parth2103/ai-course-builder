import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { courseService, userService, enrollmentService, statsService } from '../../../../lib/db/services';

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = user.publicMetadata?.role as string;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    // Try to use existing stats service first
    try {
      const stats = await statsService.getStats();
      return NextResponse.json({ stats });
    } catch (error) {
      console.log('Stats service failed, calculating manually:', error);
      
      // Fallback: Fetch real analytics data from database manually
      const courses = await courseService.getAllCoursesForAdmin();
      const users = await userService.getAllUsers();
      
      // Calculate enrollment count manually since getAllEnrollments might not exist
      let totalEnrollments = 0;
      try {
        // We'll calculate based on course enrollment data
        totalEnrollments = courses.reduce((sum, course) => sum + (course.enrolledStudents || 0), 0);
      } catch (error) {
        console.log('Error calculating enrollments:', error);
        totalEnrollments = 0;
      }

      // Calculate statistics
      const totalCourses = courses.length;
      const publishedCourses = courses.filter(course => course.status === 'published').length;
      const draftCourses = courses.filter(course => course.status === 'draft').length;
      
      // Count users by role
      const totalUsers = users.length;
      const students = users.filter((u: any) => u.role === 'student').length;
      const instructors = users.filter((u: any) => u.role === 'instructor').length;
      const admins = users.filter((u: any) => u.role === 'admin').length;

      const stats = {
        totalCourses,
        publishedCourses,
        draftCourses,
        totalUsers,
        students,
        instructors,
        admins,
        totalEnrollments
      };

      return NextResponse.json({ stats });
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}