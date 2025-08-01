// Data store for managing dynamic course and user data
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  modules: number;
  status: 'draft' | 'published';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  enrolledStudents: number;
  rating: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'instructor' | 'student';
  createdAt: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: Date;
}

// In-memory data store (replace with database in production)
class DataStore {
  private courses: Course[] = [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming from variables to functions.',
      instructor: 'John Doe',
      difficulty: 'beginner',
      duration: 8,
      modules: 4,
      status: 'published',
      category: 'Programming',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      enrolledStudents: 1247,
      rating: 4.8
    },
    {
      id: '2',
      title: 'React Development',
      description: 'Build modern web applications with React and its ecosystem.',
      instructor: 'Jane Smith',
      difficulty: 'intermediate',
      duration: 12,
      modules: 6,
      status: 'published',
      category: 'Web Development',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      enrolledStudents: 892,
      rating: 4.9
    },
    {
      id: '3',
      title: 'Python for Data Science',
      description: 'Learn Python programming for data analysis and machine learning.',
      instructor: 'Mike Johnson',
      difficulty: 'intermediate',
      duration: 15,
      modules: 7,
      status: 'published',
      category: 'Data Science',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-15'),
      enrolledStudents: 423,
      rating: 4.6
    }
  ];

  private users: User[] = [
    {
      id: 'user_parth2103',
      email: 'parth2103@gmail.com',
      firstName: 'Parth',
      lastName: 'Gohil',
      role: 'admin',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'user_student',
      email: 'pkg@csu.fullerton.edu',
      firstName: 'Student',
      lastName: 'User',
      role: 'student',
      createdAt: new Date('2024-01-02')
    }
  ];

  private enrollments: Enrollment[] = [
    {
      id: 'enrollment_1',
      userId: 'user_student',
      courseId: '1',
      enrolledAt: new Date('2024-01-15'),
      progress: 75,
      completedLessons: 18,
      totalLessons: 24,
      lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: 'enrollment_2',
      userId: 'user_student',
      courseId: '2',
      enrolledAt: new Date('2024-01-20'),
      progress: 30,
      completedLessons: 10,
      totalLessons: 32,
      lastAccessed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
    },
    {
      id: 'enrollment_3',
      userId: 'user_student',
      courseId: '3',
      enrolledAt: new Date('2024-01-25'),
      progress: 45,
      completedLessons: 13,
      totalLessons: 28,
      lastAccessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  ];

  // Course methods
  getCourses(): Course[] {
    return this.courses;
  }

  getPublishedCourses(): Course[] {
    return this.courses.filter(course => course.status === 'published');
  }

  getCourseById(id: string): Course | undefined {
    return this.courses.find(course => course.id === id);
  }

  addCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'enrolledStudents' | 'rating'>): Course {
    const newCourse: Course = {
      ...course,
      id: `course_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      enrolledStudents: 0,
      rating: 0
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  updateCourse(id: string, updates: Partial<Course>): Course | null {
    const index = this.courses.findIndex(course => course.id === id);
    if (index === -1) return null;
    
    this.courses[index] = {
      ...this.courses[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.courses[index];
  }

  // User methods
  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  // Enrollment methods
  getEnrollmentsByUserId(userId: string): Enrollment[] {
    return this.enrollments.filter(enrollment => enrollment.userId === userId);
  }

  getEnrollmentByUserAndCourse(userId: string, courseId: string): Enrollment | undefined {
    return this.enrollments.find(enrollment => 
      enrollment.userId === userId && enrollment.courseId === courseId
    );
  }

  enrollUser(userId: string, courseId: string): Enrollment {
    const course = this.getCourseById(courseId);
    if (!course) throw new Error('Course not found');

    const enrollment: Enrollment = {
      id: `enrollment_${Date.now()}`,
      userId,
      courseId,
      enrolledAt: new Date(),
      progress: 0,
      completedLessons: 0,
      totalLessons: course.modules * 4, // Estimate 4 lessons per module
      lastAccessed: new Date()
    };

    this.enrollments.push(enrollment);
    
    // Update course enrollment count
    course.enrolledStudents += 1;
    
    return enrollment;
  }

  updateEnrollmentProgress(enrollmentId: string, progress: number, completedLessons: number): Enrollment | null {
    const enrollment = this.enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) return null;

    enrollment.progress = progress;
    enrollment.completedLessons = completedLessons;
    enrollment.lastAccessed = new Date();
    
    return enrollment;
  }

  // Statistics methods
  getStats() {
    const totalCourses = this.courses.length;
    const publishedCourses = this.courses.filter(c => c.status === 'published').length;
    const draftCourses = this.courses.filter(c => c.status === 'draft').length;
    const totalUsers = this.users.length;
    const students = this.users.filter(u => u.role === 'student').length;
    const instructors = this.users.filter(u => u.role === 'instructor').length;
    const totalEnrollments = this.enrollments.length;

    return {
      totalCourses,
      publishedCourses,
      draftCourses,
      totalUsers,
      students,
      instructors,
      totalEnrollments
    };
  }

  getUserStats(userId: string) {
    const userEnrollments = this.getEnrollmentsByUserId(userId);
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
}

// Export singleton instance
export const dataStore = new DataStore(); 