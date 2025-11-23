'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Clock, TrendingUp, Award, GraduationCap, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import PageContainer from '@/components/layouts/PageContainer';
import PageHeader from '@/components/layouts/PageHeader';
import StatCard from '@/components/ui/StatCard';
import CourseCard from '@/components/ui/CourseCard';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';

interface Enrollment {
  id: string;
  programName: string;
  programPrice: number;
  programCurrency: string;
  programDuration?: string;
  programLevel?: string;
  programInstructor?: string;
  status: string;
  createdAt: Date;
}

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  // Protect route
  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to access the dashboard');
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch enrollments
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
            programCurrency: data.programCurrency || '₱',
            programDuration: data.programDuration || '8 weeks',
            programLevel: data.programLevel || 'Beginner',
            programInstructor: data.programInstructor || 'Music Instructor',
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

  // Loading state
  if (loading || !user || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalEnrollments = enrollments.length;
  const activeEnrollments = enrollments.filter(e => e.status === 'approved').length;
  const pendingEnrollments = enrollments.filter(e => e.status === 'pending').length;

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageContainer>
        {/* Welcome Banner */}
        <Card className="mb-8 overflow-hidden relative bg-gradient-to-br from-[#0a1628] to-[#1a2638] border-none animate-fade-in">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />

          {/* Floating Gold Orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f5c542] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

          <div className="relative p-8 md:p-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#f5c542] p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-[#0a1628]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {getGreeting()}, {userProfile.fullName?.split(' ')[0]}!
              </h1>
            </div>
            <p className="text-gray-300 text-lg">
              Welcome to your musical journey dashboard
            </p>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <StatCard
            icon={BookOpen}
            label="Total Courses"
            value={totalEnrollments}
            trend="up"
            trendValue="+2"
          />
          <StatCard
            icon={Clock}
            label="Active Courses"
            value={activeEnrollments}
            gradient
          />
          <StatCard
            icon={TrendingUp}
            label="Pending Approval"
            value={pendingEnrollments}
          />
          <StatCard
            icon={Award}
            label="Completed"
            value={0}
          />
        </div>

        {/* Page Header */}
        <PageHeader
          title="Your Courses"
          description="Manage your enrollments and track your progress"
          action={
            <Link href="/programs">
              <Button variant="primary">
                <Plus className="h-5 w-5" />
                Browse Programs
              </Button>
            </Link>
          }
        />

        {/* Courses Grid */}
        {loadingEnrollments ? (
          <div className="text-center py-16">
            <LoadingSpinner size="large" />
            <p className="text-gray-600 mt-4">Loading your courses...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="animate-fade-in">
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="Start your musical journey by enrolling in your first program"
              actionLabel="Browse Programs"
              onAction={() => router.push('/programs')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {enrollments.map((enrollment, index) => (
              <div
                key={enrollment.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-fade-in"
              >
                <CourseCard
                  title={enrollment.programName}
                  description={`Enrolled on ${new Date(enrollment.createdAt).toLocaleDateString()}`}
                  price={enrollment.programPrice}
                  currency={enrollment.programCurrency}
                  duration={enrollment.programDuration || '8 weeks'}
                  level={enrollment.programLevel as 'Beginner' | 'Intermediate' | 'Advanced' || 'Beginner'}
                  instructor={enrollment.programInstructor || 'Music Instructor'}
                  enrolled={enrollment.status === 'approved'}
                  progress={enrollment.status === 'approved' ? Math.floor(Math.random() * 60) + 20 : 0}
                  onEnroll={() => router.push(`/my-courses`)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {enrollments.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Card variant="interactive">
              <Link href="/programs" className="block p-6 text-center">
                <div className="bg-[#f5c542]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-[#0a1628]" />
                </div>
                <h3 className="font-bold text-lg text-[#0a1628] mb-2">Browse Programs</h3>
                <p className="text-gray-600 text-sm">
                  Explore more music courses
                </p>
              </Link>
            </Card>

            <Card variant="interactive">
              <Link href="/my-courses" className="block p-6 text-center">
                <div className="bg-[#f5c542]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-[#0a1628]" />
                </div>
                <h3 className="font-bold text-lg text-[#0a1628] mb-2">My Courses</h3>
                <p className="text-gray-600 text-sm">
                  View all your courses
                </p>
              </Link>
            </Card>

            <Card variant="interactive">
              <Link href="/profile" className="block p-6 text-center">
                <div className="bg-[#f5c542]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8 text-[#0a1628]" />
                </div>
                <h3 className="font-bold text-lg text-[#0a1628] mb-2">Profile Settings</h3>
                <p className="text-gray-600 text-sm">
                  Update your information
                </p>
              </Link>
            </Card>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
