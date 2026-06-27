# 📱 Mobile Application Update - Guest Access & Premium Content

## 🎯 Overview

This update transforms the Tally Accounting Hub into a **freemium mobile application** with:

- ✅ **Guest Access** - Browse without login
- ✅ **Premium Content Protection** - Paywall for premium courses
- ✅ **Authentication System** - Email/Password + Google OAuth
- ✅ **Payment Integration** - One-time purchases & subscriptions
- ✅ **Enhanced Admin Panel** - Full course & video management
- ✅ **Access Control** - Role-based permissions

---

## 📋 Feature Matrix

| Feature | Guest | Logged In (Free) | Logged In (Paid) | Admin |
|---------|-------|------------------|------------------|-------|
| Home Page | ✅ | ✅ | ✅ | ✅ |
| Browse Courses | ✅ | ✅ | ✅ | ✅ |
| Search | ✅ | ✅ | ✅ | ✅ |
| Categories | ✅ | ✅ | ✅ | ✅ |
| Course Previews | ✅ | ✅ | ✅ | ✅ |
| Free Content | ✅ | ✅ | ✅ | ✅ |
| Premium Content | ❌ | ❌ Purchase Required | ✅ | ✅ |
| Download Materials | ❌ | ❌ Purchase Required | ✅ | ✅ |
| Course Management | ❌ | ❌ | ❌ | ✅ |
| User Management | ❌ | ❌ | ❌ | ✅ |

---

## 🗂️ Updated Folder Structure

```
tally-horizon-main/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx                    ✨ NEW
│   │   │   ├── RegisterForm.tsx                 ✨ NEW
│   │   │   ├── GoogleAuthButton.tsx             ✨ NEW
│   │   │   ├── ForgotPassword.tsx               ✨ NEW
│   │   │   └── AuthGuard.tsx                    ✨ NEW
│   │   ├── premium/
│   │   │   ├── PremiumBadge.tsx                 ✨ NEW
│   │   │   ├── PaywallModal.tsx                 ✨ NEW
│   │   │   ├── PurchaseButton.tsx               ✨ NEW
│   │   │   └── SubscriptionCard.tsx             ✨ NEW
│   │   ├── courses/
│   │   │   ├── CourseCard.tsx                   ✨ UPDATED
│   │   │   ├── CourseDetail.tsx                 ✨ UPDATED
│   │   │   ├── VideoPlayer.tsx                  ✨ NEW
│   │   │   └── LessonList.tsx                   ✨ NEW
│   │   └── admin/
│   │       ├── AdminCourseManager.tsx           ✨ UPDATED
│   │       ├── AdminVideoManager.tsx            ✨ UPDATED
│   │       ├── AdminPricing.tsx                 ✨ NEW
│   │       ├── AdminPurchases.tsx               ✨ NEW
│   │       └── AdminRevenue.tsx                 ✨ NEW
│   ├── hooks/
│   │   ├── useAuth.ts                           ✨ NEW
│   │   ├── usePremiumAccess.ts                  ✨ NEW
│   │   └── usePurchases.ts                      ✨ NEW
│   ├── services/
│   │   ├── authService.ts                       ✨ NEW
│   │   ├── courseService.ts                     ✨ NEW
│   │   ├── paymentService.ts                    ✨ NEW
│   │   └── premiumService.ts                    ✨ NEW
│   ├── contexts/
│   │   ├── AuthContext.tsx                      ✨ NEW
│   │   └── PurchaseContext.tsx                  ✨ NEW
│   ├── utils/
│   │   ├── accessControl.ts                     ✨ NEW
│   │   └── pricing.ts                           ✨ NEW
│   └── routes/
│       ├── login.tsx                            ✨ NEW
│       ├── register.tsx                         ✨ NEW
│       ├── course-detail.$id.tsx                ✨ NEW
│       └── purchase.tsx                         ✨ NEW
│
├── backend/ (Express API)
│   ├── controllers/
│   │   ├── courseController.js                  ✨ NEW
│   │   ├── videoController.js                   ✨ NEW
│   │   ├── purchaseController.js                ✨ NEW
│   │   └── paymentController.js                 ✨ NEW
│   ├── models/
│   │   ├── Course.js                            ✨ NEW
│   │   ├── Video.js                             ✨ NEW
│   │   ├── Purchase.js                          ✨ NEW
│   │   └── Enrollment.js                        ✨ NEW
│   ├── middleware/
│   │   ├── checkPremiumAccess.js                ✨ NEW
│   │   └── checkOwnership.js                    ✨ NEW
│   └── routes/
│       ├── courseRoutes.js                      ✨ NEW
│       ├── videoRoutes.js                       ✨ NEW
│       └── purchaseRoutes.js                    ✨ NEW
│
└── database/
    └── premium-schema.sql                       ✨ NEW
```

---

## 🗄️ Database Schema Updates

### New Tables

