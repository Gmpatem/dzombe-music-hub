import React from 'react';
import { Button } from '../ui/Button';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a1628] font-['Playfair_Display',serif]">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-base sm:text-lg text-gray-600">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            <Button
              variant="primary"
              onClick={action.onClick}
              loading={action.loading}
            >
              {action.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
