'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GraduationCap, Menu, X, ChevronDown, LogOut, User, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showGetStartedDropdown, setShowGetStartedDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const getStartedRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (getStartedRef.current && !getStartedRef.current.contains(event.target as Node)) {
        setShowGetStartedDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Don't show navbar on auth pages, admin pages, or dashboard pages
  if (pathname?.startsWith('/auth') || pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) {
    return null; // Return completely nothing - no spacer
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
      setShowUserDropdown(false);
    } catch {
      toast.error('Failed to logout');
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-white/10' 
            : 'bg-gradient-to-b from-black/60 via-black/40 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
            
            {/* LEFT: Logo + School Name */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                {/* Logo background */}
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 sm:p-2.5 rounded-lg shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg lg:text-xl font-bold text-white whitespace-nowrap tracking-tight">
                  D&apos;Zombe
                </span>
                <span className="text-[10px] sm:text-xs text-blue-200 font-semibold -mt-1 whitespace-nowrap tracking-wider">
                  MUSIC HUB
                </span>
              </div>
            </Link>
            
            {/* RIGHT: Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              
              {/* Programs Link */}
              <Link 
                href="/programs" 
                className={`relative px-5 py-2.5 font-semibold transition-all duration-300 rounded-lg ${
                  pathname === '/programs' 
                    ? 'text-white bg-white/20 shadow-lg' 
                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="relative z-10">Programs</span>
                {pathname === '/programs' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg"></div>
                )}
              </Link>

              {/* Conditional: Get Started Dropdown OR User Menu */}
              {!user ? (
                /* GET STARTED DROPDOWN (Not logged in) */
                <div className="relative" ref={getStartedRef}>
                  <button
                    onClick={() => setShowGetStartedDropdown(!showGetStartedDropdown)}
                    className="relative ml-3 group/btn"
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-md opacity-60 group-hover/btn:opacity-100 transition-opacity"></div>
                    {/* Button */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-7 py-3 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                      <span className="relative z-10">Get Started</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showGetStartedDropdown ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showGetStartedDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        href="/auth?tab=signin"
                        onClick={() => setShowGetStartedDropdown(false)}
                        className="block px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth?tab=signup"
                        onClick={() => setShowGetStartedDropdown(false)}
                        className="block px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        Sign Up
                      </Link>
                      <Link
                        href="/auth?tab=signup"
                        onClick={() => setShowGetStartedDropdown(false)}
                        className="block px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white transition-colors border-t border-white/10"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                /* USER MENU DROPDOWN (Logged in) */
                <div className="relative ml-3" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-3 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white font-semibold text-sm">
                        {userProfile?.fullName?.split(' ')[0] || 'User'}
                      </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-300 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white font-semibold text-sm">{userProfile?.fullName}</p>
                        <p className="text-gray-400 text-xs mt-1">{userProfile?.email}</p>
                        {userProfile?.role && (
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                            {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                          </span>
                        )}
                      </div>

                      {/* Menu Items */}
                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      
                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border-t border-white/10"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile: Hamburger Menu */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10 shadow-lg"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-white" />
                ) : (
                  <Menu className="h-5 w-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Full Screen Overlay */}
        <div 
          className={`lg:hidden fixed inset-0 top-16 sm:top-18 z-40 transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'opacity-100 pointer-events-auto' 
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Backdrop with gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black backdrop-blur-xl"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Content */}
          <div className="relative h-full overflow-y-auto px-4 py-6 space-y-2">
            
            {/* Programs Link */}
            <Link 
              href="/programs"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-6 py-4 font-semibold rounded-xl transition-all text-lg ${
                pathname === '/programs' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl' 
                  : 'text-gray-200 hover:bg-white/10 active:bg-white/20'
              }`}
            >
              Programs
            </Link>

            {/* Conditional: Auth Links OR User Menu */}
            {!user ? (
              <>
                {/* Sign In */}
                <Link 
                  href="/auth?tab=signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-4 text-gray-200 hover:bg-white/10 active:bg-white/20 font-semibold rounded-xl transition-all text-lg"
                >
                  Sign In
                </Link>
                
                {/* Sign Up */}
                <Link 
                  href="/auth?tab=signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-4 text-gray-200 hover:bg-white/10 active:bg-white/20 font-semibold rounded-xl transition-all text-lg"
                >
                  Sign Up
                </Link>
                
                {/* Enroll CTA */}
                <div className="pt-4">
                  <Link 
                    href="/auth?tab=signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block relative overflow-hidden rounded-xl group shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                    <div className="relative px-6 py-5 text-center text-white font-bold text-lg">
                      Enroll Now
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* User Info */}
                <div className="px-6 py-4 bg-white/5 rounded-xl border border-white/10 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{userProfile?.fullName}</p>
                      <p className="text-gray-400 text-xs">{userProfile?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Dashboard */}
                <Link 
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 text-gray-200 hover:bg-white/10 active:bg-white/20 font-semibold rounded-xl transition-all text-lg"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>

                {/* Profile */}
                <Link 
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 text-gray-200 hover:bg-white/10 active:bg-white/20 font-semibold rounded-xl transition-all text-lg"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>

                {/* Settings */}
                <Link 
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 text-gray-200 hover:bg-white/10 active:bg-white/20 font-semibold rounded-xl transition-all text-lg"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>

                {/* Logout */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-6 py-4 text-red-400 hover:bg-red-500/10 active:bg-red-500/20 font-semibold rounded-xl transition-all text-lg mt-4 border border-red-500/20"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 sm:h-18 lg:h-20"></div>
    </>
  );
}