import Link from 'next/link';
import { GraduationCap, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/programs', label: 'Programs' },
    { href: '/enrollment', label: 'Enroll Now' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/my-courses', label: 'My Courses' },
  ];

  const supportLinks = [
    { href: '/profile', label: 'My Profile' },
    { href: '/reset-password', label: 'Reset Password' },
    { href: 'mailto:support@dzombemusichub.com', label: 'Contact Support', external: true },
    { href: '#', label: 'FAQ' },
  ];

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook', color: 'hover:text-blue-400' },
    { href: '#', icon: Twitter, label: 'Twitter', color: 'hover:text-sky-400' },
    { href: '#', icon: Instagram, label: 'Instagram', color: 'hover:text-pink-400' },
  ];

  return (
    <footer className="bg-navy-900 text-white mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-gold-500 to-gold-600 p-2 rounded-xl shadow-lg">
                <GraduationCap className="h-6 w-6 text-navy-900" />
              </div>
              <span className="text-xl font-heading font-bold text-white">
                D&apos;Zombe
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering musicians through quality education and accessible learning.
            </p>
            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:info@dzombemusichub.com"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gold-500 transition-colors group"
              >
                <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-gold-500/10 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span>info@dzombemusichub.com</span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gold-500 transition-colors group"
              >
                <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-gold-500/10 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+1 (234) 567-890</span>
              </a>
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <div className="p-1.5 rounded-lg bg-white/5">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Music Education Center<br />Online Platform</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold-500 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-gold-500 transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-gold-500 transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-gold-500 transition-colors"></span>
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-gold-500 transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-gold-500 transition-colors"></span>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-white">Connect With Us</h3>

            {/* Social Links */}
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={`p-2.5 rounded-lg bg-white/5 border border-white/10 ${social.color} hover:bg-white/10 transition-all hover:scale-110 active:scale-95`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Subscribe to our newsletter</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center sm:text-left">
              &copy; {currentYear} D&apos;Zombe Music Hub. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-gold-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-gold-500 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-gold-500 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
    </footer>
  );
}
