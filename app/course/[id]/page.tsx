'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, BookOpen, CheckCircle, PlayCircle, FileText, Video, ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'text';
  duration: number;
  isCompleted: boolean;
  content?: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

const initialModules: Module[] = [
  {
    id: '1',
    title: 'Introduction to Music Theory',
    isExpanded: true,
    lessons: [
      { id: '1-1', title: 'Welcome to the Course', type: 'video', duration: 5, isCompleted: true },
      { id: '1-2', title: 'Music Notation Basics', type: 'video', duration: 15, isCompleted: true },
      { id: '1-3', title: 'Reading Sheet Music', type: 'pdf', duration: 10, isCompleted: false },
      { id: '1-4', title: 'Practice Exercise 1', type: 'text', duration: 20, isCompleted: false },
    ],
  },
  {
    id: '2',
    title: 'Scales and Keys',
    isExpanded: false,
    lessons: [
      { id: '2-1', title: 'Major Scales', type: 'video', duration: 20, isCompleted: false },
      { id: '2-2', title: 'Minor Scales', type: 'video', duration: 20, isCompleted: false },
      { id: '2-3', title: 'Key Signatures', type: 'pdf', duration: 15, isCompleted: false },
      { id: '2-4', title: 'Practice Exercise 2', type: 'text', duration: 25, isCompleted: false },
    ],
  },
  {
    id: '3',
    title: 'Chords and Harmony',
    isExpanded: false,
    lessons: [
      { id: '3-1', title: 'Basic Chords', type: 'video', duration: 18, isCompleted: false },
      { id: '3-2', title: 'Chord Progressions', type: 'video', duration: 22, isCompleted: false },
      { id: '3-3', title: 'Harmony Principles', type: 'pdf', duration: 12, isCompleted: false },
      { id: '3-4', title: 'Final Exercise', type: 'text', duration: 30, isCompleted: false },
    ],
  },
];

export default function CoursePage() {
  const { user, userProfile, logout, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const enrollmentId = params?.id as string;

  const [courseName] = useState('Music Theory Fundamentals');
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(() => {
    // Initialize with first incomplete lesson
    const firstIncomplete = initialModules[0]?.lessons.find(l => !l.isCompleted);
    return firstIncomplete || initialModules[0]?.lessons[0] || null;
  });

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to access this course');
      router.push('/login');
    }
  }, [user, loading, router]);

  const toggleModule = (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
    ));
  };

  const markAsComplete = (lessonId: string) => {
    setModules(modules.map(m => ({
      ...m,
      lessons: m.lessons.map(l =>
        l.id === lessonId ? { ...l, isCompleted: true } : l
      ),
    })));
    
    // Update selected lesson state
    if (selectedLesson?.id === lessonId) {
      setSelectedLesson({ ...selectedLesson, isCompleted: true });
    }
    
    toast.success('Lesson marked as complete!');
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter(l => l.isCompleted).length,
    0
  );
  const progress = Math.round((completedLessons / totalLessons) * 100);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (loading || !user || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">D&apos;Zombe Music Hub</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/my-courses" className="text-gray-700 hover:text-blue-600 font-medium">
                ← Back to Courses
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Course Content */}
        <div className="w-96 bg-white border-r overflow-y-auto">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold mb-4">{courseName}</h2>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Your Progress</span>
                <span className="font-semibold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </div>
          </div>

          {/* Modules List */}
          <div className="p-4">
            {modules.map((module) => (
              <div key={module.id} className="mb-4">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                >
                  <span className="font-semibold text-gray-900">{module.title}</span>
                  {module.isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {module.isExpanded && (
                  <div className="mt-2 space-y-1">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                          selectedLesson?.id === lesson.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {lesson.isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : lesson.type === 'video' ? (
                          <Video className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        ) : lesson.type === 'pdf' ? (
                          <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-gray-900">
                            {lesson.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {lesson.duration} min
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Lesson Viewer */}
        <div className="flex-1 overflow-y-auto">
          {selectedLesson ? (
            <div className="max-w-4xl mx-auto p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  {selectedLesson.type === 'video' && <Video className="h-4 w-4" />}
                  {selectedLesson.type === 'pdf' && <FileText className="h-4 w-4" />}
                  {selectedLesson.type === 'text' && <BookOpen className="h-4 w-4" />}
                  <span className="capitalize">{selectedLesson.type}</span>
                  <span>•</span>
                  <span>{selectedLesson.duration} minutes</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedLesson.title}
                </h1>
              </div>

              {/* Lesson Content */}
              {selectedLesson.type === 'video' && (
                <div className="bg-black aspect-video rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-center text-white">
                    <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm opacity-75">
                      Video player would appear here
                    </p>
                    <p className="text-xs opacity-50 mt-2">
                      In production, integrate with Vimeo, YouTube, or custom video hosting
                    </p>
                  </div>
                </div>
              )}

              {selectedLesson.type === 'pdf' && (
                <div className="bg-gray-100 rounded-lg p-12 mb-6 text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">PDF Viewer would appear here</p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Download PDF
                  </button>
                </div>
              )}

              {selectedLesson.type === 'text' && (
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    This is a text-based lesson. In a real implementation, you would load
                    the lesson content from Firestore and display it here with rich formatting.
                  </p>
                  <h3>Learning Objectives:</h3>
                  <ul>
                    <li>Understand the fundamental concepts</li>
                    <li>Practice the techniques demonstrated</li>
                    <li>Complete the exercises provided</li>
                  </ul>
                  <h3>Practice Exercise:</h3>
                  <p>
                    Follow the instructions below to complete this lesson...
                  </p>
                </div>
              )}

              {/* Lesson Actions */}
              <div className="flex items-center justify-between pt-6 border-t">
                {!selectedLesson.isCompleted ? (
                  <button
                    onClick={() => markAsComplete(selectedLesson.id)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Mark as Complete
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Completed</span>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  Lesson {selectedLesson.id} of {totalLessons}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Select a lesson to start learning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}