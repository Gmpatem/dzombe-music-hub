import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import Card from './Card';

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: 'up' | 'down';
  trendValue?: string;
  gradient?: boolean;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  trend,
  trendValue,
  gradient = false,
  className = ''
}) => {
  return (
    <Card
      variant="elevated"
      className={`p-6 ${gradient ? 'bg-gradient-to-br from-[#0a1628] to-[#1a2638] text-white' : ''} ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${gradient ? 'bg-white/20' : 'bg-[#f5c542]/20'}`}>
          <Icon className={`h-6 w-6 ${gradient ? 'text-[#f5c542]' : 'text-[#0a1628]'}`} />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className={`text-3xl font-bold mb-1 ${gradient ? 'text-white' : 'text-[#0a1628]'}`}>
        {value}
      </div>
      <div className={`text-sm font-medium ${gradient ? 'text-gray-300' : 'text-gray-600'}`}>
        {label}
      </div>
    </Card>
  );
};

export default StatCard;
