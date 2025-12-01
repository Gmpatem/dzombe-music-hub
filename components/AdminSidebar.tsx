'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Plus,
  List,
  Archive,
  CheckCircle,
  Clock,
  UserCheck,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';

export default function AdminSidebar() {
  const { logout, userProfile } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([pathname?.split('/')[2] || 'overview']);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      window.location.href = '/auth';
    } catch {
      toast.error('Failed to logout');
    }
  };

  const isActive = (path: string) => pathname === path;
  const isSectionActive = (path: string) => pathname?.startsWith(path);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const navItems = [
    { 
      path: '/admin', 
      label: 'Overview', 
      icon: LayoutDashboard,
      section: 'overview'
    },
    { 
      path: '/admin/enrollments', 
      label: 'Enrollments', 
      icon: FileText,
      section: 'enrollments',
      subItems: [
        { path: '/admin/enrollments#pending', label: 'Pending', icon: Clock },
        { path: '/admin/enrollments#approved', label: 'Approved', icon: CheckCircle },
        { path: '/admin/enrollments#all', label: 'All Enrollments', icon: List },
      ]
    },
    { 
      path: '/admin/students', 
      label: 'Students', 
      icon: Users,
      section: 'students',
      subItems: [
        { path: '/admin/students#active', label: 'Active Students', icon: UserCheck },
        { path: '/admin/students#all', label: 'All Students', icon: List },
      ]
    },
    { 
      path: '/admin/programs', 
      label: 'Programs', 
      icon: BookOpen,
      section: 'programs',
      subItems: [
        { path: '/admin/programs#add', label: 'Add Program', icon: Plus },
        { path: '/admin/programs#active', label: 'Active Programs', icon: List },
        { path: '/admin/programs#archived', label: 'Archived', icon: Archive },
      ]
    },
  ];

  const getUserInitials = () => {
    if (!userProfile?.fullName) return 'AD';
    const names = userProfile.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  // Render sidebar content inline instead of as separate component
  const renderSidebarContent = () => (
    <>
      <div className="p-4 border-b border-white/10">
        {userProfile && (
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white flex-shrink-0">
              {getUserInitials()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{userProfile.fullName}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                  Admin
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const sectionActive = isSectionActive(item.path);
          const isExpanded = expandedSections.includes(item.section);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          
          return (
            <div key={item.path}>
              <div className="flex items-center">
                <Link 
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : sectionActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium flex-1">{item.label}</span>
                  )}
                </Link>
                
                {!isCollapsed && hasSubItems && (
                  <button
                    onClick={() => toggleSection(item.section)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    aria-label={isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
                  >
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                )}
              </div>

              {!isCollapsed && hasSubItems && isExpanded && (
                <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-4">
                  {item.subItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const subActive = pathname === subItem.path || pathname + window.location.hash === subItem.path;
                    
                    return (
                      <a
                        key={subItem.path}
                        href={subItem.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          subActive
                            ? 'bg-blue-500/20 text-blue-300 font-medium'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <SubIcon className="h-4 w-4 flex-shrink-0" />
                        <span>{subItem.label}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => {
            handleLogout();
            setIsMobileMenuOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all duration-300 border border-red-500/20 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>

      <div className="hidden lg:block p-4 border-t border-white/10">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gray-900/95 backdrop-blur-xl rounded-lg border border-white/10 text-white hover:bg-gray-800 transition-colors shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <aside className="absolute left-0 top-0 bottom-0 w-64 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 flex flex-col">
          {renderSidebarContent()}
        </aside>
      </div>

      <aside 
        className={`hidden lg:flex lg:flex-col fixed left-0 top-0 bottom-0 z-40 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderSidebarContent()}
      </aside>
    </>
  );
}