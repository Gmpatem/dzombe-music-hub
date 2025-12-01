'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Mail, Phone, Calendar, Search, User } from 'lucide-react';
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
  const { user, userProfile } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchStudents() {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const enrollmentsSnapshot = await getDocs(collection(db, 'enrollments'));

        const fetchedStudents: Student[] = [];

        usersSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.role === 'student') {
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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Students</h1>
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
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.uid}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 rounded-full p-4 flex-shrink-0">
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
  );
}