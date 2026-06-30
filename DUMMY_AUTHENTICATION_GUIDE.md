# Dummy Authentication System Guide 🔐

## Overview
The application now uses a **fully functional dummy authentication system** that works entirely in the browser using localStorage. **No backend server required!**

---

## ✨ Features

### 1. **Complete User Registration**
- Full name, username, email/phone
- Password validation
- Profile photo upload (optional)
- Duplicate checking (username, email, phone)
- Auto-save login identifiers

### 2. **User Login**
- Login with username, email, or phone
- Password verification
- Remember saved accounts
- Auto-complete suggestions
- Session persistence

### 3. **Session Management**
- JWT-like token generation
- Persistent sessions (survives page reload)
- Logout functionality
- Profile updates

### 4. **Content Purchases**
- Track purchased courses
- Track purchased videos
- Persistent purchase history

---

## 🚀 How to Use

### Sign Up (Create Account)
1. Go to: http://localhost:8080/signup
2. Fill in the form:
   - **Full Name**: Your name
   - **Username**: Unique username (min 3 chars)
   - **Email** OR **Phone**: At least one required
   - **Password**: Min 6 characters
   - **Confirm Password**: Must match
3. Optional: Upload a profile photo
4. Click **Create Account**
5. ✅ You're logged in!

### Login (Existing Account)
1. Go to: http://localhost:8080/login
2. Enter your:
   - Username, email, OR phone
   - Password
3. Click **Login**
4. ✅ You're logged in!

### Test Accounts

Create your own accounts! The system will save them automatically.

**Example Test Account:**
- Username: `testuser`
- Email: `test@example.com`
- Phone: `9876543210`
- Password: `123456`

(You need to create this account first via signup page)

---

## 🔍 How It Works

### localStorage Database Structure

#### 1. Users Database
```javascript
// Key: 'tally_users_db'
[
  {
    id: "user_1735420000000",
    fullName: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    phone: "9876543210",
    password: "123456", // Plain text (for demo only!)
    avatar: null,
    purchasedCourses: [],
    purchasedVideos: [],
    createdAt: "2026-06-28T10:30:00.000Z"
  },
  // ... more users
]
```

#### 2. Current Session
```javascript
// Key: 'tally_auth_user'
{
  id: "user_1735420000000",
  fullName: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  phone: "9876543210",
  avatar: null,
  name: "John Doe",
  purchasedCourses: [],
  purchasedVideos: []
}

// Key: 'tally_jwt_token'
"dummy_token_user_1735420000000_1735420500000"
```

#### 3. Saved Login Identifiers
```javascript
// Key: 'tally_saved_identifiers'
[
  "johndoe",
  "test@example.com",
  "9876543210"
  // ... up to 5 most recent
]
```

---

## 🎯 Features in Detail

### 1. Signup Process
```
User fills form
    ↓
Validation checks
    ↓
Check duplicates
    ↓
Create user in localStorage
    ↓
Generate token
    ↓
Save session
    ↓
Auto-login ✅
```

### 2. Login Process
```
User enters credentials
    ↓
Find user in database
    ↓
Verify password
    ↓
Generate token
    ↓
Save session
    ↓
Save identifier for autocomplete
    ↓
Login successful ✅
```

### 3. Session Persistence
```
Page loads
    ↓
Check localStorage for token & user
    ↓
If found: Restore session ✅
If not: Stay logged out
```

### 4. Autocomplete
```
User types in login field
    ↓
Filter saved identifiers
    ↓
Show dropdown suggestions
    ↓
Click to auto-fill ✅
```

---

## 🛡️ Security Notes

### ⚠️ Important: This is for DEMO/DEVELOPMENT only!

**What's NOT secure:**
- ❌ Passwords stored in plain text
- ❌ No actual encryption
- ❌ No server-side validation
- ❌ Anyone can inspect localStorage
- ❌ No protection against XSS
- ❌ Tokens are not real JWTs

**For Production, you need:**
- ✅ Real backend API
- ✅ Password hashing (bcrypt, argon2)
- ✅ Real JWT tokens with expiry
- ✅ HTTPS encryption
- ✅ Rate limiting
- ✅ CSRF protection
- ✅ XSS sanitization
- ✅ SQL injection prevention
- ✅ Secure session management

---

## 🔧 Technical Implementation

### Key Functions

#### 1. User Database Management
```typescript
// Get all users
function getUsersDB(): any[] {
  const raw = localStorage.getItem('tally_users_db');
  return raw ? JSON.parse(raw) : [];
}

// Save users
function saveUsersDB(users: any[]) {
  localStorage.setItem('tally_users_db', JSON.stringify(users));
}

// Find user by identifier
function findUser(identifier: string): any | null {
  const users = getUsersDB();
  return users.find(u => 
    u.username === identifier || 
    u.email === identifier || 
    u.phone === identifier
  ) || null;
}
```

#### 2. Token Generation
```typescript
function generateToken(userId: string): string {
  return `dummy_token_${userId}_${Date.now()}`;
}
```

#### 3. Session Persistence
```typescript
function persist(user: AuthUser, token: string) {
  setUser(user);
  setToken(token);
  localStorage.setItem('tally_jwt_token', token);
  localStorage.setItem('tally_auth_user', JSON.stringify(user));
}
```

---

## 📱 User Experience Features

