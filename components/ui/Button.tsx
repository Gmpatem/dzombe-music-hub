import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'large' | 'small';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'default',
    loading = false,
    disabled,
    className = '',
    children,
    ...props
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c542] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

    const variants = {
      primary: 'bg-[#f5c542] text-[#0a1628] hover:bg-[#e5b532] hover:scale-105 hover:shadow-xl active:scale-98 shadow-md',
      secondary: 'bg-[#0a1628] text-white hover:bg-[#1a2638] hover:scale-105 hover:shadow-xl active:scale-98 shadow-md',
      outline: 'border-2 border-[#0a1628] text-[#0a1628] hover:bg-[#0a1628] hover:text-white hover:scale-105 active:scale-98',
      ghost: 'text-[#0a1628] hover:bg-[#0a1628]/10 hover:scale-105 active:scale-98'
    };

    const sizes = {
      small: 'h-10 px-4 text-sm min-h-[40px]',
      default: 'h-12 px-6 text-base min-h-[48px]',
      large: 'h-14 px-8 text-lg min-h-[56px]'
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
