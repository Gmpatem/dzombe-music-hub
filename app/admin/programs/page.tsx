'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  GraduationCap, 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  Search,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from 'sonner';

interface Program {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  level: string;
  instructor: string;
  isPublished: boolean;
  createdAt: Date;
}

export default function AdminProgramsPage() {
  const { user, userProfile, logout, loading } = useAuth();
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: '₱',
    duration: '',
    level: 'Beginner',
    instructor: '',
    isPublished: true,
  });

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to access admin dashboard');
      router.push('/login');
      return;
    }

    if (!loading && userProfile && userProfile.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      router.push('/dashboard');
      return;
    }
  }, [user, userProfile, loading, router]);

  const fetchPrograms = async () => {
    if (!user || userProfile?.role !== 'admin') return;

    try {
      const programsSnapshot = await getDocs(collection(db, 'programs'));
      const fetchedPrograms: Program[] = [];

      programsSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedPrograms.push({
          id: docSnap.id,
          name: data.name || '',
          description: data.description || '',
          price: data.price || 0,
          currency: data.currency || '₱',
          duration: data.duration || '',
          level: data.level || 'Beginner',
          instructor: data.instructor || '',
          isPublished: data.isPublished !== false,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });

      fetchedPrograms.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setPrograms(fetchedPrograms);
      setFilteredPrograms(fetchedPrograms);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Failed to load programs');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = programs.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPrograms(filtered);
    } else {
      setFilteredPrograms(programs);
    }
  }, [searchTerm, programs]);

  const openModal = (program?: Program) => {
    if (program) {
      setEditingProgram(program);
      setFormData({
        name: program.name,
        description: program.description,
        price: program.price.toString(),
        currency: program.currency,
        duration: program.duration,
        level: program.level,
        instructor: program.instructor,
        isPublished: program.isPublished,
      });
    } else {
      setEditingProgram(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        currency: '₱',
        duration: '',
        level: 'Beginner',
        instructor: '',
        isPublished: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProgram(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      currency: '₱',
      duration: '',
      level: 'Beginner',
      instructor: '',
      isPublished: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.duration) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const programData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        duration: formData.duration,
        level: formData.level,
        instructor: formData.instructor,
        isPublished: formData.isPublished,
        updatedAt: new Date(),
      };

      if (editingProgram) {
        await updateDoc(doc(db, 'programs', editingProgram.id), programData);
        toast.success('Program updated successfully!');
      } else {
        await addDoc(collection(db, 'programs'), {
          ...programData,
          createdAt: new Date(),
        });
        toast.success('Program added successfully!');
      }

      closeModal();
      fetchPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error('Failed to save program');
    }
  };

  const handleDelete = async (programId: string, programName: string) => {
    if (!confirm(`Are you sure you want to delete "${programName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'programs', programId));
      toast.success('Program deleted successfully!');
      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Failed to delete program');
    }
  };

  const togglePublish = async (programId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'programs', programId), {
        isPublished: !currentStatus,
        updatedAt: new Date(),
      });
      toast.success(`Program ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
      fetchPrograms();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Failed to update program');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
    }
  };

  if (loading || !user || !userProfile || userProfile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/admin" className="hover:text-blue-400 font-medium">
                Overview
              </Link>
              <Link href="/admin/enrollments" className="hover:text-blue-400 font-medium">
                Enrollments
              </Link>
              <Link href="/admin/students" className="hover:text-blue-400 font-medium">
                Students
              </Link>
              <Link href="/admin/programs" className="text-blue-400 font-medium">
                Programs
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-red-400 font-medium"
                aria-label="Logout from admin dashboard"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Programs</h1>
            <p className="text-gray-600">Add, edit, or remove music programs</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            aria-label="Add new program"
            title="Add new program"
          >
            <Plus className="h-5 w-5" />
            Add Program
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs by name or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Search programs"
            />
          </div>
        </div>

        {/* Programs Grid */}
        {loadingData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No programs found</p>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
              aria-label="Add your first program"
              title="Add your first program"
            >
              Add Your First Program
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition ${
                  !program.isPublished ? 'opacity-60' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                  <button
                    onClick={() => togglePublish(program.id, program.isPublished)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={program.isPublished ? `Unpublish ${program.name}` : `Publish ${program.name}`}
                    title={program.isPublished ? "Unpublish program" : "Publish program"}
                  >
                    {program.isPublished ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {program.description}
                </p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-blue-600">
                      {program.currency}{program.price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{program.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-semibold">{program.level}</span>
                  </div>
                  {program.instructor && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Instructor:</span>
                      <span className="font-semibold">{program.instructor}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(program)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-semibold"
                    aria-label={`Edit ${program.name}`}
                    title="Edit program"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(program.id, program.name)}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition text-sm font-semibold"
                    aria-label={`Delete ${program.name}`}
                    title="Delete program"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {!program.isPublished && (
                  <p className="text-xs text-gray-500 mt-2 text-center">Unpublished</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingProgram ? 'Edit Program' : 'Add New Program'}
              </h2>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
                title="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Guitar Fundamentals"
                  required
                  aria-label="Program name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the program..."
                  aria-label="Program description"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="5000"
                    required
                    aria-label="Program price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Select currency"
                    title="Select currency"
                  >
                    <option value="₱">₱ (PHP)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 8 weeks"
                    required
                    aria-label="Program duration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Select program level"
                    title="Select program level"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor
                </label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Instructor name"
                  aria-label="Instructor name"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  aria-label="Publish program"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                  Publish program (visible to students)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                  aria-label="Cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  aria-label={editingProgram ? 'Update program' : 'Add program'}
                >
                  {editingProgram ? 'Update Program' : 'Add Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}