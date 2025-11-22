'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Navbar() {
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
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">D&apos;Zombe Music Hub</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className={`font-medium ${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Home
            </Link>
            <Link 
              href="/programs" 
              className={`font-medium ${isActive('/programs') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Programs
            </Link>
            <Link 
              href="/dashboard" 
              className={`font-medium ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/my-courses" 
              className={`font-medium ${isActive('/my-courses') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              My Courses
            </Link>
            <Link 
              href="/profile" 
              className={`font-medium ${isActive('/profile') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
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
  );
}