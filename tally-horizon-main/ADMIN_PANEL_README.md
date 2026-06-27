# 🔐 Admin Panel Documentation

## Overview

The Admin Panel is a comprehensive content management system for Tally Accounting Hub Pro. It provides full control over videos, sports matches, movies, courses, and system settings.

## 🚀 Access

**URL**: `http://localhost:8080/admin`

**Access PIN**: `9090` (same as other protected content)

**Navigation**: Click the "Admin" icon in the bottom navigation bar (gear icon)

---

## 📊 Features

### 1. Dashboard
**Overview of your platform's performance**

- **Statistics Cards**:
  - Total Users (43,892)
  - Total Videos (1,247)
  - Active Courses (156)
  - Live Sports (24)
  - Movies (892)
  - Total Views (2.4M)

- **Recent Activity Feed**: Real-time updates on content additions and user milestones

- **Top Performing Content**: See which videos, courses, and live events are getting the most views

---

### 2. Videos Management 🎥

**Full CRUD (Create, Read, Update, Delete) operations for video content**

#### Features:
- ✅ Add new videos with complete metadata
- ✅ Edit existing video information
- ✅ Delete videos (with confirmation)
- ✅ Search videos by title or category
- ✅ View video statistics (views, duration, upload date)

#### Video Fields:
- **Title**: Video name
- **Description**: Detailed description
- **Category**: Select from predefined categories
  - Accounting Basics
  - Tally Prime Tutorials
  - GST Learning
  - Business Skills
  - Computer Skills
  - Excel Tutorials
  - Financial Education
  - Digital Skills
- **Duration**: Video length (e.g., "5h 30m")
- **URL**: Video link (YouTube, Vimeo, etc.)
- **Thumbnail**: Image URL for video preview
- **Auto-tracked**: Views, Upload Date

---

### 3. Sports Management 🏏⚽

**Manage live cricket and football matches**

#### Features:
- ✅ Add new matches/fixtures
- ✅ Update live scores in real-time
- ✅ Toggle live status
- ✅ Edit match details
- ✅ Delete matches
- ✅ Filter by sport type (Cricket/Football)
- ✅ Search by team names

#### Match Fields:
- **Sport**: Cricket or Football
- **Team A & Team B**: Team names
- **Score A & Score B**: Current scores
- **Status**: LIVE, Upcoming, Completed, etc.
- **Live Toggle**: Mark as live match
- **Extra Info**: Overs (cricket) or Time (football)

---

### 4. Movies Management 🎬

**Complete entertainment library management**

#### Features:
- ✅ Add new movies
- ✅ Edit movie details
- ✅ Delete movies (with confirmation)
- ✅ Search by title or genre
- ✅ Visual grid layout with posters
- ✅ Hover actions for quick access

#### Movie Fields:
- **Title**: Movie name
- **Genre**: Select from 10+ genres
  - Action, Comedy, Drama, Thriller, Romance, Horror, Sci-Fi, Documentary, Animation, Musical
- **Rating**: 0-10 scale
- **Year**: Release year
- **Duration**: Movie length (e.g., "2h 26m")
- **Description**: Plot summary
- **URL**: Streaming link
- **Thumbnail**: Poster image URL

---

### 5. Courses Management 🎓

**Educational course administration**

#### Features:
- ✅ Add new courses
- ✅ Edit course information
- ✅ Delete courses (with confirmation)
- ✅ Search by title, instructor, or category
- ✅ Track student enrollments
- ✅ Manage ratings and reviews

#### Course Fields:
- **Title**: Course name
- **Instructor**: Teacher/instructor name
- **Category**: Course category
  - Tally Prime, Accounting, GST, Business Skills, Excel, Computer Skills, Finance, Digital Marketing
- **Description**: Course overview
- **Duration**: Total course length
- **Lessons**: Number of lessons
- **Rating**: 0-5 star rating
- **Students**: Enrollment count
- **Price**: Course price (e.g., "₹4,999")
- **Thumbnail**: Course image

---

### 6. Settings ⚙️

**Comprehensive system configuration**

#### Security Settings 🔒
- **Admin PIN**: Change admin access PIN (default: 9090)
- **User PIN**: Change user content access PIN
- **Two-Factor Authentication**: Enable/disable 2FA
- **Session Timeout**: Auto-logout duration (minutes)

#### Notifications 🔔
- **Email Notifications**: Admin updates via email
- **Push Notifications**: Browser notifications
- **SMS Alerts**: Critical alerts via SMS
- **Weekly Reports**: Automated analytics reports

#### Appearance 🎨
- **Site Name**: Platform display name
- **Tagline**: Site description/motto
- **Primary Color**: Main brand color (hex picker)
- **Accent Color**: Secondary brand color (hex picker)

