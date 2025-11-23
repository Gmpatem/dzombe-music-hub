'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show navbar on auth pages or admin pages
  if (pathname?.startsWith('/auth') || 
      pathname?.startsWith('/admin')) {
    return null;
  }

  const publicLinks = [
    { href: '/programs', label: 'Programs' },
  ];

  const authenticatedLinks = [
    { href: '/programs', label: 'Programs' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/profile', label: 'Profile' },
  ];

  // Use appropriate links based on auth state
  const navLinks = user ? authenticatedLinks : publicLinks;

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-white/10' 
            : 'bg-linear-to-b from-black/60 via-black/40 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
            {/* Logo - Enhanced with glow effect */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                {/* Logo background */}
                <div className="relative bg-linear-to-br from-blue-500 to-purple-600 p-2 sm:p-2.5 rounded-lg shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
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
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`relative px-5 py-2.5 font-semibold transition-all duration-300 rounded-lg ${
                    pathname === link.href 
                      ? 'text-white bg-white/20 shadow-lg' 
                      : 'text-gray-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {pathname === link.href && (
                    <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-lg"></div>
                  )}
                </Link>
              ))}
              
              {/* Show Get Started button only if user is NOT logged in */}
              {!user && (
                <Link 
                  href="/auth" 
                  className="relative ml-3 group/btn overflow-hidden"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-md opacity-60 group-hover/btn:opacity-100 transition-opacity"></div>
                  {/* Button */}
                  <div className="relative bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-7 py-3 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <span className="relative z-10">Get Started</span>
                  </div>
                </Link>
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
            className="absolute inset-0 bg-linear-to-b from-gray-900 via-gray-900 to-black backdrop-blur-xl"
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
                className={`block px-6 py-4 font-semibold rounded-xl transition-all text-lg ${
                  pathname === link.href 
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-2xl' 
                    : 'text-gray-200 hover:bg-white/10 active:bg-white/20'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Show Get Started button only if user is NOT logged in */}
            {!user && (
              <div className="pt-4 pb-2">
                <Link 
                  href="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block relative overflow-hidden rounded-xl group shadow-2xl"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                  <div className="relative px-6 py-5 text-center text-white font-bold text-lg">
                    Get Started Free
                  </div>
                </Link>
              </div>
            )}

            {/* Additional Info - Only show when not logged in */}
            {!user && (
              <div className="pt-8 pb-4 text-center">
                <p className="text-gray-300 text-sm font-semibold">
                  Premium Music Education
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Learn from expert instructors worldwide
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 sm:h-18 lg:h-20"></div>
    </>
  );
}