'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Don't show footer on auth pages or admin pages
  if (pathname?.startsWith('/login') || 
      pathname?.startsWith('/signup') || 
      pathname?.startsWith('/reset-password') ||
      pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center sm:text-left grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">D&apos;Zombe Music Hub</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs mx-auto sm:mx-0">
              Empowering musicians through quality online education
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/programs" className="text-gray-400 hover:text-white transition">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/enrollment" className="text-gray-400 hover:text-white transition">
                  Enroll
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4 text-base">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white transition">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-400 hover:text-white transition">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-white transition">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-base">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="mailto:support@dzombemusic.com" 
                  className="text-gray-400 hover:text-white transition"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <Link 
                  href="/reset-password" 
                  className="text-gray-400 hover:text-white transition"
                >
                  Reset Password
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} D&apos;Zombe Music Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}