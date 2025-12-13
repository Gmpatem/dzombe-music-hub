import React from 'react';

export interface SectionProps {
  children: React.ReactNode;
  variant?: 'default' | 'alt' | 'dark';
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-white',
    alt: 'bg-gray-50',
    dark: 'bg-[#0a1628] text-white',
  };

  return (
    <section className={`w-full py-12 sm:py-16 lg:py-20 ${variantStyles[variant]} ${className}`}>
      {children}
    </section>
  );
};
