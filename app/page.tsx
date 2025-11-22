import Link from 'next/link';
import { GraduationCap, Music, Users, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">D&apos;Zombe Music Hub</span>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/programs" className="text-gray-700 hover:text-blue-600 font-medium">
                Programs
              </Link>
              <Link href="/enrollment" className="text-gray-700 hover:text-blue-600 font-medium">
                Enroll
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Your Musical Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Learn music from expert instructors with our comprehensive online programs. 
            From beginners to advanced students, we have the perfect course for you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/programs"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
            >
              View Programs
            </Link>
            <Link 
              href="/enrollment"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose D&apos;Zombe Music Hub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from experienced musicians with years of teaching experience
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
              <p className="text-gray-600">
                Learn at your own pace with our flexible online learning platform
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-gray-600">
                Join a vibrant community of music learners and share your journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Popular Programs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our range of music courses designed for all skill levels
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quick Program Cards */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="text-blue-600 font-semibold mb-2">Beginner</div>
              <h3 className="text-xl font-bold mb-2">Music Theory</h3>
              <p className="text-gray-600 text-sm mb-4">Learn the fundamentals</p>
              <div className="text-2xl font-bold text-blue-600">₱500</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="text-blue-600 font-semibold mb-2">Beginner</div>
              <h3 className="text-xl font-bold mb-2">Piano</h3>
              <p className="text-gray-600 text-sm mb-4">Start your journey</p>
              <div className="text-2xl font-bold text-blue-600">₱1000</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="text-blue-600 font-semibold mb-2">Beginner</div>
              <h3 className="text-xl font-bold mb-2">Violin</h3>
              <p className="text-gray-600 text-sm mb-4">Master the basics</p>
              <div className="text-2xl font-bold text-blue-600">₱1000</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="text-blue-600 font-semibold mb-2">Advanced</div>
              <h3 className="text-xl font-bold mb-2">Production</h3>
              <p className="text-gray-600 text-sm mb-4">Professional level</p>
              <div className="text-2xl font-bold text-blue-600">₱2000</div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/programs"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Musical Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of students learning music online with D&apos;Zombe Music Hub
          </p>
          <Link 
            href="/enrollment"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition"
          >
            Enroll Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6" />
            <span className="text-lg font-semibold">D&apos;Zombe Music Hub</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering musicians through quality online education
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 D&apos;Zombe Music Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}