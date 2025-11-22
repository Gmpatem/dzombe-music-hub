'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, BookOpen, Clock, PlayCircle, CheckCircle, LogOut } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from 'sonner';

interface EnrollmentWithProgress {
  id: string;
  programName: string;
  programId: string;
  status: string;
  createdAt: Date;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

export default function MyCoursesPage() {
  const { user, userProfile, logout, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<EnrollmentWithProgress[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to access your courses');
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchCourses() {
      if (!userProfile?.email) return;

      try {
        const enrollmentsRef = collection(db, 'enrollments');
        const q = query(
          enrollmentsRef,
          where('email', '==', userProfile.email),
          where('status', 'in', ['paid', 'approved'])
        );
        const querySnapshot = await getDocs(q);

        const fetchedCourses: EnrollmentWithProgress[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Mock progress data (in real app, fetch from progress collection)
          const totalLessons = 12;
          const completedLessons = Math.floor(Math.random() * totalLessons);
          const progress = Math.round((completedLessons / totalLessons) * 100);

          fetchedCourses.push({
            id: doc.id,
            programName: data.programName || '',
            programId: data.programId || '',
            status: data.status || 'pending',
            createdAt: data.createdAt?.toDate() || new Date(),
            progress,
            totalLessons,
            completedLessons,
          });
        });

        setCourses(fetchedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoadingCourses(false);
      }
    }

    if (user && userProfile) {
      fetchCourses();
    }
  }, [user, userProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (loading || !user || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">D&apos;Zombe Music Hub</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link href="/my-courses" className="text-blue-600 font-medium">
                My Courses
              </Link>
              <Link href="/programs" className="text-gray-700 hover:text-blue-600 font-medium">
                Browse
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">Continue your musical journey</p>
        </div>

        {loadingCourses ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Active Courses
            </h3>
            <p className="text-gray-600 mb-6">
              Enroll in a program to start learning
            </p>
            <Link
              href="/programs"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Programs
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                {/* Course Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{course.programName}</h3>
                  <div className="flex items-center gap-2 text-blue-100 text-sm">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.totalLessons} lessons</span>
                  </div>
                </div>

                {/* Course Body */}
                <div className="p-6">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {course.completedLessons} of {course.totalLessons} lessons completed
                    </p>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Enrolled {new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/course/${course.id}`}
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    {course.progress === 0 ? (
                      <>
                        <PlayCircle className="inline h-5 w-5 mr-2" />
                        Start Learning
                      </>
                    ) : course.progress === 100 ? (
                      <>
                        <CheckCircle className="inline h-5 w-5 mr-2" />
                        Review Course
                      </>
                    ) : (
                      <>
                        <PlayCircle className="inline h-5 w-5 mr-2" />
                        Continue Learning
                      </>
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}