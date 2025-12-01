'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to access admin dashboard');
      router.push('/auth');
      return;
    }

    if (!loading && userProfile && userProfile.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      router.push('/dashboard');
      return;
    }
  }, [user, userProfile, loading, router]);

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
      <AdminSidebar />
      <main className="min-h-screen transition-all duration-300 lg:ml-64">
        <div className="max-w-7xl mx-auto p-4 pt-20 lg:pt-6 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}