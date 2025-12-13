import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 ${className}`}>
      {Icon && (
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <Icon className="h-12 w-12 text-gray-400" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-xl sm:text-2xl font-bold text-[#0a1628] font-['Playfair_Display',serif] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};
