import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Program } from '@/types/program';
import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, Clock, BookOpen, Star, Award, ChevronRight, Music } from 'lucide-react';

async function getPrograms(): Promise<Program[]> {
  try {
    const programsRef = collection(db, 'programs');
    const q = query(programsRef, where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    
    const programs: Program[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      programs.push({
        id: doc.id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        currency: data.currency || '₱',
        duration: data.duration || '',
        category: data.category || '',
        level: data.level || '',
        isActive: data.isActive || false,
        createdAt: data.createdAt?.toDate?.() || new Date('2025-01-01'),
      });
    });
    
    // Sort by creation date (newest first)
    programs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return programs;
  } catch (error) {
    console.error('Error fetching programs:', error);
    return [];
  }
}

export default async function ProgramsPage() {
  const programs = await getPrograms();

  // Get gradient based on level
  const getLevelGradient = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'from-blue-500 to-blue-600';
      case 'intermediate':
        return 'from-purple-500 to-purple-600';
      case 'advanced':
        return 'from-pink-500 to-pink-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/images/images.jpg"
              alt="Music programs background"
              fill
              className="object-cover object-center"
              priority
              quality={90}
              sizes="100vw"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/70 to-black/60"></div>
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <Award className="h-4 w-4" />
            <span>Expert-Led Courses</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Our Music 
            <span className="block bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
              Programs
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed">
            Choose from our comprehensive range of music courses designed for all skill levels. 
            From beginners to advanced musicians, we have the perfect program for you.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12 text-sm">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-blue-400" />
              <div className="text-left">
                <div className="text-white font-bold text-lg">{programs.length}+</div>
                <div className="text-gray-300 text-xs">Active Programs</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-400" />
              <div className="text-left">
                <div className="text-white font-bold text-lg">500+</div>
                <div className="text-gray-300 text-xs">Students Enrolled</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg">4.9/5</div>
                <div className="text-gray-300 text-xs">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section with Glowing Orbs */}
      <section className="relative py-16 sm:py-24 bg-gray-900 overflow-hidden">
        {/* Floating gradient orbs */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl [animation-delay:1s] animate-pulse"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl [animation-delay:2s] animate-pulse"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {programs.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/10 backdrop-blur-lg p-12 rounded-2xl border border-white/10 shadow-lg max-w-md mx-auto">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg font-medium mb-2">No programs available</p>
                <p className="text-gray-400 text-sm">Check back soon for new courses!</p>
              </div>
            </div>
          ) : (
            <>
              {/* Section Header */}
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  All Programs
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Select the program that matches your skill level and musical goals
                </p>
              </div>

              {/* Programs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="group bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                  >
                    {/* Program Header with Gradient */}
                    <div className={`relative bg-linear-to-r ${getLevelGradient(program.level)} p-6 text-white overflow-hidden`}>
                      {/* Decorative circles */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full opacity-10 -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full opacity-10 translate-y-12 -translate-x-12"></div>
                      
                      <div className="relative z-10">
                        {/* Level Badge */}
                        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-3 border border-white/30">
                          {program.level}
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform">
                          {program.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-white/90">
                          <BookOpen className="h-4 w-4" />
                          <span className="text-sm">{program.category || 'Music Education'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Program Body */}
                    <div className="p-6">
                      <p className="text-gray-300 mb-6 leading-relaxed line-clamp-3 min-h-18">
                        {program.description || 'Comprehensive music program designed to help you master your craft.'}
                      </p>

                      {/* Program Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-200">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Duration</div>
                            <div className="text-sm font-semibold">{program.duration}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <div>
                            <div className="text-xs text-gray-400 mb-1">Course Fee</div>
                            <div className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                              {program.currency}{program.price}
                            </div>
                          </div>
                          <Award className="h-8 w-8 text-gray-600 group-hover:text-blue-400 transition-colors" />
                        </div>
                      </div>

                      {/* Enroll Button */}
                      <Link
                        href="/login"
                        className="group/btn relative block w-full overflow-hidden rounded-lg"
                      >
                        <div className={`absolute inset-0 bg-linear-to-r ${getLevelGradient(program.level)} opacity-90 group-hover/btn:opacity-100 transition-opacity`}></div>
                        <div className="relative flex items-center justify-center gap-2 py-3 text-white font-bold">
                          <span>Enroll Now</span>
                          <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10 [animation-delay:1s] animate-pulse"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Ready to Start Learning?
              </h2>
              <p className="text-lg sm:text-xl mb-8 sm:mb-10 text-blue-100 max-w-2xl mx-auto">
                Join hundreds of students mastering music with D&apos;Zombe Music Hub. 
                Enroll today and begin your musical journey!
              </p>
              <Link 
                href="/login"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Enroll Now
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}