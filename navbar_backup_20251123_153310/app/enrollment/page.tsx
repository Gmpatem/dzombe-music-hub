'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { Program } from '@/types/program';
import Link from 'next/link';
import { GraduationCap, CheckCircle, AlertCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function EnrollmentPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    programId: '',
    message: '',
  });

  // Fetch programs on component mount
  useEffect(() => {
    async function fetchPrograms() {
      try {
        const programsRef = collection(db, 'programs');
        const q = query(programsRef, where('isActive', '==', true));
        const querySnapshot = await getDocs(q);
        
        const fetchedPrograms: Program[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedPrograms.push({
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            price: data.price || 0,
            currency: data.currency || 'USD',
            duration: data.duration || '',
            category: data.category || '',
            level: data.level || '',
            isActive: data.isActive || false,
            createdAt: data.createdAt?.toDate?.() || new Date(),
          });
        });
        
        setPrograms(fetchedPrograms);
      } catch (error) {
        console.error('Error fetching programs:', error);
        toast.error('Failed to load programs');
      }
    }
    
    fetchPrograms();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.programId) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Get selected program details
      const selectedProgram = programs.find(p => p.id === formData.programId);
      
      if (!selectedProgram) {
        toast.error('Selected program not found');
        setLoading(false);
        return;
      }

      // Create enrollment document
      const enrollmentData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        programId: formData.programId,
        programName: selectedProgram.name,
        programPrice: selectedProgram.price,
        programCurrency: selectedProgram.currency,
        message: formData.message || '',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add to Firestore
      await addDoc(collection(db, 'enrollments'), enrollmentData);

      // Success!
      toast.success('Enrollment submitted successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        programId: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      toast.error('Failed to submit enrollment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />
      
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
              <Link href="/programs" className="text-gray-700 hover:text-blue-600 font-medium">
                Programs
              </Link>
              <Link href="/enrollment" className="text-blue-600 font-medium">
                Enroll
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Enroll Now
          </h1>
          <p className="text-xl text-blue-100">
            Start your musical journey today. Fill out the form below and we&apos;ll get back to you shortly.
          </p>
        </div>
      </div>

      {/* Enrollment Form */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+254 700 000 000"
              />
            </div>

            {/* Program Selection */}
            <div>
              <label htmlFor="programId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Program <span className="text-red-500">*</span>
              </label>
              <select
                id="programId"
                name="programId"
                value={formData.programId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name} - {program.currency}{program.price} ({program.duration})
                  </option>
                ))}
              </select>
            </div>

            {/* Message (Optional) */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about your musical background or any questions you have..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Submit Enrollment
                  </>
                )}
              </button>
            </div>

            {/* Info Text */}
            <p className="text-sm text-gray-500 text-center">
              By submitting this form, you agree to our terms and conditions. We will contact you within 24 hours.
            </p>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Quick Response</h3>
            <p className="text-sm text-gray-600">We respond to all enrollment requests within 24 hours</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Flexible Schedule</h3>
            <p className="text-sm text-gray-600">Choose class times that work for you</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">No Commitment</h3>
            <p className="text-sm text-gray-600">Try your first class before committing</p>
          </div>
        </div>
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