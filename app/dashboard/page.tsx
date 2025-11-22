'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, LogOut, User, BookOpen, Clock, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Enrollment {
  id: string;
  programName: string;
  programPrice: number;
  programCurrency: string;
  status: string;
  createdAt: Date;
}

export default function DashboardPage() {
  const { user, userProfile, logout, loading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  // Protect route - redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to access the dashboard');
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch user's enrollments
  useEffect(() => {
    async function fetchEnrollments() {
      if (!userProfile?.email) return;

      try {
        const enrollmentsRef = collection(db, 'enrollments');
        const q = query(enrollmentsRef, where('email', '==', userProfile.email));
        const querySnapshot = await getDocs(q);

        const fetchedEnrollments: Enrollment[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedEnrollments.push({
            id: doc.id,
            programName: data.programName || '',
            programPrice: data.programPrice || 0,
            programCurrency: data.programCurrency || 'USD',
            status: data.status || 'pending',
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        });

        setEnrollments(fetchedEnrollments);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        toast.error('Failed to load enrollments');
      } finally {
        setLoadingEnrollments(false);
      }
    }

    if (user && userProfile) {
      fetchEnrollments();
    }
  }, [user, userProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  // Show nothing while checking auth
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
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/programs" className="text-gray-700 hover:text-blue-600 font-medium">
                Programs
              </Link>
              <Link href="/dashboard" className="text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link href="/my-courses" className="text-gray-700 hover:text-blue-600 font-medium">
                My Courses
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                Profile
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

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userProfile.fullName}! 👋
          </h1>
          <p className="text-blue-100">
            Manage your enrollments and track your musical journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-6">
                  <User className="h-16 w-16 text-blue-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-center mb-4">{userProfile.fullName}</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>{userProfile.email}</span>
                </div>
                {userProfile.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span>{userProfile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-600">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="capitalize">{userProfile.role}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Member since</p>
                  <p className="text-sm font-semibold">
                    {new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className="mt-6">
                <Link
                  href="/profile"
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Enrollments Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Enrollments</h2>
                <Link
                  href="/programs"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  Browse Programs →
                </Link>
              </div>

              {loadingEnrollments ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading enrollments...</p>
                </div>
              ) : enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No enrollments yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start your musical journey by enrolling in a program
                  </p>
                  <Link
                    href="/enrollment"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Enroll Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {enrollment.programName}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                Enrolled on{' '}
                                {new Date(enrollment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600 mb-2">
                            {enrollment.programCurrency}{enrollment.programPrice}
                          </div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              enrollment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : enrollment.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Link
                href="/programs"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Browse Programs</h3>
                <p className="text-sm text-gray-600">Explore our music courses</p>
              </Link>
              <Link
                href="/enrollment"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Enroll in Program</h3>
                <p className="text-sm text-gray-600">Start a new course</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}