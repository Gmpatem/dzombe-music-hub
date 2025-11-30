import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', className = '' }) => {
  const sizeStyles = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeStyles[size]} text-[#f5c542] animate-spin`} aria-label="Loading" />
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} aria-label="Loading skeleton" />
  );
};

export const LoadingSkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <LoadingSkeleton className="h-6 w-3/4" />
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-2/3" />
      <div className="flex gap-2 mt-4">
        <LoadingSkeleton className="h-10 w-24" />
        <LoadingSkeleton className="h-10 w-24" />
      </div>
    </div>
  );
};

export const LoadingSkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <LoadingSkeleton className="h-6 w-48" />
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <LoadingSkeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <LoadingSkeleton className="h-4 w-1/4" />
              <LoadingSkeleton className="h-3 w-1/3" />
            </div>
            <LoadingSkeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};
