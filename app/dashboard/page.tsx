'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Award,
  ArrowRight
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from 'sonner';

interface Enrollment {
  id: string;
  programTitle: string;
  status: string;
  enrolledAt: Date;
}

export default function DashboardOverviewPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // ✅ ADDED: Protect route - redirect if not logged in or if admin
  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to access dashboard');
      router.push('/auth');
      return;
    }

    // ✅ ADDED: Redirect admins to admin dashboard
    if (!loading && userProfile && userProfile.role === 'admin') {
      toast.info('Redirecting to admin dashboard');
      router.push('/admin');
      return;
    }
  }, [user, userProfile, loading, router]);

  // Fetch enrollments
  useEffect(() => {
    async function fetchEnrollments() {
      if (!userProfile?.email) return;

      try {
        const enrollmentsRef = collection(db, 'enrollments');
        const q = query(
          enrollmentsRef,
          where('studentEmail', '==', userProfile.email)
        );
        const snapshot = await getDocs(q);

        const data: Enrollment[] = [];
        snapshot.forEach((doc) => {
          const enrollment = doc.data();
          data.push({
            id: doc.id,
            programTitle: enrollment.programTitle || '',
            status: enrollment.status || 'pending',
            enrolledAt: enrollment.enrolledAt?.toDate() || new Date(),
          });
        });

        setEnrollments(data);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoadingData(false);
      }
    }

    fetchEnrollments();
  }, [userProfile]);

  // Calculate stats
  const stats = {
    total: enrollments.length,
    approved: enrollments.filter((e) => e.status === 'approved').length,
    pending: enrollments.filter((e) => e.status === 'pending').length,
    progress: enrollments.length > 0 
      ? Math.round((enrollments.filter((e) => e.status === 'approved').length / enrollments.length) * 100)
      : 0,
  };

  // Recent activity (last 3 enrollments)
  const recentActivity = enrollments
    .sort((a, b) => b.enrolledAt.getTime() - a.enrolledAt.getTime())
    .slice(0, 3);

  // Get first name from fullName
  const firstName = userProfile?.fullName?.split(' ')[0] || 'Student';

  // ✅ ADDED: Show loading state while checking auth
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

  // ✅ ADDED: Don't render if admin (will redirect)
  if (userProfile.role === 'admin') {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-gray-600">
          Here&apos;s an overview of your learning journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Courses */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Total Enrollments</p>
        </div>

        {/* Approved Courses */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.approved}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Approved Courses</p>
        </div>

        {/* Pending Courses */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 rounded-lg p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.pending}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Pending Approval</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.progress}%</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Approval Rate</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Link
                href="/dashboard/courses"
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loadingData ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No enrollments yet</p>
                <Link
                  href="/auth?tab=signup"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Enroll Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activity.status === 'approved'
                          ? 'bg-green-100'
                          : activity.status === 'pending'
                          ? 'bg-yellow-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      {activity.status === 'approved' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : activity.status === 'pending' ? (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {activity.programTitle}
                      </p>
                      <p className="text-sm text-gray-600">
                        Enrolled {activity.enrolledAt.toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        activity.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : activity.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/programs"
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition group"
              >
                <div className="bg-blue-600 rounded-lg p-2">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600">
                    Browse Programs
                  </p>
                  <p className="text-xs text-gray-600">Explore courses</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
              </Link>

              <Link
                href="/dashboard/courses"
                className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition group"
              >
                <div className="bg-green-600 rounded-lg p-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-green-600">
                    My Courses
                  </p>
                  <p className="text-xs text-gray-600">View enrollments</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600" />
              </Link>

              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition group"
              >
                <div className="bg-purple-600 rounded-lg p-2">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-purple-600">
                    Update Profile
                  </p>
                  <p className="text-xs text-gray-600">Edit your info</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600" />
              </Link>

              <Link
                href="/auth?tab=signup"
                className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition group"
              >
                <div className="bg-orange-600 rounded-lg p-2">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-orange-600">
                    Enroll Now
                  </p>
                  <p className="text-xs text-gray-600">Start new course</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600" />
              </Link>
            </div>
          </div>

          {/* Member Info */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 mt-6 text-white">
            <Calendar className="h-8 w-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Member since</p>
            <p className="text-lg font-bold">
              {new Date(userProfile?.createdAt || Date.now()).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}