'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import DeleteCourseModal from '../../../components/DeleteCourseModal';
import { useUser } from '@clerk/nextjs';

interface Course {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published';
  enrolledStudents: number;
  rating: number;
  createdAt: string;
  difficulty: string;
  duration: number;
  modules: number;
}

export default function InstructorCourses() {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    course: Course | null;
  }>({ isOpen: false, course: null });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/instructor/courses');
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (course: Course) => {
    setDeleteModal({ isOpen: true, course });
  };

  const handleDeleteConfirm = async (forceDelete = false) => {
    if (!deleteModal.course) return;

    setIsDeleting(true);
    try {
      const url = `/api/courses/${deleteModal.course.id}/delete${forceDelete ? '?force=true' : ''}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete course');
      }

      const data = await response.json();
      alert(`Course "${data.courseTitle}" deleted successfully!`);
      
      // Remove the deleted course from the list
      setCourses(courses.filter(c => c.id !== deleteModal.course!.id));
      
      // Close modal
      setDeleteModal({ isOpen: false, course: null });
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete course');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, course: null });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Error loading courses
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <button 
          onClick={fetchCourses}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and track your created courses
          </p>
        </div>
        <Link href="/hub/generate" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-block">
          Create New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No courses yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start creating your first course to share your knowledge
          </p>
          <Link href="/hub/generate" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-block">
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {course.title}
                </h3>
                <span className={`px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2 ${
                  course.status === 'published' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {course.status}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Difficulty: {course.difficulty}</span>
                  <span>{course.duration}h</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{course.modules} modules</span>
                  <span>{course.enrolledStudents} students</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  ⭐ {course.rating || 0}/5
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {new Date(course.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <Link 
                    href={`/hub/instructor/courses/${course.id}/edit`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium text-center block transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    ✏️ Edit Course
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(course)}
                    className="bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    title="Delete Course"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Course Modal */}
      {deleteModal.isOpen && deleteModal.course && (
        <DeleteCourseModal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          courseTitle={deleteModal.course.title}
          enrolledStudents={deleteModal.course.enrolledStudents}
          isAdmin={user?.publicMetadata?.role === 'admin'}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
} 