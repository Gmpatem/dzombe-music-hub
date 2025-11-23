import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'accent' | 'success' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'medium', className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full';

    const variants = {
      primary: 'bg-[#0a1628] text-white',
      accent: 'bg-[#f5c542] text-[#0a1628]',
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white'
    };

    const sizes = {
      small: 'px-2 py-0.5 text-xs',
      medium: 'px-3 py-1 text-sm',
      large: 'px-4 py-1.5 text-base'
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
