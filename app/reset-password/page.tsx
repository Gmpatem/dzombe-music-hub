'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import Link from 'next/link';
import { GraduationCap, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import PageContainer from '@/components/layouts/PageContainer';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
        setError('No account found with this email');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
        setError('Invalid email address');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Please try again later.');
        setError('Too many attempts. Please try again later.');
      } else {
        toast.error('Failed to send reset email. Please try again.');
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center animate-fade-in">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#1a2638] to-[#0a1628]">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <PageContainer className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md">
            <Card className="backdrop-blur-xl bg-white/95 border-white/20 shadow-2xl">
              <div className="p-8 text-center">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628] mb-4">
                  Check Your Email
                </h2>
                <p className="text-gray-600 mb-4">
                  We&apos;ve sent a password reset link to:
                </p>
                <p className="font-semibold text-[#0a1628] mb-6 text-lg">{email}</p>
                <p className="text-sm text-gray-600 mb-8">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
                <div className="space-y-3">
                  <Link href="/login">
                    <Button variant="primary" size="large" className="w-full">
                      Back to Login
                    </Button>
                  </Link>
                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                      setError('');
                    }}
                    className="block w-full text-gray-600 hover:text-[#0a1628] py-2 text-sm font-medium transition-colors"
                  >
                    Try a different email
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center animate-fade-in">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#1a2638] to-[#0a1628]">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Floating Accent Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#f5c542] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f5c542] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />

      <PageContainer className="relative z-10 flex items-center justify-center min-h-screen py-12">
        <div className="w-full max-w-md">
          {/* Logo and Heading */}
          <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
            <div className="bg-gradient-to-br from-[#f5c542] to-[#e5b532] p-3 rounded-xl shadow-xl group-hover:scale-105 transition-transform">
              <GraduationCap className="h-8 w-8 text-[#0a1628]" />
            </div>
            <span className="text-2xl font-bold text-white">D&apos;Zombe Music Hub</span>
          </Link>

          {/* Reset Password Card */}
          <Card className="backdrop-blur-xl bg-white/95 border-white/20 shadow-2xl">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-3">
                  Reset Password
                </h1>
                <p className="text-gray-600">
                  Enter your email and we&apos;ll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="email"
                  name="email"
                  label="Email Address"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  error={error}
                  required
                  leftIcon={<Mail className="h-5 w-5" />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  loading={loading}
                  className="w-full"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-[#f5c542] hover:text-[#e5b532] font-semibold transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </Card>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/80">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-[#f5c542] font-bold hover:text-white transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