### 1. **Saved Accounts Dropdown**
- Shows up to 5 recent accounts
- Click to auto-fill
- Avatar display
- Smooth animations

### 2. **Password Strength Indicator**
- 4-bar visualization
- Color changes: Red → Orange → Green
- Real-time feedback

### 3. **Profile Photo Upload**
- Drag image or click to browse
- 5MB size limit
- Instant preview
- Initials fallback

### 4. **Form Validation**
- Required field checking
- Email format validation
- Username length validation (min 3)
- Password length validation (min 6)
- Password match verification
- Real-time error messages

### 5. **Visual Feedback**
- Loading spinners
- Toast notifications
- Error banners
- Success messages
- Smooth transitions

---

## 🎨 UI Components

### Login Page Features
- **Brand Header**: Logo with gradient
- **Glass Morphism Card**: Modern design
- **Autocomplete Dropdown**: Recent accounts
- **Password Toggle**: Show/hide button
- **Error Banner**: Animated error display
- **Loading State**: Spinner during login

### Signup Page Features
- **Avatar Picker**: Profile photo upload
- **Multi-field Form**: All user details
- **Password Strength**: Visual indicator
- **Match Validation**: Confirm password
- **Loading State**: Spinner during signup

---

## 🔄 User Flows

### New User Journey
```
Visit site
    ↓
Click "Sign Up"
    ↓
Fill registration form
    ↓
Upload profile photo (optional)
    ↓
Submit form
    ↓
Account created ✅
    ↓
Auto-login & redirect to home
```

### Returning User Journey
```
Visit site
    ↓
Click "Login"
    ↓
See saved accounts dropdown
    ↓
Click saved account (or type manually)
    ↓
Enter password
    ↓
Submit form
    ↓
Login successful ✅
    ↓
Redirect to home
```

### Purchase Flow
```
Browse content
    ↓
Click premium content
    ↓
Redirected to login (if not logged in)
    ↓
Login/signup
    ↓
Return to content
    ↓
Purchase content
    ↓
Content unlocked ✅
```

---

## 🧪 Testing Guide

### Test Signup
1. Open: http://localhost:8080/signup
2. Fill form with unique data
3. Verify validation messages
4. Submit and check success

### Test Login
1. Open: http://localhost:8080/login
2. Use created account
3. Check autocomplete works
4. Verify password toggle
5. Submit and check success

### Test Session Persistence
1. Login to account
2. Close tab
3. Reopen site
4. Verify still logged in ✅

### Test Logout
1. While logged in, logout
2. Verify redirected to home
3. Verify can't access protected content
4. Session cleared ✅

### Test Duplicate Prevention
1. Create account
2. Try creating same username
3. Verify error message ✅

### Test Validation
- Try empty fields
- Try short username (<3 chars)
- Try short password (<6 chars)
- Try mismatched passwords
- Try invalid email format

---

## 📂 Files Modified

```
src/contexts/AuthProvider.tsx
├─ Removed backend API calls
├─ Added localStorage database
├─ Implemented dummy signup
├─ Implemented dummy login
└─ Added validation logic
```

---

## 🎯 Quick Start

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Create Test Account
- Go to: http://localhost:8080/signup
- Username: `demo`
- Email: `demo@test.com`
- Password: `123456`
- Click "Create Account"

### 3. Test Login
- Go to: http://localhost:8080/login
- Enter: `demo` (or `demo@test.com`)
- Password: `123456`
- Click "Login"

### 4. Verify Session
- Refresh page
- Should stay logged in ✅

---

## 🐛 Troubleshooting

### Issue: Can't Login
**Solution**: Make sure you created an account first via signup page

### Issue: Autocomplete Not Showing
**Solution**: Login successfully at least once to save identifier

### Issue: Session Not Persisting
**Solution**: Check browser's localStorage is enabled

### Issue: Duplicate Username Error
**Solution**: Use a different username

### Issue: Password Mismatch
**Solution**: Make sure passwords match exactly

---

## 🔍 Debug Tools

### View localStorage in Browser
```javascript
// Open browser console (F12)

// View all users
console.log(JSON.parse(localStorage.getItem('tally_users_db')));

// View current user
console.log(JSON.parse(localStorage.getItem('tally_auth_user')));

// View token
console.log(localStorage.getItem('tally_jwt_token'));

// View saved identifiers
console.log(JSON.parse(localStorage.getItem('tally_saved_identifiers')));
```

### Clear All Data
```javascript
// Open browser console (F12)
localStorage.clear();
// Then refresh page
```

---

## ✅ Status

- 🟢 **Signup**: Working perfectly
- 🟢 **Login**: Working perfectly
- 🟢 **Logout**: Working perfectly
- 🟢 **Session**: Persists across reloads
- 🟢 **Autocomplete**: Saves identifiers
- 🟢 **Validation**: All checks working
- 🟢 **Profile**: Avatar upload working
- 🟢 **Purchases**: Tracking working

---

## 🚀 Ready to Use!

The dummy authentication system is **fully functional** and ready for development and testing. No backend server needed!

**Try it now:**
1. http://localhost:8080/signup - Create account
2. http://localhost:8080/login - Login
3. Enjoy the app! 🎉

---

**Note**: Remember this is for development/demo purposes only. For production, implement a proper backend with real security measures!
