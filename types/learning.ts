export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'text' | 'quiz';
  content: string; // URL for video/pdf, or text content
  duration: number; // in minutes
  order: number;
  isPublished: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
}

export interface Course {
  id: string;
  programId: string;
  programName: string;
  description: string;
  modules: Module[];
  totalLessons: number;
  estimatedDuration: number; // in hours
  instructor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningProgress {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: string[]; // Array of lesson IDs
  currentLesson: string | null;
  progressPercentage: number;
  lastAccessedAt: Date;
  startedAt: Date;
  completedAt: Date | null;
}

export interface EnrollmentWithCourse {
  id: string;
  programId: string;
  programName: string;
  programPrice: number;
  programCurrency: string;
  status: string;
  createdAt: Date;
  courseId?: string;
  progress?: number;
}