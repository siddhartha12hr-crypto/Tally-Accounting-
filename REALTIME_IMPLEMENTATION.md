# ⚡ Real-Time System - Implementation Guide

## 🎯 Quick Start

### Step 1: Install Dependencies

```bash
# Backend dependencies
cd auth/backend
npm install socket.io redis

# Frontend dependencies  
cd ../../
npm install socket.io-client
```

### Step 2: Setup Redis (Optional but Recommended)

**Windows:**
```bash
# Download Redis for Windows
# https://github.com/microsoftarchive/redis/releases
# Or use Docker
docker run -d -p 6379:6379 redis
```

**Verify Redis:**
```bash
redis-cli ping
# Should return: PONG
```

### Step 3: Update Environment Variables

Add to `auth/.env`:
```env
# Redis (optional - for scalability)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# WebSocket configuration
SOCKET_IO_CORS_ORIGIN=http://localhost:8080
```

### Step 4: Start Services

```bash
# Terminal 1: Start backend with Socket.IO
cd auth/backend
npm run dev

# Terminal 2: Start frontend
cd ../..
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════════════╗
║    🔐 TALLY AUTHENTICATION SERVER                         ║
║    WebSockets: Enabled                                    ║
║    Socket.IO ready for real-time updates                 ║
╚═══════════════════════════════════════════════════════════╝
✅ Socket.IO server initialized
```

---

## 🎨 Usage Examples

### Example 1: Real-Time Course Updates

```typescript
// In any component (e.g., CourseCatalog.tsx)
import { useCoursesRealtime } from '@/hooks/useRealtime';

function CourseCatalog() {
  const [courses, setCourses] = useState([]);

  // Automatically updates when admin creates/updates/deletes courses
  useCoursesRealtime(setCourses, courses);

  return (
    <div>
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

**Result:** When admin creates a course, it appears instantly for all users!

---

### Example 2: Purchase Success Notification

```typescript
// In PurchaseButton component
import { realtimeService } from '@/services/realtimeService';

async function handlePurchase() {
  // Process payment
  const purchase = await processPayment(courseId);
  
  // Emit real-time event
  realtimeService.emitPurchaseCompleted({
    userId: user.id,
    courseId,
    purchaseData: purchase
  });
}

// In App.tsx or Layout component
useRealtime({
  onPurchaseSuccess: (purchase) => {
    // Update user's access rights immediately
    updateUserAccess(purchase.courseId);
    // Show success message
    toast.success('Purchase successful!');
    // Redirect to course
    navigate(`/courses/${purchase.courseId}`);
  }
});
```

**Result:** User gets instant access without logout/login!

---

### Example 3: Admin Dashboard Real-Time Stats

```typescript
// In AdminDashboard.tsx
import { useAdminStatsRealtime } from '@/hooks/useRealtime';

function AdminDashboard() {
  const [stats, setStats] = useState({});

  // Auto-updates every 10 seconds
  useAdminStatsRealtime(setStats);

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard label="Online Users" value={stats.onlineUsers} />
      <StatCard label="Total Revenue" value={stats.totalRevenue} />
      <StatCard label="New Sales" value={stats.courseSales} />
    </div>
  );
}
```

**Result:** Dashboard updates in real-time as purchases happen!

---

### Example 4: Live Search Results

```typescript
// In SearchPage.tsx
import { useRealtime } from '@/hooks/useRealtime';

function SearchPage() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');

  // Listen for new courses
  useRealtime({
    onCourseCreated: (course) => {
      // If matches search query, add to results
      if (course.title.toLowerCase().includes(query.toLowerCase())) {
        setResults(prev => [course, ...prev]);
      }
    },
    showToasts: false // Don't show toast for search updates
  });

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search courses..."
      />
      {results.map(course => (
        <SearchResult key={course.id} course={course} />
      ))}
    </div>
  );
}
```

**Result:** Search results update as admin adds new courses!

---

### Example 5: Progress Synchronization

```typescript
// In VideoPlayer.tsx
import { useRealtime } from '@/hooks/useRealtime';

