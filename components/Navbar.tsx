'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect - must be called before any early returns
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show navbar on auth pages or admin pages
  if (pathname?.startsWith('/login') || 
      pathname?.startsWith('/signup') || 
      pathname?.startsWith('/reset-password') ||
      pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { href: '/programs', label: 'Programs' },
    { href: '/enrollment', label: 'Enroll' },
  ];

  const userLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100' 
            : 'bg-white/80 backdrop-blur-md shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-linear-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  D&apos;Zombe
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium -mt-1">
                  Music Hub
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`relative px-4 py-2 font-semibold transition-all duration-300 rounded-lg group ${
                    pathname === link.href 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {pathname === link.href && (
                    <div className="absolute inset-0 bg-blue-50 rounded-lg"></div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              ))}
              
              {user ? (
                <>
                  {userLinks.map((link) => (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      className={`relative px-4 py-2 font-semibold transition-all duration-300 rounded-lg group ${
                        pathname === link.href 
                          ? 'text-blue-600' 
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      <span className="relative z-10">{link.label}</span>
                      {pathname === link.href && (
                        <div className="absolute inset-0 bg-blue-50 rounded-lg"></div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-gray-700 hover:text-blue-600 font-semibold px-4 py-2 transition-all duration-300 rounded-lg hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="relative ml-2 group"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300">
                      Get Started
                    </div>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-3">
              {user && (
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 font-semibold text-sm"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-screen opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-4 pb-6 space-y-2 bg-white/95 backdrop-blur-xl border-t border-gray-100">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 font-semibold rounded-lg transition-all ${
                  pathname === link.href 
                    ? 'bg-linear-to-r from-blue-50 to-purple-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <>
                {userLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 font-semibold rounded-lg transition-all ${
                      pathname === link.href 
                        ? 'bg-linear-to-r from-blue-50 to-purple-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-all"
                >
                  Login
                </Link>
                <Link 
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg font-bold text-center hover:shadow-xl transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
}