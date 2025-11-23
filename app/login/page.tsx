'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import PageContainer from '@/components/layouts/PageContainer';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.includes('user-not-found') || error.message.includes('wrong-password') || error.message.includes('invalid-credential')) {
        toast.error('Invalid email or password');
        setErrors({
          email: 'Invalid credentials',
          password: 'Invalid credentials'
        });
      } else {
        toast.error(error.message || 'Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

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

          {/* Login Card */}
          <Card className="backdrop-blur-xl bg-white/95 border-white/20 shadow-2xl">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-3">
                  Welcome Back
                </h1>
                <p className="text-gray-600">
                  Sign in to continue your musical journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <Input
                  type="email"
                  name="email"
                  label="Email Address"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                  leftIcon={<Mail className="h-5 w-5" />}
                />

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-[#0a1628]">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <Link
                      href="/reset-password"
                      className="text-sm text-[#f5c542] hover:text-[#e5b532] font-semibold transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className={`w-full h-[52px] px-4 pl-11 pr-11 text-base bg-white border-2 ${
                        errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#f5c542]'
                      } rounded-xl transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-[#f5c542]/20`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0a1628] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    loading={loading}
                    className="w-full"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/signup"
                    className="text-[#f5c542] font-bold hover:text-[#e5b532] transition-colors"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </Card>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-white/80 hover:text-white transition-colors inline-flex items-center gap-2 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Back to home
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
