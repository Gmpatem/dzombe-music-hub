import React from 'react';

export interface SectionProps {
  children: React.ReactNode;
  variant?: 'default' | 'alt';
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'bg-white',
    alt: 'bg-gray-50'
  };

  return (
    <section className={`w-full py-12 md:py-16 ${variants[variant]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default Section;
