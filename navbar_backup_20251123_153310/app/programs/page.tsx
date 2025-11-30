import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Program } from '@/types/program';
import Link from 'next/link';
import { GraduationCap, Clock, BookOpen } from 'lucide-react';

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
        currency: data.currency || 'USD',
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">D&apos;Zombe Music Hub</span>
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/programs" className="text-blue-600 font-medium">
                Programs
              </Link>
              <Link href="/enrollment" className="text-gray-700 hover:text-blue-600 font-medium">
                Enroll
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Music Programs
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Choose from our comprehensive range of music courses designed for all skill levels
          </p>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No programs available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Program Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{program.name}</h3>
                  <div className="flex items-center gap-2 text-blue-100">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm capitalize">{program.level}</span>
                  </div>
                </div>

                {/* Program Body */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {program.description}
                  </p>

                  {/* Program Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-blue-600">
                        {program.currency}{program.price}
                      </span>
                    </div>
                  </div>

                  {/* Enroll Button */}
                  <Link
                    href="/enrollment"
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Enroll Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-12">
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