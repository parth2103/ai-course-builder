import { db } from './index';
import { users, courses, enrollments } from './schema';
import { eq, and, desc, count } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// User Services
export const userService = {
  async createUser(userData: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: 'admin' | 'instructor' | 'student';
  }) {
    // Check if user with this email already exists
    const existingUser = await this.getUserByEmail(userData.email);
    
    if (existingUser) {
      // If the existing user has a different ID, we need to handle foreign key constraints
      if (existingUser.id !== userData.id) {
        // First, delete any enrollments for the old user (since we can't update to non-existent user)
        await db.delete(enrollments)
          .where(eq(enrollments.userId, existingUser.id));
      }
      
      // Update the existing user with new Clerk ID and role
      const [user] = await db.update(users)
        .set({
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || 'student',
          updatedAt: new Date()
        })
        .where(eq(users.email, userData.email))
        .returning();
      return user;
    }

    // Create new user
    const [user] = await db.insert(users).values({
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'student',
    }).returning();
    return user;
  },

  async getUserById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  async getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  async updateUserRole(id: string, role: 'admin' | 'instructor' | 'student') {
    const [user] = await db.update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  },

  async getAllUsers() {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  },

  async getUsersByRole(role: 'admin' | 'instructor' | 'student') {
    return await db.select().from(users).where(eq(users.role, role));
  }
};

// Course Services
export const courseService = {
  async createCourse(courseData: {
    title: string;
    description: string;
    instructorId?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    duration?: number;
    totalDuration?: number;
    modules?: number;
    category?: string;
    status?: 'draft' | 'published';
    outline?: { 
      courseTitle?: string;
      description?: string;
      totalDuration?: number;
      modules?: Array<unknown>;
      prerequisites?: Array<unknown>;
      learningOutcomes?: Array<unknown>;
    };
  }) {
    const [course] = await db.insert(courses).values({
      id: nanoid(),
      title: courseData.title,
      description: courseData.description,
      instructorId: courseData.instructorId,
      difficulty: courseData.difficulty || 'beginner',
      duration: courseData.duration || courseData.totalDuration || 0,
      modules: courseData.modules || (courseData.outline?.modules?.length || 0),
      category: courseData.category || 'General',
      status: courseData.status || 'draft',
      outline: courseData.outline,
      enrolledStudents: 0,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return course;
  },

  async getCourseById(id: string) {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  },

  async getAllCourses() {
    return await db.select().from(courses).orderBy(desc(courses.createdAt));
  },

  async getPublishedCourses() {
    return await db.select().from(courses)
      .where(eq(courses.status, 'published'))
      .orderBy(desc(courses.createdAt));
  },

  async updateCourse(id: string, updates: Partial<typeof courses.$inferInsert>) {
    const [course] = await db.update(courses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return course;
  },

  async publishCourse(id: string) {
    const [course] = await db.update(courses)
      .set({ status: 'published', updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return course;
  },

  async deleteCourse(id: string) {
    await db.delete(courses).where(eq(courses.id, id));
  },

  async getCoursesByInstructor(instructorId: string) {
    return await db.select().from(courses)
      .where(eq(courses.instructorId, instructorId))
      .orderBy(desc(courses.createdAt));
  }
};

// Enrollment Services
export const enrollmentService = {
  async enrollUser(userId: string, courseId: string) {
    // Check if already enrolled
    const existing = await this.getEnrollmentByUserAndCourse(userId, courseId);
    if (existing) {
      throw new Error('User is already enrolled in this course');
    }

    // Get course to calculate total lessons
    const course = await courseService.getCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const [enrollment] = await db.insert(enrollments).values({
      id: nanoid(),
      userId,
      courseId,
      totalLessons: course.modules * 4, // Estimate 4 lessons per module
      progress: 0,
      completedLessons: 0,
    }).returning();

    // Update course enrollment count
    await db.update(courses)
      .set({ enrolledStudents: course.enrolledStudents + 1 })
      .where(eq(courses.id, courseId));

    return enrollment;
  },

  async getEnrollmentByUserAndCourse(userId: string, courseId: string) {
    const [enrollment] = await db.select().from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment;
  },

  async getUserEnrollments(userId: string) {
    return await db.select({
      id: enrollments.id,
      userId: enrollments.userId,
      courseId: enrollments.courseId,
      progress: enrollments.progress,
      completedLessons: enrollments.completedLessons,
      totalLessons: enrollments.totalLessons,
      enrolledAt: enrollments.enrolledAt,
      lastAccessed: enrollments.lastAccessed,
      isActive: enrollments.isActive,
      course: {
        id: courses.id,
        title: courses.title,
        description: courses.description,
        difficulty: courses.difficulty,
        duration: courses.duration,
        category: courses.category,
        instructorId: courses.instructorId,
        status: courses.status,
      }
    }).from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));
  },

  async updateEnrollmentProgress(enrollmentId: string, progress: number, completedLessons: number) {
    const [enrollment] = await db.update(enrollments)
      .set({ 
        progress, 
        completedLessons, 
        lastAccessed: new Date() 
      })
      .where(eq(enrollments.id, enrollmentId))
      .returning();
    return enrollment;
  },

  async updateDetailedProgress(enrollmentId: string, detailedProgress: Record<string, unknown>) {
    const [enrollment] = await db.update(enrollments)
      .set({ 
        detailedProgress, 
        lastAccessed: new Date() 
      })
      .where(eq(enrollments.id, enrollmentId))
      .returning();
    return enrollment;
  },

  async getEnrollmentWithCourse(enrollmentId: string) {
    const [enrollment] = await db.select({
      enrollment: enrollments,
      course: courses,
    }).from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.id, enrollmentId));
    return enrollment;
  },

  async unenrollUser(userId: string, courseId: string) {
    // Delete the enrollment record
    await db.delete(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    
    return { success: true };
  }
};

// Statistics Services
export const statsService = {
  async getStats() {
    const [coursesCount] = await db.select({ count: count() }).from(courses);
    const [publishedCount] = await db.select({ count: count() }).from(courses).where(eq(courses.status, 'published'));
    const [draftCount] = await db.select({ count: count() }).from(courses).where(eq(courses.status, 'draft'));
    const [usersCount] = await db.select({ count: count() }).from(users);
    const [studentsCount] = await db.select({ count: count() }).from(users).where(eq(users.role, 'student'));
    const [instructorsCount] = await db.select({ count: count() }).from(users).where(eq(users.role, 'instructor'));
    const [enrollmentsCount] = await db.select({ count: count() }).from(enrollments);

    return {
      totalCourses: coursesCount.count,
      publishedCourses: publishedCount.count,
      draftCourses: draftCount.count,
      totalUsers: usersCount.count,
      students: studentsCount.count,
      instructors: instructorsCount.count,
      totalEnrollments: enrollmentsCount.count,
    };
  },

  async getUserStats(userId: string) {
    const userEnrollments = await enrollmentService.getUserEnrollments(userId);
    
    const totalCourses = userEnrollments.length;
    const totalLessons = userEnrollments.reduce((sum, e) => sum + e.totalLessons, 0);
    const completedLessons = userEnrollments.reduce((sum, e) => sum + e.completedLessons, 0);
    const averageProgress = totalCourses > 0 
      ? userEnrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses 
      : 0;

    return {
      totalCourses,
      totalLessons,
      completedLessons,
      averageProgress: Math.round(averageProgress)
    };
  }
}; 