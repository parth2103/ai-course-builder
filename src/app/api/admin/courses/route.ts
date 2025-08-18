import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { courseService } from '../../../../lib/db/services';

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userRole = user.publicMetadata?.role as string;
    const isAdmin = userRole === 'admin';

    if (!isAdmin) {
      return NextResponse.json({ 
        error: 'Unauthorized. Admin access required.' 
      }, { status: 403 });
    }

    console.log('Admin fetching all courses:', user.id);

    // Get all courses with instructor information
    const courses = await courseService.getAllCoursesForAdmin();

    console.log('Admin courses fetched:', courses.length);

    return NextResponse.json({ 
      success: true,
      courses: courses || [],
      count: courses.length
    });

  } catch (error) {
    console.error('Error fetching admin courses:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch courses',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}