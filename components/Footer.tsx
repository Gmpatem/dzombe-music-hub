import Link from 'next/link';
import { GraduationCap, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">D&apos;Zombe Music Hub</span>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering musicians through quality education and accessible learning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/programs" className="text-gray-400 hover:text-white transition">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/enrollment" className="text-gray-400 hover:text-white transition">
                  Enroll Now
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/my-courses" className="text-gray-400 hover:text-white transition">
                  My Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-white transition">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/reset-password" className="text-gray-400 hover:text-white transition">
                  Reset Password
                </Link>
              </li>
              <li>
                <a href="mailto:support@dzombemusichub.com" className="text-gray-400 hover:text-white transition">
                  Contact Support
                </a>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail className="h-4 w-4" />
              <a href="mailto:info@dzombemusichub.com" className="hover:text-white transition">
                info@dzombemusichub.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} D&apos;Zombe Music Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}