'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, Calendar, Search, LogOut, User } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from 'sonner';

interface Student {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  createdAt: Date;
  enrollmentCount: number;
}

export default function AdminStudentsPage() {
  const { user, userProfile, logout, loading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    async function fetchStudents() {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const enrollmentsSnapshot = await getDocs(collection(db, 'enrollments'));

        const fetchedStudents: Student[] = [];

        usersSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.role === 'student') {
            // Count enrollments for this student
            const enrollmentCount = enrollmentsSnapshot.docs.filter(
              e => e.data().email === data.email
            ).length;

            fetchedStudents.push({
              uid: docSnap.id,
              email: data.email || '',
              fullName: data.fullName || '',
              phone: data.phone || '',
              role: data.role || 'student',
              createdAt: data.createdAt?.toDate() || new Date(),
              enrollmentCount,
            });
          }
        });

        // Sort by newest first
        fetchedStudents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setStudents(fetchedStudents);
        setFilteredStudents(fetchedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to load students');
      } finally {
        setLoadingData(false);
      }
    }

    if (user && userProfile?.role === 'admin') {
      fetchStudents();
    }
  }, [user, userProfile]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(s =>
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

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
              <Link href="/admin/enrollments" className="hover:text-blue-400 font-medium">
                Enrollments
              </Link>
              <Link href="/admin/students" className="text-blue-400 font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
          <p className="text-gray-600">View all registered students</p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-lg p-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">{students.length}</p>
              <p className="text-gray-600">Total Students</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Students List */}
        {loadingData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No students found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.uid}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 rounded-full p-4">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{student.fullName}</h3>
                    <p className="text-sm text-gray-500">{student.enrollmentCount} enrollments</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  {student.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{student.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>Joined {new Date(student.createdAt).toLocaleDateString()}</span>
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