#### 1. **courses** Table
```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500),
    instructor_name VARCHAR(255),
    category VARCHAR(100),
    difficulty_level VARCHAR(50), -- Beginner, Intermediate, Advanced
    duration VARCHAR(50),
    total_lessons INTEGER DEFAULT 0,
    is_free BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    original_price DECIMAL(10,2) DEFAULT 0,
    discounted_price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'INR',
    sale_active BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **videos** Table
```sql
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    duration VARCHAR(50),
    order_index INTEGER,
    is_preview BOOLEAN DEFAULT FALSE,
    is_free BOOLEAN DEFAULT FALSE,
    video_price DECIMAL(10,2) DEFAULT 0,
    discount_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. **purchases** Table
```sql
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    purchase_type VARCHAR(50), -- one-time, subscription
    amount_paid DECIMAL(10,2),
    currency VARCHAR(10),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50), -- pending, completed, failed, refunded
    transaction_id VARCHAR(255) UNIQUE,
    expires_at TIMESTAMP, -- for subscriptions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. **enrollments** Table
```sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0, -- percentage
    completed_videos JSONB DEFAULT '[]',
    last_watched_video UUID,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(user_id, course_id)
);
```

#### 5. **revenue** Table
```sql
CREATE TABLE revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id UUID REFERENCES purchases(id),
    amount DECIMAL(10,2),
    currency VARCHAR(10),
    revenue_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

### Public Endpoints (Guest Access)

```javascript
GET    /api/courses                    // Browse all courses
GET    /api/courses/:id                // Course details
GET    /api/courses/:id/preview        // Preview videos
GET    /api/categories                 // Course categories
GET    /api/search?q=query             // Search courses
```

### Protected Endpoints (Authenticated)

```javascript
POST   /api/auth/register              // User registration
POST   /api/auth/login                 // User login
POST   /api/auth/google                // Google OAuth
GET    /api/auth/profile               // User profile
POST   /api/auth/logout                // Logout

GET    /api/courses/:id/content        // Full course content (if purchased)
GET    /api/videos/:id/stream          // Video streaming (if access granted)
POST   /api/purchases                  // Purchase course
GET    /api/purchases/my-courses       // User's purchased courses
GET    /api/enrollments/:courseId      // Enrollment progress
PUT    /api/enrollments/:courseId      // Update progress
```

### Admin Endpoints

```javascript
// Course Management
POST   /api/admin/courses              // Create course
PUT    /api/admin/courses/:id          // Update course
DELETE /api/admin/courses/:id          // Delete course
PATCH  /api/admin/courses/:id/publish  // Publish/unpublish
PATCH  /api/admin/courses/:id/archive  // Archive course

// Video Management
POST   /api/admin/videos               // Upload video
PUT    /api/admin/videos/:id           // Update video
DELETE /api/admin/videos/:id           // Delete video
PATCH  /api/admin/videos/:id/reorder   // Reorder videos

// Pricing Management
PUT    /api/admin/courses/:id/pricing  // Update course pricing
PUT    /api/admin/videos/:id/pricing   // Update video pricing

// Purchase Management
GET    /api/admin/purchases            // View all purchases
GET    /api/admin/revenue              // Revenue analytics
POST   /api/admin/purchases/:id/refund // Refund purchase
POST   /api/admin/access/grant         // Grant manual access
GET    /api/admin/users/active         // Active users
```

---

## 🔐 Access Control Logic

### Guest Users
```typescript
// Can access:
- Home page
- Course catalog (all courses visible)
- Course previews (preview videos only)
- Search functionality
- Categories
- Free content

// Cannot access:
- Premium course content
- Paid videos
- Downloadable resources
- User profile
- Purchase history
```

### Logged In Users (No Purchase)
```typescript
// Can access everything guests can, plus:
- User profile
- Save favorites
- Track progress on free courses

// Cannot access:
- Premium content they haven't purchased
```

### Logged In Users (Purchased)
```typescript
// Can access:
- All purchased course content
- All videos in purchased courses
- Downloadable materials
- Certificate generation
- Full course features
```

### Admin Users
```typescript
// Full access to:
- All content (free & premium)
- Admin dashboard
- Course management
- Video management
- User management
- Revenue analytics
- Access control
```

---

## 🎨 UI/UX Updates

### 1. Course Card Component
```typescript
<CourseCard
  title="Tally Prime Complete Course"
  instructor="Anil Sharma"
  price={4999}
  isPremium={true}
  isFree={false}
  thumbnail="/images/course.jpg"
  onAccess={() => {
    if (!isAuthenticated) {
      showAuthModal();
    } else if (!hasPurchased) {
      showPaywallModal();
    } else {
      navigateToCourse();
    }
  }}
/>
```

### 2. Paywall Modal
```typescript
<PaywallModal
  title="Premium Content"
  message="Please sign in or create an account to access premium content."
  coursePrice={4999}
  actions={[
    { label: "Login", onClick: () => navigate('/login') },
    { label: "Create Account", onClick: () => navigate('/register') },
  ]}
/>
```

