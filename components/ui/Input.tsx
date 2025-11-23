import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    leftIcon,
    rightIcon,
    className = '',
    required,
    disabled,
    ...props
  }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-[#0a1628] mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full h-[52px] px-4 ${leftIcon ? 'pl-11' : ''} ${rightIcon ? 'pr-11' : ''} text-base bg-white border-2 ${
              error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#f5c542]'
            } rounded-xl transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-[#f5c542]/20 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            disabled={disabled}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
