import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { courseService } from '../../../../lib/db/services';

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching courses for instructor:', user.id);

    // Get courses created by this instructor
    const courses = await courseService.getCoursesByInstructor(user.id);
    
    console.log('Found courses:', courses.length, courses);

    return NextResponse.json({ courses });

  } catch (error) {
    console.error('Get instructor courses error:', error);
    return NextResponse.json({ error: 'Failed to get instructor courses' }, { status: 500 });
  }
} 