### 3. Premium Badge
```typescript
<PremiumBadge
  type="premium" // or "free"
  label="Premium Course"
  icon={<Lock />}
/>
```

---

## 💳 Payment Integration Structure

### Payment Flow

```typescript
// 1. User clicks "Purchase Now"
// 2. Check authentication
if (!isAuthenticated) {
  redirect to login;
  after login, return to purchase;
}

// 3. Show payment modal
<PaymentModal
  course={courseDetails}
  amount={4999}
  currency="INR"
  onSuccess={handlePaymentSuccess}
/>

// 4. Process payment
const payment = await processPayment({
  courseId,
  userId,
  amount,
  paymentMethod: 'razorpay' // or stripe, paypal
});

// 5. Grant access
await grantAccess(userId, courseId);

// 6. Redirect to course
navigate(`/courses/${courseId}`);
```

### Supported Payment Gateways
- Razorpay (India)
- Stripe (International)
- PayPal (International)
- UPI (India)

---

## 📊 Admin Dashboard Enhancements

### New Admin Sections

#### 1. Course Management
- Create/Edit/Delete courses
- Publish/Unpublish
- Archive courses
- Bulk operations
- Preview before publish

#### 2. Video Management
- Upload videos
- Video transcoding
- Thumbnail generation
- Reorder lessons
- Preview control

#### 3. Pricing Management
- Set course prices
- Create discounts
- Flash sales
- Bundle pricing
- Subscription plans

#### 4. Purchase Analytics
```typescript
interface PurchaseAnalytics {
  totalRevenue: number;
  totalPurchases: number;
  activeCourses: number;
  topSellingCourses: Course[];
  revenueByMonth: ChartData[];
  purchasesByCategory: ChartData[];
}
```

#### 5. User Management
- View all users
- Grant manual access
- Refund purchases
- View purchase history
- User activity logs

---

## 🔒 Security Features

### 1. Content Protection
```typescript
// Middleware to check premium access
const checkPremiumAccess = async (req, res, next) => {
  const { courseId, videoId } = req.params;
  const userId = req.user.id;
  
  // Check if content is free
  const content = await getContent(courseId, videoId);
  if (content.isFree) return next();
  
  // Check if user has purchased
  const hasPurchased = await checkPurchase(userId, courseId);
  if (!hasPurchased) {
    return res.status(403).json({
      error: 'Premium content',
      message: 'Please purchase to access',
      requiresAuth: !userId,
      requiresPurchase: true,
      price: content.price
    });
  }
  
  next();
};
```

### 2. Video Streaming Protection
- Signed URLs with expiry
- DRM protection (optional)
- Watermarking
- Download prevention
- Screen recording detection

### 3. API Security
- Rate limiting per user
- JWT token validation
- CORS configuration
- Input sanitization
- SQL injection prevention

---

## 🚀 Implementation Priority

### Phase 1: Core Features (Week 1)
1. ✅ Database schema updates
2. ✅ Authentication system
3. ✅ Course browsing (guest mode)
4. ✅ Basic premium content protection

### Phase 2: Premium Features (Week 2)
5. ✅ Payment integration
6. ✅ Purchase flow
7. ✅ Access control middleware
8. ✅ Video streaming

### Phase 3: Admin Panel (Week 3)
9. ✅ Course management
10. ✅ Video upload & management
11. ✅ Pricing control
12. ✅ Analytics dashboard

### Phase 4: Polish & Testing (Week 4)
13. ✅ UI/UX improvements
14. ✅ Performance optimization
15. ✅ Security hardening
16. ✅ Testing & bug fixes

---

## 📱 Mobile App Features

### Guest Mode
- Browse courses without account
- View course previews
- Search & filter
- Read descriptions
- See ratings & reviews

### Registered User
- Save progress
- Download for offline (purchased only)
- Receive notifications
- Track learning statistics
- Certificate generation

### Offline Mode
- Download purchased courses
- Watch offline
- Sync progress when online

---

## 🎯 Success Metrics

### For Users
- Easy guest browsing
- Clear premium indicators
- Simple purchase flow
- Smooth video playback
- Progress tracking

### For Business
- Conversion rate (guest → paid)
- Average revenue per user
- Course completion rate
- Customer lifetime value
- Churn rate

### For Admin
- Easy content management
- Real-time analytics
- Flexible pricing control
- User insights
- Revenue tracking

---

## 📝 Next Steps

1. **Review this plan** - Confirm requirements
2. **Generate code files** - Create all components
3. **Setup database** - Run migrations
4. **Configure payments** - Setup payment gateways
5. **Test thoroughly** - End-to-end testing
6. **Deploy** - Production deployment

---

**Ready to implement? Let me know and I'll generate all the code files!** 🚀
