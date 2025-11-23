'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GraduationCap, LogOut, LayoutDashboard, Users, BookOpen, FileText, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';

export default function AdminNavbar() {
  const { logout, userProfile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch {
      toast.error('Failed to logout');
    }
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/enrollments', label: 'Enrollments', icon: FileText },
    { path: '/admin/students', label: 'Students', icon: Users },
    { path: '/admin/programs', label: 'Programs', icon: BookOpen },
  ];

  // Get user initials from fullName
  const getUserInitials = () => {
    if (!userProfile?.fullName) return 'AD';
    const names = userProfile.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-linear-to-br from-blue-500 to-purple-500 p-2.5 rounded-xl shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium -mt-1">
                D&apos;Zombe Music Hub
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={`relative group px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                    active
                      ? 'text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {active && (
                    <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg"></div>
                  )}
                  <div className={`absolute inset-0 bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'hidden' : ''}`}></div>
                  <Icon className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}

            {/* User Profile & Logout */}
            <div className="ml-4 flex items-center gap-3 pl-4 border-l border-gray-700">
              {userProfile && (
                <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                    {getUserInitials()}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-white">{userProfile.fullName}</div>
                    <div className="text-xs text-gray-400">Administrator</div>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="relative group"
              >
                <div className="absolute inset-0 bg-linear-to-r from-red-600 to-pink-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-linear-to-r hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold border border-gray-700 hover:border-transparent">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-screen opacity-100 pb-6' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="space-y-2 pt-4 border-t border-gray-700/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link 
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                    active
                      ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {userProfile && (
              <div className="flex items-center gap-3 px-4 py-3 mt-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                  {getUserInitials()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{userProfile.fullName}</div>
                  <div className="text-xs text-gray-400">Administrator</div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-all font-semibold mt-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}