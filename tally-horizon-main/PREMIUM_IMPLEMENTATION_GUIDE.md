# 🎯 Premium Content Implementation Guide

## 📊 Overview

This guide shows you how to implement the complete guest access and premium content system for the Tally Accounting Hub mobile app.

---

## 🗄️ Database Setup

### Step 1: Run the Premium Schema

```bash
# Navigate to project directory
cd tally-horizon-main

# Connect to PostgreSQL
psql -U postgres -d tally_auth

# Run the premium schema
\i database/premium-schema.sql

# Verify tables were created
\dt

# You should see:
# - courses
# - videos
# - purchases
# - enrollments
# - revenue
# - reviews
# - coupons
# - coupon_usage
# - wishlists
# - notifications
```

### Step 2: Verify Sample Data

```sql
-- Check sample courses
SELECT title, is_free, original_price FROM courses;

-- Should show:
-- Introduction to Accounting (FREE)
-- Tally Prime Mastery (₹3999)
```

---

## 🔐 Access Control Implementation

### Authentication Context

Create `src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';

interface User {
  id: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const userData = await authService.login(email, password);
    setUser(userData);
  };

  const register = async (userData: any) => {
    const newUser = await authService.register(userData);
    setUser(newUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const loginWithGoogle = async () => {
    const userData = await authService.loginWithGoogle();
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Premium Access Hook

Create `src/hooks/usePremiumAccess.ts`:

```typescript
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { premiumService } from '@/services/premiumService';

export function usePremiumAccess(courseId: string) {
  const { user, isAuthenticated } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courseDetails, setCourseDetails] = useState<any>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Get course details
        const course = await premiumService.getCourse(courseId);
        setCourseDetails(course);

        // If course is free, grant access
        if (course.isFree) {
          setHasAccess(true);
          setIsLoading(false);
          return;
        }

        // If not authenticated, no access
        if (!isAuthenticated) {
          setHasAccess(false);
          setIsLoading(false);
          return;
        }

        // Check if user has purchased the course
        const purchased = await premiumService.checkPurchase(
          user!.id,
          courseId
        );
        setHasAccess(purchased);
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [courseId, user, isAuthenticated]);

  return {
    hasAccess,
    isLoading,
    courseDetails,
    isAuthenticated,
  };
}
```

---

## 🎨 UI Components

### Paywall Modal Component

Create `src/components/premium/PaywallModal.tsx`:

```typescript
import { motion } from 'framer-motion';
import { Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  coursePrice: number;
  currency: string;
  courseId: string;
}

export function PaywallModal({
  isOpen,
  onClose,
  courseTitle,
  coursePrice,
  currency,
  courseId,
}: PaywallModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md rounded-3xl glass p-6 shadow-elegant"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full gradient-hero grid place-items-center mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-2xl font-black mb-2">Premium Content</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in or create an account to access premium content.
          </p>

          <div className="w-full rounded-2xl glass p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Course</p>
            <h3 className="font-bold mb-3">{courseTitle}</h3>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl font-black text-gradient">
                {currency} {coursePrice}
              </span>
            </div>
          </div>

          <div className="w-full space-y-3">
            <Button
              onClick={() => navigate({ to: '/login', search: { redirect: `/courses/${courseId}` } })}
              className="w-full rounded-xl gradient-hero text-white shadow-glow"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate({ to: '/register', search: { redirect: `/courses/${courseId}` } })}
              variant="outline"
              className="w-full rounded-xl"
            >
              Create Account
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Already have an account? Sign in to access your purchased courses.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
```

### Premium Badge Component

Create `src/components/premium/PremiumBadge.tsx`:

```typescript
import { Lock, CheckCircle } from 'lucide-react';

