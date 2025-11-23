import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'h-4 w-4 border-2',
    medium: 'h-6 w-6 border-2',
    large: 'h-10 w-10 border-3'
  };

  return (
    <div
      className={`${sizes[size]} border-[#f5c542] border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
