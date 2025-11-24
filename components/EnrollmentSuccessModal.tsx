'use client';

import { CheckCircle, ArrowRight, Mail, Clock } from 'lucide-react';

interface EnrollmentSuccessModalProps {
  isOpen: boolean;
  programName: string;
  onClose: () => void;
}

export default function EnrollmentSuccessModal({ isOpen, programName, onClose }: EnrollmentSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200" />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-lg w-full border border-green-500/20 animate-in zoom-in-95 duration-200">
          
          {/* Header with Animation */}
          <div className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
              <CheckCircle className="h-12 w-12 text-green-500 animate-in spin-in duration-500" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-3">
              🎉 Welcome to D&apos;Zombe Music Hub!
            </h2>
            <p className="text-gray-400 text-lg">
              Your account has been created successfully
            </p>
          </div>

          {/* Content */}
          <div className="px-8 pb-8 space-y-6">
            {/* Success Details */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Account Created</p>
                  <p className="text-gray-400 text-sm">You can now access your student dashboard</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Enrolled in: {programName}</p>
                  <p className="text-gray-400 text-sm">Your enrollment is pending admin approval</p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                What&apos;s Next?
              </h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">1.</span>
                  <span>Wait for admin approval (usually within 24 hours)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">2.</span>
                  <span>Check your email for enrollment confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">3.</span>
                  <span>Access your dashboard to track progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">4.</span>
                  <span>Start your musical journey!</span>
                </li>
              </ul>
            </div>

            {/* Email Notice */}
            <div className="flex items-center gap-3 text-gray-400 text-sm bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <p>
                Check your inbox for a confirmation email with more details about your enrollment.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}