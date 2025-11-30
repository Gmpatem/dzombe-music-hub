import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './Card';

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  trend,
  gradient = false,
  className = '',
}) => {
  return (
    <Card
      variant="elevated"
      className={`p-6 ${gradient ? 'bg-gradient-to-br from-[#0a1628] to-[#0a1628]/80 text-white' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-semibold mb-2 ${gradient ? 'text-[#f5c542]' : 'text-gray-600'}`}>
            {label}
          </p>
          <p className={`text-3xl font-bold font-['Playfair_Display',serif] ${gradient ? 'text-white' : 'text-[#0a1628]'}`}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-semibold ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={`rounded-lg p-3 ${gradient ? 'bg-white/10' : 'bg-[#f5c542]/10'}`}>
          <Icon className={`h-6 w-6 ${gradient ? 'text-[#f5c542]' : 'text-[#f5c542]'}`} aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
};