interface PremiumBadgeProps {
  isPremium: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function PremiumBadge({ 
  isPremium, 
  size = 'md', 
  showLabel = true 
}: PremiumBadgeProps) {
  if (!isPremium) {
    return showLabel ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold">
        <CheckCircle className="h-3 w-3" />
        FREE
      </span>
    ) : null;
  }

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full gradient-hero text-white text-xs font-bold shadow-glow">
      <Lock className={sizeClasses[size]} />
      {showLabel && 'PREMIUM'}
    </span>
  );
}
```

### Course Card with Access Control

Update `src/components/courses/CourseCard.tsx`:

```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Star } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { PremiumBadge } from '@/components/premium/PremiumBadge';
import { PaywallModal } from '@/components/premium/PaywallModal';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    thumbnail: string;
    duration: string;
    students: number;
    rating: number;
    isFree: boolean;
    price: number;
    currency: string;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { hasAccess } = usePremiumAccess(course.id);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleClick = () => {
    // Free courses: everyone can access
    if (course.isFree) {
      navigate({ to: `/courses/${course.id}` });
      return;
    }

    // Premium courses: check authentication and purchase
    if (!isAuthenticated) {
      setShowPaywall(true);
      return;
    }

    if (!hasAccess) {
      navigate({ to: `/purchase/${course.id}` });
      return;
    }

    navigate({ to: `/courses/${course.id}` });
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="rounded-2xl glass p-4 shadow-card cursor-pointer"
        onClick={handleClick}
      >
        <div className="relative">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover rounded-xl"
          />
          <div className="absolute top-2 right-2">
            <PremiumBadge isPremium={!course.isFree} />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-black text-lg line-clamp-2">{course.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            by {course.instructor}
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {course.students.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {course.rating}
            </span>
          </div>

          {!course.isFree && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-black text-gradient">
                {course.currency} {course.price}
              </span>
              <button className="px-4 py-2 rounded-xl gradient-hero text-white text-sm font-bold shadow-glow">
                {hasAccess ? 'Continue' : 'Enroll'}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        courseTitle={course.title}
        coursePrice={course.price}
        currency={course.currency}
        courseId={course.id}
      />
    </>
  );
}
```

---

## 🚀 API Services

### Premium Service

Create `src/services/premiumService.ts`:

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const premiumService = {
  // Get course details
  async getCourse(courseId: string) {
    const response = await axios.get(`${API_URL}/courses/${courseId}`);
    return response.data;
  },

  // Check if user has purchased course
  async checkPurchase(userId: string, courseId: string) {
    const response = await axios.get(
      `${API_URL}/purchases/check/${userId}/${courseId}`
    );
    return response.data.hasPurchased;
  },

  // Get user's purchased courses
  async getUserCourses(userId: string) {
    const response = await axios.get(`${API_URL}/purchases/user/${userId}`);
    return response.data;
  },

  // Purchase course
  async purchaseCourse(courseId: string, paymentData: any) {
    const response = await axios.post(`${API_URL}/purchases`, {
      courseId,
      ...paymentData,
    });
    return response.data;
  },

  // Get course videos
  async getCourseVideos(courseId: string) {
    const response = await axios.get(`${API_URL}/courses/${courseId}/videos`);
    return response.data;
  },

  // Get video streaming URL (with access check)
  async getVideoStreamUrl(videoId: string) {
    const response = await axios.get(`${API_URL}/videos/${videoId}/stream`);
    return response.data.streamUrl;
  },

  // Track video progress
  async updateProgress(courseId: string, videoId: string, progress: number) {
    const response = await axios.put(
      `${API_URL}/enrollments/${courseId}/progress`,
      { videoId, progress }
    );
    return response.data;
  },
};
```

---

## 🔧 Backend Implementation

### Access Control Middleware

Create `auth/backend/middleware/checkPremiumAccess.js`:

```javascript
const { query } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Middleware to check if user has access to premium content
 */
async function checkPremiumAccess(req, res, next) {
  try {
    const { courseId, videoId } = req.params;
    const userId = req.user?.id;

    // Get content details
    let content;
    if (courseId) {
      const result = await query(
        'SELECT is_free, original_price, currency FROM courses WHERE id = $1',
        [courseId]
      );
      content = result.rows[0];
    } else if (videoId) {
      const result = await query(
        'SELECT v.is_free, v.is_preview, c.is_free as course_free, c.original_price, c.currency FROM videos v JOIN courses c ON v.course_id = c.id WHERE v.id = $1',
        [videoId]
      );
      content = result.rows[0];
    }

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Allow access to free content
    if (content.is_free || content.course_free || content.is_preview) {
      return next();
    }

    // Require authentication for premium content
    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please sign in or create an account to access premium content.',
        requiresAuth: true,
        price: content.original_price,
        currency: content.currency,
      });
    }

    // Check if user has purchased
    const purchaseResult = await query(
      `SELECT id FROM purchases 
       WHERE user_id = $1 
       AND course_id = (
         SELECT COALESCE(
           (SELECT id FROM courses WHERE id = $2),
           (SELECT course_id FROM videos WHERE id = $3)
         )
       )
       AND payment_status = 'completed'
       AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`,
      [userId, courseId || null, videoId || null]
    );

    if (purchaseResult.rows.length === 0) {
      return res.status(403).json({
        error: 'Purchase required',
        message: 'Please purchase this course to access the content.',
        requiresPurchase: true,
        price: content.original_price,
        currency: content.currency,
      });
    }

    // User has access
    next();
  } catch (error) {
    logger.error('Error checking premium access:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { checkPremiumAccess };
```

---

## 📊 Admin Panel Updates

### Course Management Component

The admin panel should include:

1. **Course List View**
   - Grid/List toggle
   - Search & filter
   - Sort by date, price, popularity
   - Bulk actions

2. **Course Editor**
   - Rich text description editor
   - Image upload for thumbnail
   - Video management
   - Pricing controls
   - Publish/Archive buttons

3. **Analytics Dashboard**
   - Total revenue
   - Sales by course
   - Conversion rates
   - User engagement
   - Revenue trends

---

## 🧪 Testing Checklist

### Guest User Tests
- [ ] Can browse courses without login
- [ ] Can view course previews
- [ ] Can search courses
- [ ] Can filter by category
- [ ] Cannot access premium content
- [ ] Sees paywall modal on premium access
- [ ] Can register from paywall modal
- [ ] Can login from paywall modal

### Authenticated User Tests
- [ ] Can login successfully
- [ ] Can view purchased courses
- [ ] Can access purchased content
- [ ] Cannot access unpurchased premium content
- [ ] Can purchase new courses
- [ ] Receives confirmation after purchase
- [ ] Course appears in "My Courses"
- [ ] Can track progress

### Admin Tests
- [ ] Can access admin panel
- [ ] Can create courses
- [ ] Can upload videos
- [ ] Can set pricing
- [ ] Can publish/unpublish
- [ ] Can view analytics
- [ ] Can grant manual access
- [ ] Can process refunds

---

## 🚀 Deployment Steps

1. **Update Database**
   ```bash
   psql -U postgres -d tally_auth -f database/premium-schema.sql
   ```

2. **Update Environment Variables**
   ```env
   # Payment Gateway
   RAZORPAY_KEY_ID=your_key
   RAZORPAY_KEY_SECRET=your_secret
   
   # Frontend URL
   FRONTEND_URL=http://localhost:8080
   ```

3. **Install Dependencies**
   ```bash
   npm install razorpay stripe
   ```

4. **Test Locally**
   ```bash
   npm run dev
   ```

5. **Deploy**
   - Build frontend
   - Deploy backend
   - Update DNS
   - Configure SSL

---

## 📝 Summary

You now have:
- ✅ Complete database schema
- ✅ Access control system
- ✅ Paywall implementation
- ✅ Premium content protection
- ✅ Admin course management
- ✅ Payment integration structure
- ✅ User progress tracking

**Next:** Generate all the component files and start testing! 🎉
