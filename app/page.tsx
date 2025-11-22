import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, Music, Users, Clock, Award, BookOpen, Star, ChevronRight, Play, Quote } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Mobile-Optimized Navigation - Transparent over hero */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                D&apos;Zombe
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link href="/programs" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Programs
              </Link>
              <Link href="/enrollment" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Enroll
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile CTA */}
            <div className="flex md:hidden gap-2">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-blue-600 font-medium text-sm px-3 py-2"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold text-sm hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax Image */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20">
        {/* Background Image with Overlay - Pianist in Blue Suit */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/images/First_pick.jpg"
              alt="Professional pianist"
              fill
              className="object-cover object-center"
              priority
              quality={90}
            />
            {/* Gradient Overlays for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 sm:mb-8 border border-white/20">
              <Award className="h-4 w-4" />
              <span>Premium Music Education</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Master Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-2">
                Musical Journey
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 sm:mb-10 leading-relaxed">
              Learn music from expert instructors with our comprehensive online programs. 
              From beginners to advanced students, we have the perfect course for you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/programs"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="h-5 w-5" />
                Explore Programs
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/enrollment"
                className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-base sm:text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
              >
                Enroll Now
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-12 sm:mt-16 flex flex-wrap items-center gap-6 sm:gap-8 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white"></div>
                  ))}
                </div>
                <div>
                  <div className="text-white font-bold text-lg">500+</div>
                  <div className="text-gray-300 text-xs">Active Students</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div>
                  <div className="text-white font-bold">4.9/5</div>
                  <div className="text-gray-300 text-xs">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Instructor Showcase Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Meet Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Expert Instructors</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
              Learn from professional musicians with years of performance and teaching experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Instructor Card 1 - Pianist in Pink */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500 transition-all duration-300">
              <div className="relative h-80 overflow-hidden">
                <Image
                  src="/images/third_pic_.jpg"
                  alt="Piano instructor"
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold mb-1">Piano & Keys</h3>
                <p className="text-gray-400 text-sm">Professional Instructor</p>
              </div>
            </div>

            {/* Instructor Card 2 - Violinist */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500 transition-all duration-300">
              <div className="relative h-80 overflow-hidden">
                <Image
                  src="/images/Second_pic.jpg"
                  alt="Violin instructor"
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold mb-1">Strings & Violin</h3>
                <p className="text-gray-400 text-sm">Master Instructor</p>
              </div>
            </div>

            {/* Instructor Card 3 - Performance */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-pink-500 transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="relative h-80 overflow-hidden">
                <Image
                  src="/images/FB_IMG_1760189938791.jpg"
                  alt="Performance instructor"
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold mb-1">Performance & Theory</h3>
                <p className="text-gray-400 text-sm">Lead Instructor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Background Image */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        {/* Background Image - Piano Keys */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/images.jpg"
            alt="Piano keys background"
            fill
            className="object-cover opacity-10"
            quality={70}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Experience world-class music education from anywhere
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature Cards with Premium Design */}
            <div className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-blue-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Music className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">Expert Instructors</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn from experienced musicians with years of teaching experience and industry expertise
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-purple-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">Flexible Schedule</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn at your own pace with our flexible online platform accessible 24/7
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-pink-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="bg-gradient-to-br from-pink-600 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">Community Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Join a vibrant community of music learners and share your journey together
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Popular Programs
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our range of courses designed for all skill levels
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Music Theory', level: 'Beginner', price: 500, gradient: 'from-blue-500 to-blue-600' },
              { name: 'Piano Fundamentals', level: 'Beginner', price: 1000, gradient: 'from-purple-500 to-purple-600' },
              { name: 'Violin Mastery', level: 'Intermediate', price: 1000, gradient: 'from-pink-500 to-pink-600' },
              { name: 'Music Production', level: 'Advanced', price: 2000, gradient: 'from-orange-500 to-orange-600' }
            ].map((program, index) => (
              <div 
                key={index}
                className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 bg-gradient-to-r ${program.gradient} text-white`}>
                  {program.level}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition">
                  {program.name}
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Comprehensive program for {program.level.toLowerCase()} level
                </p>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₱{program.price}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">per course</div>
                  </div>
                  <BookOpen className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <Link 
              href="/programs"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              View All Programs
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 sm:py-20 px-4 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Ready to Start?
              </h2>
              <p className="text-lg sm:text-xl mb-8 sm:mb-10 text-blue-100 max-w-2xl mx-auto">
                Join hundreds of students learning music online with D&apos;Zombe Music Hub
              </p>
              <Link 
                href="/enrollment"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Enroll Today
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                <li><Link href="/programs" className="text-gray-400 hover:text-white transition">Programs</Link></li>
                <li><Link href="/enrollment" className="text-gray-400 hover:text-white transition">Enroll</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-semibold mb-4 text-base">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="text-gray-400 hover:text-white transition">Login</Link></li>
                <li><Link href="/signup" className="text-gray-400 hover:text-white transition">Sign Up</Link></li>
                <li><Link href="/profile" className="text-gray-400 hover:text-white transition">Profile</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4 text-base">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@dzombemusic.com" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
                <li><Link href="/reset-password" className="text-gray-400 hover:text-white transition">Reset Password</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} D&apos;Zombe Music Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}