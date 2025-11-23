import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive';
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const baseStyles = 'bg-white rounded-xl border border-gray-200 transition-all duration-250';

    const variants = {
      default: 'shadow-md',
      elevated: 'shadow-xl',
      interactive: 'shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer'
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
