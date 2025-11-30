'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from 'sonner';

interface Course {
  id: string;
  programTitle: string;
  programId: string;
  status: 'approved' | 'pending' | 'rejected';
  enrolledAt: Date;
  message?: string;
  studentEmail: string;
  studentName: string;
  studentPhone: string;
}

export default function MyCoursesPage() {
  const { userProfile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch student's enrollments from Firebase
  useEffect(() => {
    async function fetchCourses() {
      if (!userProfile?.email) {
        setLoading(false);
        return;
      }

      try {
        const enrollmentsRef = collection(db, 'enrollments');
        const q = query(
          enrollmentsRef,
          where('studentEmail', '==', userProfile.email)
        );
        const snapshot = await getDocs(q);

        const data: Course[] = [];
        snapshot.forEach((doc) => {
          const enrollment = doc.data();
          data.push({
            id: doc.id,
            programTitle: enrollment.programTitle || 'Untitled Course',
            programId: enrollment.programId || '',
            status: enrollment.status || 'pending',
            enrolledAt: enrollment.enrolledAt?.toDate() || new Date(),
            message: enrollment.message || '',
            studentEmail: enrollment.studentEmail || '',
            studentName: enrollment.studentName || '',
            studentPhone: enrollment.studentPhone || '',
          });
        });

        // Sort by date (newest first)
        data.sort((a, b) => b.enrolledAt.getTime() - a.enrolledAt.getTime());
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [userProfile]);

  // Filter courses based on status and search
  const filteredCourses = courses.filter((course) => {
    const matchesFilter = filter === 'all' || course.status === filter;
    const matchesSearch = course.programTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Count by status
  const counts = {
    all: courses.length,
    approved: courses.filter((c) => c.status === 'approved').length,
    pending: courses.filter((c) => c.status === 'pending').length,
    rejected: courses.filter((c) => c.status === 'rejected').length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600">
          Track your enrolled courses and their status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`p-4 rounded-xl border-2 transition-all text-left ${
            filter === 'all'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{counts.all}</span>
          </div>
          <p className="text-sm font-medium text-gray-700">All Courses</p>
        </button>

        <button
          onClick={() => setFilter('approved')}
          className={`p-4 rounded-xl border-2 transition-all text-left ${
            filter === 'approved'
              ? 'border-green-600 bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">{counts.approved}</span>
          </div>
          <p className="text-sm font-medium text-gray-700">Approved</p>
        </button>

        <button
          onClick={() => setFilter('pending')}
          className={`p-4 rounded-xl border-2 transition-all text-left ${
            filter === 'pending'
              ? 'border-yellow-600 bg-yellow-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="text-2xl font-bold text-gray-900">{counts.pending}</span>
          </div>
          <p className="text-sm font-medium text-gray-700">Pending</p>
        </button>

        <button
          onClick={() => setFilter('rejected')}
          className={`p-4 rounded-xl border-2 transition-all text-left ${
            filter === 'rejected'
              ? 'border-red-600 bg-red-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">{counts.rejected}</span>
          </div>
          <p className="text-sm font-medium text-gray-700">Rejected</p>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12 px-4">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No courses found' : courses.length === 0 ? 'No enrollments yet' : 'No courses match your filter'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search or filters' 
                : courses.length === 0
                ? 'Start your musical journey by enrolling in a course'
                : 'Try selecting a different filter'}
            </p>
            {courses.length === 0 && !searchTerm && (
              <Link
                href="/programs"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Browse Programs
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="p-6 hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Status Icon */}
                    <div
                      className={`p-3 rounded-lg flex-shrink-0 ${
                        course.status === 'approved'
                          ? 'bg-green-100'
                          : course.status === 'pending'
                          ? 'bg-yellow-100'
                          : 'bg-red-100'
                      }`}
                    >
                      {course.status === 'approved' ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : course.status === 'pending' ? (
                        <Clock className="h-6 w-6 text-yellow-600" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {course.programTitle}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Enrolled {course.enrolledAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                            course.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : course.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {course.status === 'approved' && <CheckCircle className="h-4 w-4" />}
                          {course.status === 'pending' && <Clock className="h-4 w-4" />}
                          {course.status === 'rejected' && <AlertCircle className="h-4 w-4" />}
                          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                        </span>

                        {course.status === 'pending' && (
                          <span className="text-sm text-gray-500">
                            Waiting for admin approval
                          </span>
                        )}

                        {course.status === 'rejected' && (
                          <span className="text-sm text-red-600">
                            Contact support for more info
                          </span>
                        )}
                      </div>

                      {/* Message if any */}
                      {course.message && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Your note: </span>
                            {course.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  {course.status === 'approved' && (
                    <div className="flex-shrink-0">
                      <Link
                        href={`/course/${course.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition whitespace-nowrap"
                      >
                        Start Learning
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Text */}
      {courses.some((c) => c.status === 'pending') && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Pending Enrollments
              </p>
              <p className="text-sm text-blue-700">
                Your enrollment requests are being reviewed by our admin team. 
                You&apos;ll receive an email notification once they&apos;re approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Student Info Display (for verification) */}
      {userProfile && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Logged in as:</span> {userProfile.fullName} ({userProfile.email})
          </p>
        </div>
      )}
    </div>
  );
}