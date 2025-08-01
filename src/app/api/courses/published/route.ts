import { NextRequest, NextResponse } from 'next/server';
import { courseService } from '../../../../lib/db/services';

export async function GET(request: NextRequest) {
  try {
    // Get all published courses
    const courses = await courseService.getPublishedCourses();
    
    return NextResponse.json({ 
      success: true,
      courses 
    });

  } catch (error) {
    console.error('Error fetching published courses:', error);
    return NextResponse.json({ error: 'Failed to fetch published courses' }, { status: 500 });
  }
} 