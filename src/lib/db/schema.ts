import { pgTable, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role', { enum: ['admin', 'instructor', 'student'] }).notNull().default('student'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Courses table
export const courses = pgTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  instructorId: text('instructor_id').references(() => users.id),
  difficulty: text('difficulty', { enum: ['beginner', 'intermediate', 'advanced'] }).notNull(),
  duration: integer('duration').notNull(), // in hours
  modules: integer('modules').notNull(),
  status: text('status', { enum: ['draft', 'published'] }).notNull().default('draft'),
  category: text('category').notNull(),
  enrolledStudents: integer('enrolled_students').default(0).notNull(),
  rating: integer('rating').default(0).notNull(),
  outline: jsonb('outline'), // Store the AI-generated course outline
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Modules table
export const modules = pgTable('modules', {
  id: text('id').primaryKey(),
  courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').notNull(),
  estimatedDuration: integer('estimated_duration').notNull(), // in minutes
  learningObjectives: jsonb('learning_objectives'), // Array of strings
  keyTopics: jsonb('key_topics'), // Array of strings
  resources: jsonb('resources'), // Object with videos, documents, externalLinks
  assessment: jsonb('assessment'), // Object with quiz questions
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Resources table
export const resources = pgTable('resources', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type', { enum: ['video', 'document', 'external'] }).notNull(),
  url: text('url'),
  filePath: text('file_path'), // For uploaded files
  duration: integer('duration'), // For videos (in minutes)
  uploadedBy: text('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Module Resources (many-to-many relationship)
export const moduleResources = pgTable('module_resources', {
  id: text('id').primaryKey(),
  moduleId: text('module_id').references(() => modules.id, { onDelete: 'cascade' }).notNull(),
  resourceId: text('resource_id').references(() => resources.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Enrollments table
export const enrollments = pgTable('enrollments', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
  progress: integer('progress').default(0).notNull(), // percentage
  completedLessons: integer('completed_lessons').default(0).notNull(),
  totalLessons: integer('total_lessons').notNull(),
  lastAccessed: timestamp('last_accessed').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  detailedProgress: jsonb('detailed_progress').default('{}'), // Store quiz results, completed modules, etc.
});

// Course Analytics table
export const courseAnalytics = pgTable('course_analytics', {
  id: text('id').primaryKey(),
  courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  totalEnrollments: integer('total_enrollments').default(0).notNull(),
  averageProgress: integer('average_progress').default(0).notNull(),
  completionRate: integer('completion_rate').default(0).notNull(),
  averageRating: integer('average_rating').default(0).notNull(),
  totalReviews: integer('total_reviews').default(0).notNull(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
  enrollments: many(enrollments),
  resources: many(resources),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(users, {
    fields: [courses.instructorId],
    references: [users.id],
  }),
  modules: many(modules),
  enrollments: many(enrollments),
  analytics: one(courseAnalytics),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  moduleResources: many(moduleResources),
}));

export const resourcesRelations = relations(resources, ({ one, many }) => ({
  uploadedBy: one(users, {
    fields: [resources.uploadedBy],
    references: [users.id],
  }),
  moduleResources: many(moduleResources),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
})); 