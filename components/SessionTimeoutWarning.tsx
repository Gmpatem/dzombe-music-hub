'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Clock, AlertTriangle } from 'lucide-react';

function CountdownTimer() {
  const [countdown, setCountdown] = useState(300); // 5 minutes = 300 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty deps - only runs once per mount

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <Clock className="h-8 w-8 text-yellow-500 animate-pulse" />
      <div className="text-center">
        <div className="text-4xl font-bold text-yellow-500 font-mono">
          {formatTime(countdown)}
        </div>
        <p className="text-sm text-gray-400 mt-1">until automatic logout</p>
      </div>
    </div>
  );
}

export default function SessionTimeoutWarning() {
  const { showTimeoutWarning, extendSession, logout } = useAuth();

  if (!showTimeoutWarning) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200" />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-yellow-500/20 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Session Expiring Soon</h3>
                <p className="text-sm text-gray-400">Your session is about to expire</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Countdown */}
            <CountdownTimer />

            {/* Message */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-300 text-sm leading-relaxed">
                You&apos;ve been inactive for a while. For your security, we&apos;ll log you out automatically 
                unless you choose to stay logged in.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => logout()}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg font-semibold transition-all"
              >
                Logout Now
              </button>
              <button
                onClick={extendSession}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}