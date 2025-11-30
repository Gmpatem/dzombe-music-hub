'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'student' | 'admin';
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  showTimeoutWarning: boolean;
  extendSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session timeout constants
const STANDARD_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const REMEMBER_ME_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [warningId, setWarningId] = useState<NodeJS.Timeout | null>(null);
  const [sessionTimeout, setSessionTimeout] = useState(STANDARD_TIMEOUT);
  const isInitialMount = useRef(true);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    if (warningId) clearTimeout(warningId);
    setShowTimeoutWarning(false);
  }, [timeoutId, warningId]);

  // Auto logout function
  const autoLogout = useCallback(async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      setShowTimeoutWarning(false);
      // Store logout reason
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('logoutReason', 'timeout');
      }
    } catch (error) {
      console.error('Auto logout error:', error);
    }
  }, []);

  // Reset inactivity timer
  const resetTimer = useCallback(() => {
    // Don't reset if user is not logged in
    if (!user) return;

    clearTimers();

    // Set warning timer (shows warning before logout)
    const warningTimer = setTimeout(() => {
      setShowTimeoutWarning(true);
    }, sessionTimeout - WARNING_TIME);

    // Set auto-logout timer
    const logoutTimer = setTimeout(() => {
      autoLogout();
    }, sessionTimeout);

    setWarningId(warningTimer);
    setTimeoutId(logoutTimer);
  }, [user, sessionTimeout, clearTimers, autoLogout]);

  // Extend session (called when user clicks "Stay Logged In")
  const extendSession = useCallback(() => {
    setShowTimeoutWarning(false);
    resetTimer();
  }, [resetTimer]);

  // Activity tracking
  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    
    let debounceTimer: NodeJS.Timeout;
    const handleActivity = () => {
      // Debounce to avoid too many resets
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        resetTimer();
      }, 1000); // Reset timer at most once per second
    };

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Start timer on initial mount or when timeout changes
    if (isInitialMount.current || sessionTimeout) {
      handleActivity(); // This will call resetTimer after debounce
      isInitialMount.current = false;
    }

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimeout(debounceTimer);
      clearTimers();
    };
  }, [user, resetTimer, clearTimers, sessionTimeout]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile({
              uid: user.uid,
              email: user.email || '',
              fullName: data.fullName || '',
              phone: data.phone || '',
              role: data.role || 'student',
              createdAt: data.createdAt?.toDate() || new Date(),
            });

            // Check if user had "Remember Me" enabled
            const rememberMe = localStorage.getItem('rememberMe') === 'true';
            setSessionTimeout(rememberMe ? REMEMBER_ME_TIMEOUT : STANDARD_TIMEOUT);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
        clearTimers();
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [clearTimers]);

  const signup = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        fullName,
        phone: phone || '',
        role: 'student',
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      setUserProfile(userProfile);
      
      // Default to standard timeout for new signups
      setSessionTimeout(STANDARD_TIMEOUT);
      localStorage.removeItem('rememberMe');
    } catch (error) {
      console.error('Signup error:', error);
      const message = error instanceof Error ? error.message : 'Failed to create account';
      throw new Error(message);
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Set session timeout based on "Remember Me"
      const timeout = rememberMe ? REMEMBER_ME_TIMEOUT : STANDARD_TIMEOUT;
      setSessionTimeout(timeout);
      
      // Store preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      // Clear any previous logout reason
      sessionStorage.removeItem('logoutReason');
    } catch (error) {
      console.error('Login error:', error);
      const message = error instanceof Error ? error.message : 'Failed to login';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      clearTimers();
      localStorage.removeItem('rememberMe');
      sessionStorage.removeItem('logoutReason');
    } catch (error) {
      console.error('Logout error:', error);
      const message = error instanceof Error ? error.message : 'Failed to logout';
      throw new Error(message);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      const message = error instanceof Error ? error.message : 'Failed to send password reset email';
      throw new Error(message);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    showTimeoutWarning,
    extendSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}