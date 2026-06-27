/**
 * ============================================
 * AUTH CONTEXT - USER AUTHENTICATION
 * Manages user login state and authentication
 * ============================================
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  purchasedCourses: string[]; // Array of course IDs
  purchasedVideos: string[]; // Array of video IDs
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPurchased: (contentId: string, type: 'course' | 'video') => boolean;
  purchaseContent: (contentId: string, type: 'course' | 'video') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'tally_auth_user';

// Mock user for demo
const DEMO_USER: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@tallyacademy.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  purchasedCourses: [],
  purchasedVideos: [],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - accept any credentials for demo
    // In production, this would call your backend API
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      // For demo, accept any email/password
      const loggedInUser = {
        ...DEMO_USER,
        email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      };
      
      setUser(loggedInUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasPurchased = (contentId: string, type: 'course' | 'video'): boolean => {
    if (!user) return false;
    
    if (type === 'course') {
      return user.purchasedCourses.includes(contentId);
    } else {
      return user.purchasedVideos.includes(contentId);
    }
  };

  const purchaseContent = (contentId: string, type: 'course' | 'video') => {
    if (!user) return;

    const updatedUser = { ...user };
    
    if (type === 'course') {
      if (!updatedUser.purchasedCourses.includes(contentId)) {
        updatedUser.purchasedCourses.push(contentId);
      }
    } else {
      if (!updatedUser.purchasedVideos.includes(contentId)) {
        updatedUser.purchasedVideos.push(contentId);
      }
    }
    
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPurchased,
    purchaseContent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