function VideoPlayer({ videoId, courseId }) {
  const { updateProgress } = useRealtime();

  const handleProgressUpdate = (currentTime: number, duration: number) => {
    const progress = (currentTime / duration) * 100;
    
    // Sync progress to all devices
    updateProgress({
      courseId,
      videoId,
      progress: Math.round(progress),
      currentTime,
    });
  };

  return (
    <video
      onTimeUpdate={(e) => {
        const video = e.target as HTMLVideoElement;
        handleProgressUpdate(video.currentTime, video.duration);
      }}
    />
  );
}

// In CourseProgress.tsx on another device
useRealtime({
  onProgressUpdated: (progressData) => {
    // Update progress bar
    setProgress(progressData.progress);
    // Mark video as watched
    if (progressData.progress >= 90) {
      markVideoComplete(progressData.videoId);
    }
  }
});
```

**Result:** Watch on mobile, progress syncs to desktop instantly!

---

### Example 6: Admin Creating Course

```typescript
// In AdminCourses.tsx
import { realtimeService } from '@/services/realtimeService';

async function handleCreateCourse(courseData) {
  // Save to database
  const course = await createCourseAPI(courseData);
  
  // Broadcast to all users
  realtimeService.emitCourseCreate(course);
  
  toast.success('Course created and published to all users!');
}
```

**Result:** All users see the new course immediately!

---

### Example 7: Live Notifications

```typescript
// In App.tsx (root component)
import { useNotifications } from '@/hooks/useRealtime';

function App() {
  useNotifications(); // Setup global notifications
  
  return (
    <Router>
      {/* Your app routes */}
    </Router>
  );
}

// Admin sends notification
function AdminNotifications() {
  const sendNotification = () => {
    realtimeService.emitNotification({
      type: 'success',
      title: '🔥 Flash Sale!',
      message: '50% off all courses for 24 hours',
      action: {
        label: 'Shop Now',
        url: '/courses'
      }
    });
  };

  return (
    <button onClick={sendNotification}>
      Send Flash Sale Notification
    </button>
  );
}
```

**Result:** All users get instant notification with sound and toast!

---

## 🔧 Admin Operations

### Creating a Course (Real-Time)

```typescript
// 1. Admin creates course
const newCourse = {
  title: 'Advanced Tally',
  price: 5999,
  instructor: 'CA Kumar'
};

// 2. Save to database
const course = await saveCourse(newCourse);

// 3. Broadcast to all users
realtimeService.emitCourseCreate(course);

// 4. All users see it instantly!
// - Dashboard updates
// - Course catalog updates
// - Search results update
// - Home page updates
```

### Changing Course Price (Real-Time)

```typescript
// 1. Admin changes price
const priceUpdate = {
  courseId: 'abc123',
  oldPrice: 5999,
  newPrice: 3999,
  isFree: false
};

// 2. Update database
await updateCoursePrice(priceUpdate);

// 3. Broadcast to all users
realtimeService.emitCoursePriceChange(priceUpdate);

// 4. All users see new price instantly!
// - Course cards update
// - Purchase buttons update
// - Price tags update
```

### Granting Manual Access (Real-Time)

```typescript
// 1. Admin grants access
const accessData = {
  userId: 'user123',
  courseId: 'course456'
};

// 2. Update database
await grantAccess(accessData);

// 3. Notify user
realtimeService.emitAccessGrant(accessData);

// 4. User gets instant access!
// - No logout/login needed
// - Course appears in "My Courses"
// - Can start learning immediately
```

---

## 📊 Performance Tips

### 1. Use Room-Based Broadcasting

```typescript
// Bad: Broadcast to everyone
io.emit('video:uploaded', video);

// Good: Broadcast only to course subscribers
io.to(`course:${video.courseId}`).emit('video:uploaded', video);
```

### 2. Throttle Frequent Updates

```typescript
import { throttle } from 'lodash';