#### System Settings 💾
- **Max Upload Size**: File size limit in MB
- **Enable Cache**: Toggle content caching
- **Maintenance Mode**: Put site offline for maintenance
- **Backup Frequency**: Automated backup schedule (hourly, daily, weekly, monthly)

#### Danger Zone ⚠️
- **Clear All Cache**: Remove cached data
- **Reset to Defaults**: Restore default settings
- **Delete All Content**: Permanently remove all content (use with caution!)

---

## 🎯 Quick Start Guide

### Adding a Video
1. Navigate to **Admin → Videos**
2. Click **"+ Add Video"** button
3. Fill in the form:
   - Enter title and description
   - Select category from dropdown
   - Add duration, URL, and thumbnail
4. Click **"Save Video"**
5. Video appears in the list immediately

### Managing Live Sports
1. Go to **Admin → Sports**
2. Click **"+ Add Match"**
3. Select sport type (Cricket/Football)
4. Enter team names and scores
5. Toggle **"Live Match"** if currently playing
6. Add extra info (overs/time)
7. Click **"Save Match"**

### Updating Settings
1. Navigate to **Admin → Settings**
2. Browse through sections:
   - Security Settings
   - Notifications
   - Appearance
   - System Settings
3. Make desired changes
4. Click **"Save All Settings"** at the bottom
5. Confirmation message appears

---

## 🔑 Default Access Credentials

- **Admin PIN**: `9090`
- **User PIN**: `1234` (for Sports, Entertainment, etc.)

> ⚠️ **Important**: Change these PINs in Settings → Security Settings for production use!

---

## 💡 Tips & Best Practices

### Content Management
- ✅ Use high-quality thumbnails (recommended: 1200x800px)
- ✅ Write clear, concise descriptions
- ✅ Keep categories consistent
- ✅ Update live sports scores regularly
- ✅ Add new courses with accurate pricing

### Security
- 🔒 Change default PINs immediately
- 🔒 Enable Two-Factor Authentication
- 🔒 Set appropriate session timeouts
- 🔒 Regular backups (daily recommended)

### Performance
- ⚡ Enable caching for faster loading
- ⚡ Keep max upload size reasonable
- ⚡ Clear cache periodically
- ⚡ Monitor dashboard statistics

---

## 🛠️ Technical Details

### Tech Stack
- **Frontend**: React 19, TanStack Router
- **UI Library**: Radix UI, Tailwind CSS v4
- **Animations**: Framer Motion
- **State Management**: React Hooks
- **Forms**: React Hook Form + Zod validation

### File Structure
```
src/
├── routes/
│   └── admin.tsx                    # Main admin route
├── components/
│   └── admin/
│       ├── AdminDashboard.tsx       # Dashboard with analytics
│       ├── AdminVideos.tsx          # Video management
│       ├── AdminSports.tsx          # Sports management
│       ├── AdminMovies.tsx          # Movie management
│       ├── AdminCourses.tsx         # Course management
│       └── AdminSettings.tsx        # Settings panel
└── components/
    ├── PinLock.tsx                  # PIN authentication
    └── BottomNav.tsx                # Navigation with admin link
```

---

## 🚨 Troubleshooting

### Can't Access Admin Panel
- Ensure you're using the correct PIN (9090)
- Clear browser cache and reload
- Check if route is registered: `/admin`

### Changes Not Saving
- Currently in-memory storage (demo mode)
- Implement backend API for persistence
- Consider using localStorage for client-side persistence

### UI Not Updating
- Check browser console for errors
- Ensure dev server is running
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

---

## 🔮 Future Enhancements

- [ ] Backend API integration for data persistence
- [ ] Image upload functionality
- [ ] Bulk operations (import/export)
- [ ] Advanced analytics and charts
- [ ] User role management (Super Admin, Editor, Viewer)
- [ ] Content approval workflow
- [ ] Scheduled publishing
- [ ] SEO optimization tools
- [ ] Multi-language support
- [ ] Dark mode toggle

---

## 📞 Support

For issues or feature requests:
- Check the main project README
- Review component source code
- Contact development team

---

## ✨ Summary

The Admin Panel provides everything you need to manage your Tally Accounting Hub Pro platform:

- 📊 **Dashboard**: Real-time analytics and insights
- 🎥 **Videos**: Complete video library management
- 🏏 **Sports**: Live match updates and fixtures
- 🎬 **Movies**: Entertainment content control
- 🎓 **Courses**: Educational course administration
- ⚙️ **Settings**: System configuration and security

**Access it now at: `http://localhost:8080/admin`**

Happy managing! 🎉
