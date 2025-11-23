import React from 'react';
import { LucideIcon } from 'lucide-react';
import Button from './Button';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}>
      <div className="bg-gradient-to-br from-[#0a1628]/10 to-[#f5c542]/10 p-6 rounded-full mb-6">
        <Icon className="h-12 w-12 text-[#0a1628]" />
      </div>
      <h3 className="text-2xl font-bold text-[#0a1628] mb-3">
        {title}
      </h3>
      <p className="text-gray-600 max-w-md mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
