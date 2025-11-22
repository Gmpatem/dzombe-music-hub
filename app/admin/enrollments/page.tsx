'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, CheckCircle, XCircle, Clock, Mail, Phone, LogOut, Search } from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from 'sonner';

interface Enrollment {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  programName: string;
  programPrice: number;
  programCurrency: string;
  status: string;
  message: string;
  createdAt: Date;
}

export default function AdminEnrollmentsPage() {
  const { user, userProfile, logout, loading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to access admin dashboard');
      router.push('/login');
      return;
    }

    if (!loading && userProfile && userProfile.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      router.push('/dashboard');
      return;
    }
  }, [user, userProfile, loading, router]);

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const enrollmentsSnapshot = await getDocs(collection(db, 'enrollments'));
        const fetchedEnrollments: Enrollment[] = [];

        enrollmentsSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedEnrollments.push({
            id: docSnap.id,
            fullName: data.fullName || '',
            email: data.email || '',
            phone: data.phone || '',
            programName: data.programName || '',
            programPrice: data.programPrice || 0,
            programCurrency: data.programCurrency || 'USD',
            status: data.status || 'pending',
            message: data.message || '',
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        });

        // Sort by newest first
        fetchedEnrollments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setEnrollments(fetchedEnrollments);
        setFilteredEnrollments(fetchedEnrollments);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        toast.error('Failed to load enrollments');
      } finally {
        setLoadingData(false);
      }
    }

    if (user && userProfile?.role === 'admin') {
      fetchEnrollments();
    }
  }, [user, userProfile]);

  useEffect(() => {
    let filtered = enrollments;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.programName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEnrollments(filtered);
  }, [searchTerm, statusFilter, enrollments]);

  const handleUpdateStatus = async (enrollmentId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'enrollments', enrollmentId), {
        status: newStatus,
        updatedAt: new Date(),
      });

      // Update local state
      setEnrollments(enrollments.map(e =>
        e.id === enrollmentId ? { ...e, status: newStatus } : e
      ));

      toast.success(`Enrollment ${newStatus}!`);
    } catch (error) {
      console.error('Error updating enrollment:', error);
      toast.error('Failed to update enrollment');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (loading || !user || !userProfile || userProfile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = {
    total: enrollments.length,
    pending: enrollments.filter(e => e.status === 'pending').length,
    approved: enrollments.filter(e => e.status === 'approved').length,
    rejected: enrollments.filter(e => e.status === 'rejected').length,
  };

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
              <Link href="/admin" className="hover:text-blue-400 font-medium">
                Overview
              </Link>
              <Link href="/admin/enrollments" className="text-blue-400 font-medium">
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

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Enrollments</h1>
          <p className="text-gray-600">Review and approve student enrollments</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <p className="text-sm text-yellow-800 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <p className="text-sm text-green-800 mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4">
            <p className="text-sm text-red-800 mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Enrollments List */}
        {loadingData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No enrollments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEnrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {enrollment.fullName}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{enrollment.email}</span>
                          </div>
                          {enrollment.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{enrollment.phone}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="font-semibold text-gray-900">
                            {enrollment.programName}
                          </span>
                          <span className="text-blue-600 font-bold">
                            {enrollment.programCurrency}{enrollment.programPrice}
                          </span>
                        </div>
                        {enrollment.message && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-2">
                            <strong>Message:</strong> {enrollment.message}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Enrolled on {new Date(enrollment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        enrollment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : enrollment.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : enrollment.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                    </span>

                    {enrollment.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(enrollment.id, 'approved')}
                          className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(enrollment.id, 'rejected')}
                          className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}