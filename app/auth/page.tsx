'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Eye, EyeOff, LogIn, UserPlus, Music, Mail, Phone, Lock, User } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { Program } from '@/types/program';

export default function AuthPage() {
  const { login, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  
  // Sign In form data
  const [signinData, setSigninData] = useState({
    email: '',
    password: '',
  });

  // Sign Up + Enroll form data (combined)
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    programId: '',
    message: '',
  });

  // Set active tab from URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup') {
      setActiveTab('signup');
    }
  }, [searchParams]);

  // Fetch active programs for the dropdown
  useEffect(() => {
    async function fetchPrograms() {
      try {
        const programsRef = collection(db, 'programs');
        const q = query(programsRef, where('isActive', '==', true));
        const snapshot = await getDocs(q);
        const programsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Program[];
        setPrograms(programsList);
      } catch (error) {
        console.error('Error fetching programs:', error);
        toast.error('Failed to load programs');
      }
    }
    fetchPrograms();
  }, []);

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Login user (returns void)
      await login(signinData.email, signinData.password);
      
      // Get current user from auth
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('Login failed - no user found');
      }
      
      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data();
      
      toast.success('Welcome back!');
      
      // Redirect based on role
      if (userData?.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up + Enroll (combined action)
  const handleSignUpAndEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!signupData.firstName || !signupData.lastName || !signupData.email || 
        !signupData.phone || !signupData.password || !signupData.programId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create user account with full name (returns void)
      const fullName = `${signupData.firstName} ${signupData.lastName}`;
      await signup(
        signupData.email, 
        signupData.password, 
        fullName
      );
      
      // Get current user from auth after signup
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('Signup failed - no user found');
      }
      
      const userId = currentUser.uid;

      // Step 2: Create user profile in Firestore with 'student' role
      await setDoc(doc(db, 'users', userId), {
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        phone: signupData.phone,
        role: 'student', // Everyone starts as student
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // Step 3: Create enrollment
      const selectedProgram = programs.find(p => p.id === signupData.programId);
      
      await addDoc(collection(db, 'enrollments'), {
        userId,
        programId: signupData.programId,
        programTitle: selectedProgram?.name || '',
        studentName: fullName,
        studentEmail: signupData.email,
        studentPhone: signupData.phone,
        message: signupData.message || '',
        status: 'pending', // Admin will review
        enrolledAt: Timestamp.now(),
        createdAt: Timestamp.now(),
      });

      toast.success('Account created and enrolled successfully!');
      
      // Redirect to student dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <Toaster position="top-center" richColors />
      
      <div className="w-full max-w-5xl">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-linear-to-br from-blue-500 to-purple-600 p-3 rounded-lg shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white tracking-tight">
              D&apos;Zombe
            </span>
            <span className="text-xs text-blue-200 font-semibold -mt-1 tracking-wider">
              MUSIC HUB
            </span>
          </div>
        </Link>

        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-700/50">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-4 px-6 font-semibold text-lg transition-all relative ${
                activeTab === 'signin'
                  ? 'text-white bg-linear-to-r from-blue-600/20 to-purple-600/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LogIn className="inline-block w-5 h-5 mr-2" />
              Sign In
              {activeTab === 'signin' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 to-purple-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-4 px-6 font-semibold text-lg transition-all relative ${
                activeTab === 'signup'
                  ? 'text-white bg-linear-to-r from-blue-600/20 to-purple-600/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="inline-block w-5 h-5 mr-2" />
              Sign Up + Enroll
              {activeTab === 'signup' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 to-purple-600"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* SIGN IN TAB */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-6 max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-gray-400">Sign in to continue your musical journey</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Mail className="inline-block w-4 h-4 mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={signinData.email}
                    onChange={(e) => setSigninData({ ...signinData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Lock className="inline-block w-4 h-4 mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signinData.password}
                      onChange={(e) => setSigninData({ ...signinData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                {/* Footer */}
                <p className="text-center text-gray-400 text-sm mt-6">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('signup')}
                    className="text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Sign Up Now
                  </button>
                </p>
              </form>
            )}

            {/* SIGN UP + ENROLL TAB */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUpAndEnroll} className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Start Your Journey</h2>
                  <p className="text-gray-400">Create an account and enroll in a program</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <User className="inline-block w-4 h-4 mr-2" />
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={signupData.firstName}
                      onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="John"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <User className="inline-block w-4 h-4 mr-2" />
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={signupData.lastName}
                      onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <Mail className="inline-block w-4 h-4 mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <Phone className="inline-block w-4 h-4 mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <Lock className="inline-block w-4 h-4 mr-2" />
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Minimum 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <Lock className="inline-block w-4 h-4 mr-2" />
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Re-enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Program Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Music className="inline-block w-4 h-4 mr-2" />
                    Select Program *
                  </label>
                  <select
                    required
                    title="Select a program to enroll in"
                    value={signupData.programId}
                    onChange={(e) => setSignupData({ ...signupData, programId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Choose a program...</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name} - {program.level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={signupData.message}
                    onChange={(e) => setSignupData({ ...signupData, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your musical background or goals..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'Creating Account...' : 'Create Account & Enroll'}
                </button>

                {/* Footer */}
                <p className="text-center text-gray-400 text-sm mt-6">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('signin')}
                    className="text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}