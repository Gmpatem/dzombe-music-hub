import React from 'react';
import { Clock, User, BookOpen } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

export interface CourseCardProps {
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  instructor?: string;
  imageUrl?: string;
  progress?: number;
  enrolled?: boolean;
  onEnroll?: () => void;
  onContinue?: () => void;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  price,
  currency = '₱',
  level,
  duration,
  instructor,
  imageUrl,
  progress,
  enrolled = false,
  onEnroll,
  onContinue,
  className = '',
}) => {
  const gradients = {
    Beginner: 'from-blue-500 to-blue-600',
    Intermediate: 'from-purple-500 to-purple-600',
    Advanced: 'from-[#f5c542] to-orange-500',
  };

  return (
    <Card variant="interactive" className={className}>
      {/* Image or Gradient Placeholder */}
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${level ? gradients[level] : 'from-[#0a1628] to-[#0a1628]/80'} flex items-center justify-center`}>
            <BookOpen className="h-16 w-16 text-white/30" aria-hidden="true" />
          </div>
        )}
        {level && (
          <div className="absolute top-4 left-4">
            <Badge variant="accent" size="sm">
              {level}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#0a1628] font-['Playfair_Display',serif] mb-2 line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span>{duration}</span>
            </div>
          )}
          {instructor && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" aria-hidden="true" />
              <span>{instructor}</span>
            </div>
          )}
        </div>

        {/* Progress Bar (if enrolled) */}
        {enrolled && progress !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-[#0a1628]">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#f5c542] to-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          {price !== undefined ? (
            <div>
              <div className="text-2xl font-bold text-[#0a1628] font-['Playfair_Display',serif]">
                {currency}{price}
              </div>
              <div className="text-xs text-gray-500">per course</div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Course Info</div>
          )}

          {enrolled && onContinue ? (
            <Button variant="primary" size="sm" onClick={onContinue}>
              Continue
            </Button>
          ) : onEnroll ? (
            <Button variant="primary" size="sm" onClick={onEnroll}>
              Enroll
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
};
