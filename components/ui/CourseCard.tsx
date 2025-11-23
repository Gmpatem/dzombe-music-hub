import React from 'react';
import { Clock, User } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';

export interface CourseCardProps {
  title: string;
  description: string;
  price: number;
  currency?: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  instructor: string;
  image?: string;
  enrolled?: boolean;
  progress?: number;
  onEnroll?: () => void;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  price,
  currency = '₱',
  duration,
  level,
  instructor,
  image,
  enrolled = false,
  progress = 0,
  onEnroll,
  className = ''
}) => {
  const levelColors = {
    'Beginner': 'success',
    'Intermediate': 'info',
    'Advanced': 'error',
    'All Levels': 'accent'
  } as const;

  return (
    <Card variant="interactive" className={`overflow-hidden flex flex-col ${className}`}>
      {/* Image or Gradient Placeholder */}
      <div className="h-48 relative overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0a1628] to-[#1a2638] flex items-center justify-center">
            <span className="text-4xl font-bold text-[#f5c542] opacity-50">
              {title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={levelColors[level]}>
            {level}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-[#0a1628] mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Info Row */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{instructor}</span>
          </div>
        </div>

        {/* Progress Bar (if enrolled) */}
        {enrolled && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-[#0a1628]">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#f5c542] to-[#e5b532] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <div className="text-2xl font-bold text-[#0a1628]">
              {currency}{price.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">per course</div>
          </div>
          {onEnroll && (
            <Button
              variant={enrolled ? 'secondary' : 'primary'}
              size="default"
              onClick={onEnroll}
            >
              {enrolled ? 'Continue' : 'Enroll'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
