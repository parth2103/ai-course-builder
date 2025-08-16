import { NextRequest, NextResponse } from 'next/server';
import { currentUser, clerkClient } from '@clerk/nextjs/server';
import { courseService, userService } from '../../../../lib/db/services';

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
    console.log('Course data:', { courseTitle, description, totalDuration, modules, status });

    // Check if user exists in database, if not create them
    let dbUser = await userService.getUserById(user.id);
    if (!dbUser) {
      console.log('User not found in database, creating user...');
      try {
        dbUser = await userService.createUser({
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          role: 'instructor' // Default to instructor since they're creating a course
        });
        console.log('User created successfully:', dbUser);
      } catch (userError) {
        console.error('Error creating user:', userError);
        return NextResponse.json({ 
          error: 'Failed to create user account',
          details: userError instanceof Error ? userError.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    // Check if a draft course with the same title already exists for this instructor
    const existingDraft = await courseService.getCoursesByInstructor(user.id);
    const existingDraftCourse = existingDraft.find(course => 
      course.title === courseTitle && course.status === 'draft'
    );

    let course;
    if (existingDraftCourse && status === 'draft') {
      // Update existing draft instead of creating new one
      console.log('Updating existing draft course:', existingDraftCourse.id);
      course = await courseService.updateCourse(existingDraftCourse.id, {
        title: courseTitle,
        description,
        duration: totalDuration || 0,
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
    } else if (existingDraftCourse && status === 'published') {
      // Convert existing draft to published
      console.log('Converting existing draft to published:', existingDraftCourse.id);
      course = await courseService.updateCourse(existingDraftCourse.id, {
        title: courseTitle,
        description,
        duration: totalDuration || 0,
        status: 'published',
        outline: {
          courseTitle,
          description,
          totalDuration,
          modules,
          prerequisites: prerequisites || [],
          learningOutcomes: learningOutcomes || []
        }
      });
    } else {
      // Create new course
      console.log('Creating new course');
      course = await courseService.createCourse({
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
    }

    console.log('Created course:', course);

    return NextResponse.json({ 
      success: true, 
      course,
      courseId: course.id,
      message: status === 'published' ? 'Course published successfully!' : 'Course saved as draft!'
    });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ 
      error: 'Failed to create course',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 