'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';

export default function AdminNavbar() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/admin" 
              className={`font-medium ${isActive('/admin') ? 'text-blue-400' : 'hover:text-blue-400'}`}
            >
              Overview
            </Link>
            <Link 
              href="/admin/enrollments" 
              className={`font-medium ${isActive('/admin/enrollments') ? 'text-blue-400' : 'hover:text-blue-400'}`}
            >
              Enrollments
            </Link>
            <Link 
              href="/admin/students" 
              className={`font-medium ${isActive('/admin/students') ? 'text-blue-400' : 'hover:text-blue-400'}`}
            >
              Students
            </Link>
            <Link 
              href="/admin/programs" 
              className={`font-medium ${isActive('/admin/programs') ? 'text-blue-400' : 'hover:text-blue-400'}`}
            >
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
  );
}