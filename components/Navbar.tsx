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
            ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-white/10' 
            : 'bg-black/40 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
            {/* Logo - Simplified for mobile */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg blur-sm opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-linear-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg lg:text-xl font-bold text-white whitespace-nowrap">
                  D&apos;Zombe
                </span>
                <span className="text-[9px] sm:text-[10px] text-gray-300 font-medium -mt-0.5 whitespace-nowrap">
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
                  className={`relative px-4 py-2 font-semibold transition-all duration-300 rounded-lg ${
                    pathname === link.href 
                      ? 'text-white bg-white/10' 
                      : 'text-gray-200 hover:text-white hover:bg-white/5'
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
                      className={`relative px-4 py-2 font-semibold transition-all duration-300 rounded-lg ${
                        pathname === link.href 
                          ? 'text-white bg-white/10' 
                          : 'text-gray-200 hover:text-white hover:bg-white/5'
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
                    className="text-gray-200 hover:text-white font-semibold px-4 py-2 transition-all duration-300 rounded-lg hover:bg-white/5"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="relative ml-2 group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300">
                      Get Started
                    </div>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile: Hamburger Menu + Login */}
            <div className="flex lg:hidden items-center gap-2">
              {!user && (
                <Link 
                  href="/login" 
                  className="text-white font-semibold text-sm px-3 py-1.5 hover:bg-white/10 rounded-lg transition-all"
                >
                  Login
                </Link>
              )}
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
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
          className={`lg:hidden fixed inset-0 top-14 sm:top-16 z-40 transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'opacity-100 pointer-events-auto' 
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900/98 backdrop-blur-xl"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Content */}
          <div className="relative h-full overflow-y-auto px-4 py-6 space-y-2">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-5 py-4 font-semibold rounded-xl transition-all text-lg ${
                  pathname === link.href 
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-200 hover:bg-white/10 active:bg-white/20'
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
                    className={`block px-5 py-4 font-semibold rounded-xl transition-all text-lg ${
                      pathname === link.href 
                        ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'text-gray-200 hover:bg-white/10 active:bg-white/20'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            ) : (
              <>
                <div className="pt-4 pb-2">
                  <Link 
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block relative overflow-hidden rounded-xl group"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
                    <div className="relative px-5 py-4 text-center text-white font-bold text-lg">
                      Sign Up Free
                    </div>
                  </Link>
                </div>
              </>
            )}

            {/* Additional Info */}
            <div className="pt-8 pb-4 text-center">
              <p className="text-gray-400 text-sm">
                Premium Music Education
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Learn from expert instructors
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-14 sm:h-16 lg:h-20"></div>
    </>
  );
}