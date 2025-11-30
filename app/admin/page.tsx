'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  DollarSign, 
  LogOut,
  TrendingUp,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from 'sonner';

interface DashboardStats {
  totalStudents: number;
  totalEnrollments: number;
  pendingEnrollments: number;
  totalPrograms: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const { user, userProfile, logout, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalEnrollments: 0,
    pendingEnrollments: 0,
    totalPrograms: 0,
    totalRevenue: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to access admin dashboard');
      router.push('/login');
      return;
    }

    // Check if user is admin
    if (!loading && userProfile && userProfile.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      router.push('/dashboard');
      return;
    }
  }, [user, userProfile, loading, router]);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch students
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalStudents = usersSnapshot.docs.filter(
          doc => doc.data().role === 'student'
        ).length;

        // Fetch enrollments
        const enrollmentsSnapshot = await getDocs(collection(db, 'enrollments'));
        const totalEnrollments = enrollmentsSnapshot.size;
        const pendingEnrollments = enrollmentsSnapshot.docs.filter(
          doc => doc.data().status === 'pending'
        ).length;

        // Fetch programs
        const programsSnapshot = await getDocs(collection(db, 'programs'));
        const totalPrograms = programsSnapshot.size;

        // Calculate revenue (from paid enrollments)
        let totalRevenue = 0;
        enrollmentsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.status === 'paid' || data.status === 'approved') {
            totalRevenue += data.programPrice || 0;
          }
        });

        setStats({
          totalStudents,
          totalEnrollments,
          pendingEnrollments,
          totalPrograms,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load statistics');
      } finally {
        setLoadingStats(false);
      }
    }

    if (user && userProfile?.role === 'admin') {
      fetchStats();
    }
  }, [user, userProfile]);

  const handleLogout = async () => {
  try {
    await logout();
    toast.success('Logged out successfully');
    window.location.href = '/auth';  // ✅ Hard redirect (clears cache)
  } catch (error) {
    toast.error('Failed to logout');
  }
};
  if (loading || !user || !userProfile || userProfile.role !== 'admin') {
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
      {/* Admin Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-blue-400 font-medium">
                Overview
              </Link>
              <Link href="/admin/enrollments" className="hover:text-blue-400 font-medium">
                Enrollments
              </Link>
              <Link href="/admin/students" className="hover:text-blue-400 font-medium">
                Students
              </Link>
              <Link href="/admin/programs" className="hover:text-blue-400 font-medium">
                Programs
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-red-400 font-medium"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {userProfile.fullName}
          </h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening with your school today
          </p>
        </div>

        {/* Stats Grid */}
        {loadingStats ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Students */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.totalStudents}
                </h3>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>

              {/* Total Enrollments */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 rounded-lg p-3">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.totalEnrollments}
                </h3>
                <p className="text-sm text-gray-600">Total Enrollments</p>
              </div>

              {/* Pending Enrollments */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-100 rounded-lg p-3">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  {stats.pendingEnrollments > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {stats.pendingEnrollments}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.pendingEnrollments}
                </h3>
                <p className="text-sm text-gray-600">Pending Approval</p>
              </div>

              {/* Total Revenue */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  ₱{stats.totalRevenue.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Link
                href="/admin/enrollments"
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Manage Enrollments
                    </h3>
                    <p className="text-sm text-gray-600">
                      Review and approve enrollments
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/students"
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-lg p-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      View Students
                    </h3>
                    <p className="text-sm text-gray-600">
                      See all registered students
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/programs"
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Manage Programs
                    </h3>
                    <p className="text-sm text-gray-600">
                      Add, edit, or remove programs
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Activity tracking coming soon...</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}