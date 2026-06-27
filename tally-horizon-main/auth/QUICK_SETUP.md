# ⚡ Quick Setup Guide - 5 Minutes

This is the fastest way to get the authentication system running!

## 🎯 Prerequisites

- Node.js installed
- PostgreSQL installed
- Both servers (frontend & backend) terminals ready

---

## 📋 Step 1: Database Setup (2 minutes)

```bash
# Open Command Prompt as Administrator

# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE tally_auth;

# Exit
\q

# Run the schema
cd auth\backend
psql -U postgres -d tally_auth -f database\schema.sql
```

**Expected Output:** `Database schema created successfully!`

---

## 📋 Step 2: Install Backend (1 minute)

```bash
# Still in auth\backend directory
npm install
```

**This installs:** Express, PostgreSQL driver, JWT, Bcrypt, Nodemailer, Passport, and all security packages.

---

## 📋 Step 3: Configure Database Password (30 seconds)

```bash
# Edit auth\.env file
# Change this line:
DB_PASSWORD=postgres

# To your actual PostgreSQL password:
DB_PASSWORD=your_password_here
```

---

## 📋 Step 4: Start Backend Server (30 seconds)

```bash
# Still in auth\backend
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════════════╗
║    🔐 TALLY AUTHENTICATION SERVER                         ║
║    Server running at: http://localhost:5000               ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 📋 Step 5: Frontend Already Running! (0 seconds)

Your frontend is already running from before at `http://localhost:8080`!

---

## ✅ Test It Works!

### Test 1: Health Check

Open browser: `http://localhost:5000/health`

**Should see:**
```json
{
  "status": "success",
  "message": "Server is running",
  "otpEnabled": false,
  "googleAuthEnabled": false
}
```

### Test 2: Register New User

1. Go to: `http://localhost:8080/register`
2. Fill the form:
   - Name: `John Doe`
   - Email: `john@test.com`
   - Password: `Test@1234`
   - Confirm: `Test@1234`
   - Check "Accept Terms"
3. Click "Create Account"

**Result:** You should be logged in immediately! (OTP is disabled by default)

### Test 3: Login

1. Go to: `http://localhost:8080/login`
2. Enter:
   - Email: `john@test.com`
   - Password: `Test@1234`
3. Click "Sign In"

**Result:** You should be logged in!

---

## 🎉 Done!

You now have a fully working authentication system with:

✅ User Registration
✅ User Login  
✅ JWT Authentication
✅ Password Hashing
✅ Secure Sessions
✅ Profile Management
✅ Password Reset
✅ Rate Limiting
✅ XSS Protection
✅ SQL Injection Protection
✅ Account Lockout

---

## 🔧 Optional Features

### Enable OTP Email Verification

```env
# In auth\.env
OTP_ENABLED=true
EMAIL_SERVICE_KEY=your_key
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password
```

Restart backend server.

### Enable Google Login

```env
# In auth\.env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
```

Restart backend server.

---

## 🐛 Common Issues

### "Database connection failed"

**Fix:**
```env
# Check auth\.env
DB_PASSWORD=your_actual_postgres_password
```

### "Port 5000 already in use"

**Fix:**
```env
# Change port in auth\.env
PORT=5001
```

### "npm: command not found"

**Fix:** Install Node.js from https://nodejs.org/

### "psql: command not found"

**Fix:** Add PostgreSQL to PATH or use full path:
```bash
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres
```

---

## 📝 What's Running?

- **Frontend:** http://localhost:8080 (Vite dev server)
- **Backend API:** http://localhost:5000 (Express server)
- **Database:** PostgreSQL on port 5432

---

## 🎯 Next Steps

1. **Test all features** - Registration, Login, Profile
2. **Configure OTP** - Add email service for production
3. **Setup Google OAuth** - For social login
4. **Review security** - Change JWT secrets for production
5. **Deploy** - See DEPLOYMENT.md guide

---

## 🆘 Need Help?

- Check logs: `auth/backend/logs/app.log`
- Review: `INSTALLATION.md` (detailed guide)
- Check: `README.md` (full documentation)

---

**Setup Complete! 🚀**

Your authentication system is production-ready and fully functional!

**Total Setup Time:** ⏱️ **5 minutes**