// Throttle progress updates to once per 5 seconds
const throttledProgressUpdate = throttle((progress) => {
  realtimeService.emitProgressUpdate(progress);
}, 5000);
```

### 3. Use Conditional Rendering

```typescript
// Only connect to real-time if user is on relevant page
useEffect(() => {
  if (isOnCoursePage) {
    realtimeService.connect(token);
  }
  return () => {
    if (isOnCoursePage) {
      realtimeService.disconnect();
    }
  };
}, [isOnCoursePage]);
```

### 4. Cleanup Event Listeners

```typescript
useEffect(() => {
  const handleCourseUpdate = (course) => {
    updateCourse(course);
  };

  realtimeService.onCourseUpdated(handleCourseUpdate);

  // Always cleanup!
  return () => {
    realtimeService.off('course:updated');
  };
}, []);
```

---

## 🔒 Security Best Practices

### 1. Always Verify User Roles

```typescript
// Backend: Check admin role
socket.on('course:create', (data) => {
  if (socket.userRole !== 'admin') {
    return socket.emit('error', { message: 'Unauthorized' });
  }
  // Process course creation
});
```

### 2. Validate All Data

```typescript
// Backend: Validate course data
socket.on('course:create', (courseData) => {
  const validation = validateCourseData(courseData);
  if (!validation.valid) {
    return socket.emit('error', { errors: validation.errors });
  }
  // Process creation
});
```

### 3. Use Signed URLs for Video Streaming

```typescript
// Backend: Generate signed URL with expiry
socket.on('video:request_stream', async (videoId) => {
  const hasAccess = await verifyUserAccess(socket.userId, videoId);
  if (!hasAccess) {
    return socket.emit('access:denied');
  }
  
  const signedUrl = generateSignedURL(videoId, {
    expiresIn: 3600 // 1 hour
  });
  
  socket.emit('video:stream_url', { url: signedUrl });
});
```

---

## 🐛 Troubleshooting

### Issue 1: Socket Not Connecting

**Problem:** `Socket.IO not initialized` error

**Solution:**
```typescript
// Ensure you're calling connect with a valid token
const token = localStorage.getItem('accessToken');
if (token) {
  realtimeService.connect(token);
}
```

### Issue 2: Events Not Received

**Problem:** Real-time updates not showing

**Solution:**
```typescript
// Check if socket is connected
console.log('Connected:', realtimeService.connected);

// Verify listeners are set up
useEffect(() => {
  realtimeService.onCourseCreated((course) => {
    console.log('Course created:', course);
  });
}, []);
```

### Issue 3: Multiple Connections

**Problem:** User has multiple socket connections

**Solution:**
```typescript
// Always disconnect on unmount
useEffect(() => {
  realtimeService.connect(token);
  
  return () => {
    realtimeService.disconnect(); // Important!
  };
}, [token]);
```

### Issue 4: Offline Detection

**Problem:** App doesn't handle offline state

**Solution:**
```typescript
useEffect(() => {
  const handleOnline = () => {
    realtimeService.connect(token);
    toast.success('Back online!');
  };

  const handleOffline = () => {
    toast.warning('You are offline');
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, [token]);
```

---

## 📈 Scaling Considerations

### For 10,000+ Concurrent Users

1. **Use Redis Adapter**
```javascript
const redisAdapter = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

io.adapter(redisAdapter(pubClient, subClient));
```

2. **Enable Sticky Sessions**
```nginx
upstream socketio {
    ip_hash;
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}
```

3. **Use Load Balancer**
```
Nginx → Server 1 (Socket.IO)
     → Server 2 (Socket.IO)
     → Server 3 (Socket.IO)
            ↓
       Redis Pub/Sub
```

---

## ✅ Testing Checklist

- [ ] User receives course creation notification
- [ ] Course appears in catalog immediately
- [ ] Price changes update in real-time
- [ ] Purchase grants instant access
- [ ] Progress syncs across devices
- [ ] Admin sees live dashboard stats
- [ ] Search results update dynamically
- [ ] Offline mode works correctly
- [ ] Reconnection works after disconnect
- [ ] Multiple tabs sync correctly

---

## 🎉 Summary

You now have:
- ✅ Complete real-time backend (Socket.IO server)
- ✅ Complete real-time frontend (React hooks)
- ✅ Automatic reconnection
- ✅ Role-based access control
- ✅ Event validation
- ✅ Performance optimization
- ✅ Offline support
- ✅ Multi-device sync
- ✅ Admin dashboard real-time stats
- ✅ Live notifications

**Everything updates in real-time without refreshing!** 🚀
