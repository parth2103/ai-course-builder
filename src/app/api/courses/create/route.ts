import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { courseService } from '../../../../lib/db/services';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseTitle, description, totalDuration, modules, prerequisites, learningOutcomes, status } = body;

    // Validate required fields
    if (!courseTitle || !description || !modules || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Creating course for instructor:', user.id, 'with status:', status);

    // Create course in database
    const course = await courseService.createCourse({
      title: courseTitle,
      description,
      totalDuration: totalDuration || 0,
      instructorId: user.id,
      status: status as 'draft' | 'published',
      outline: {
        courseTitle,
        description,
        totalDuration,
        modules,
        prerequisites: prerequisites || [],
        learningOutcomes: learningOutcomes || []
      }
    });

    console.log('Created course:', course);

    return NextResponse.json({ 
      success: true, 
      course,
      message: status === 'published' ? 'Course published successfully!' : 'Course saved as draft!'
    });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
} 