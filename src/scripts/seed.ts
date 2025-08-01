import { config } from 'dotenv';
import { userService, courseService, enrollmentService } from '../lib/db/services';

// Load environment variables
config({ path: '.env.local' });

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Create test users
    console.log('Creating users...');
    const adminUser = await userService.createUser({
      id: 'user_admin_test',
      email: 'parth2103@gmail.com',
      firstName: 'Parth',
      lastName: 'Gohil',
      role: 'admin'
    });

    const studentUser = await userService.createUser({
      id: 'user_student_test',
      email: 'pkg@csu.fullerton.edu',
      firstName: 'Student',
      lastName: 'User',
      role: 'student'
    });

    console.log('✅ Users created:', { admin: adminUser.email, student: studentUser.email });

    // Create sample courses
    console.log('Creating courses...');
    const course1 = await courseService.createCourse({
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming from variables to functions.',
      instructorId: adminUser.id,
      difficulty: 'beginner',
      duration: 8,
      modules: 4,
      category: 'Programming',
      outline: {
        courseTitle: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming from variables to functions.',
        totalDuration: 8,
        modules: [
          {
            title: 'Introduction to JavaScript',
            learningObjectives: ['Understand JavaScript basics', 'Learn about variables and data types'],
            estimatedDuration: 120,
            resources: {
              videos: [
                {
                  title: 'JavaScript Tutorial for Beginners',
                  description: 'Complete beginner guide to JavaScript',
                  url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
                  duration: 15
                }
              ],
              documents: [],
              externalLinks: []
            },
            assessment: {
              quizQuestions: []
            }
          }
        ]
      }
    });

    const course2 = await courseService.createCourse({
      title: 'React Development',
      description: 'Build modern web applications with React and its ecosystem.',
      instructorId: adminUser.id,
      difficulty: 'intermediate',
      duration: 12,
      modules: 6,
      category: 'Web Development',
      outline: {
        courseTitle: 'React Development',
        description: 'Build modern web applications with React and its ecosystem.',
        totalDuration: 12,
        modules: []
      }
    });

    const course3 = await courseService.createCourse({
      title: 'Python for Data Science',
      description: 'Learn Python programming for data analysis and machine learning.',
      instructorId: adminUser.id,
      difficulty: 'intermediate',
      duration: 15,
      modules: 7,
      category: 'Data Science',
      outline: {
        courseTitle: 'Python for Data Science',
        description: 'Learn Python programming for data analysis and machine learning.',
        totalDuration: 15,
        modules: []
      }
    });

    console.log('✅ Courses created:', [course1.title, course2.title, course3.title]);

    // Publish courses
    await courseService.publishCourse(course1.id);
    await courseService.publishCourse(course2.id);
    await courseService.publishCourse(course3.id);

    // Create enrollments
    console.log('Creating enrollments...');
    const enrollment1 = await enrollmentService.enrollUser(studentUser.id, course1.id);
    const enrollment2 = await enrollmentService.enrollUser(studentUser.id, course2.id);
    const enrollment3 = await enrollmentService.enrollUser(studentUser.id, course3.id);

    // Update progress for some enrollments
    await enrollmentService.updateEnrollmentProgress(enrollment1.id, 75, 18);
    await enrollmentService.updateEnrollmentProgress(enrollment2.id, 30, 10);
    await enrollmentService.updateEnrollmentProgress(enrollment3.id, 45, 13);

    console.log('✅ Enrollments created with progress');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- 2 users (admin + student)');
    console.log('- 3 published courses');
    console.log('- 3 enrollments with progress');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase(); 