'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, LogOut, Menu, X, User, Home, BookOpen, LayoutDashboard, GraduationCapIcon } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    const closeMobileMenu = () => {
      setIsMobileMenuOpen(false);
    };
    closeMobileMenu();
  }, [pathname]);

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

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/programs', label: 'Programs', icon: BookOpen },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/my-courses', label: 'My Courses', icon: GraduationCapIcon },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-dark shadow-2xl'
            : 'bg-navy-900/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="bg-gradient-to-br from-gold-500 to-gold-600 p-2 rounded-xl shadow-lg group-hover:shadow-gold-500/50 transition-all duration-300">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-navy-900" />
              </div>
              <span className="text-lg sm:text-xl font-heading font-bold text-white">
                D&apos;Zombe
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-250 ${
                    isActive(link.href)
                      ? 'text-gold-500 bg-gold-500/10'
                      : 'text-gray-300 hover:text-gold-500 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop User Section */}
            <div className="hidden lg:flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-navy-900" />
                  </div>
                  <span className="text-sm font-medium text-white max-w-[120px] truncate">
                    {user.email}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-500/10 font-medium transition-all duration-250"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden xl:inline">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-250 active:scale-95"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide-in */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[280px] bg-navy-900 z-50 lg:hidden transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-gold-500 to-gold-600 p-2 rounded-lg">
                <GraduationCap className="h-5 w-5 text-navy-900" />
              </div>
              <span className="font-heading font-bold text-white">D&apos;Zombe</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-all active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Section */}
          {user && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-navy-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                  <p className="text-xs text-gray-400">Student</p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-250 ${
                      isActive(link.href)
                        ? 'text-gold-500 bg-gold-500/10 border border-gold-500/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile Logout Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-500/10 font-medium transition-all duration-250 active:scale-98"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
