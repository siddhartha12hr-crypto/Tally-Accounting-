# 🚀 Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** - Comes with Node.js
- **Git** (optional) - For version control

---

## Step-by-Step Installation

### 1. Install PostgreSQL

#### Windows:
```bash
# Download installer from https://www.postgresql.org/download/windows/
# Run the installer and follow the setup wizard
# Remember the password you set for the 'postgres' user
```

#### Check Installation:
```bash
psql --version
# Should output: psql (PostgreSQL) 14.x or higher
```

### 2. Create Database

```bash
# Open Command Prompt or PowerShell as Administrator
# Connect to PostgreSQL
psql -U postgres

# Enter your postgres password when prompted

# Create the database
CREATE DATABASE tally_auth;

# Exit PostgreSQL
\q
```

### 3. Install Backend Dependencies

```bash
# Navigate to auth/backend directory
cd auth/backend

# Install Node.js dependencies
npm install

# This will install:
# - express (web framework)
# - pg (PostgreSQL client)
# - bcryptjs (password hashing)
# - jsonwebtoken (JWT authentication)
# - nodemailer (email service)
# - passport (Google OAuth)
# - And many more...
```

### 4. Configure Environment Variables

```bash
# The .env file is already created for you!
# Edit auth/.env file with your settings

# Update these values:
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Optional (for OTP email):
OTP_ENABLED=true
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password

# Optional (for Google OAuth):
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

#### How to Get Gmail App Password:
1. Go to your Google Account: https://myaccount.google.com/
2. Security → 2-Step Verification (enable if not already)
3. Security → App passwords
4. Select "Mail" and "Windows Computer"
5. Click "Generate"
6. Copy the 16-character password
7. Paste into SMTP_PASS in .env file

#### How to Get Google OAuth Credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
7. Copy Client ID and Client Secret
8. Paste into .env file

### 5. Run Database Migrations

```bash
# Still in auth/backend directory

# Run the SQL schema
psql -U postgres -d tally_auth -f database/schema.sql

# You should see: "Database schema created successfully!"
```

### 6. Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# You should see:
# ╔═══════════════════════════════════════════════════════════╗
# ║    🔐 TALLY AUTHENTICATION SERVER                         ║
# ║    Server running at: http://localhost:5000               ║
# ╚═══════════════════════════════════════════════════════════╝
```

### 7. Test Backend API

```bash
# Open a new terminal

# Test health endpoint
curl http://localhost:5000/health

# Should return:
# {
#   "status": "success",
#   "message": "Server is running",
#   "otpEnabled": false,
#   "googleAuthEnabled": false
# }
```

### 8. Install Frontend Dependencies

```bash
# Open a new terminal
# Navigate to the main project directory
cd tally-horizon-main

# Install dependencies (if not already done)
npm install
```

### 9. Start Frontend Development Server

```bash
# Should already be running from earlier
# If not, run:
npm run dev

# Frontend will be available at: http://localhost:8080
```

---

## 🧪 Testing the Authentication System

### Test Registration

1. Open browser: `http://localhost:8080/register`
2. Fill in the form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test@1234`
   - Confirm Password: `Test@1234`
   - Check "Accept Terms"
3. Click "Create Account"

**Expected Behavior:**
- If OTP_ENABLED=false: Immediately logged in
- If OTP_ENABLED=true: Redirected to OTP verification page

### Test Login

1. Open browser: `http://localhost:8080/login`
2. Enter:
   - Email: `test@example.com`
   - Password: `Test@1234`
3. Click "Sign In"

**Expected Behavior:**
- If OTP_ENABLED=false: Immediately logged in
- If OTP_ENABLED=true: OTP sent to email, redirected to verification

### Test Google Login

1. Ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
2. Click "Continue with Google"
3. Select your Google account
4. Authorize the app
5. You should be logged in

---

## 🔧 Troubleshooting

### Database Connection Error

**Error:** `password authentication failed for user "postgres"`

**Solution:**
```bash
# Check your password in .env file
DB_PASSWORD=your_actual_postgres_password

# Test connection manually
psql -U postgres -d tally_auth
```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change the port in .env
PORT=5001
```

### npm install Errors

**Error:** `npm ERR! code EACCES`

**Solution:**
```bash
# Run as administrator
# Or fix npm permissions:
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### SMTP Authentication Error

**Error:** `Invalid login: 535-5.7.8 Username and Password not accepted`

**Solution:**
- Use Gmail App Password, not your regular password
- Enable 2-Step Verification first
- Generate a new App Password
- Make sure no spaces in the password

### Google OAuth Error

**Error:** `redirect_uri_mismatch`

**Solution:**
- Go to Google Cloud Console
- Credentials → Edit OAuth client
- Add redirect URI: `http://localhost:5000/api/auth/google/callback`
- Save and try again

---

## 📝 Verify Installation

### Check Backend

```bash
# Test database connection
psql -U postgres -d tally_auth -c "SELECT COUNT(*) FROM users;"

# Should return a count (0 or more)
```

### Check Backend API

```bash
# Health check
curl http://localhost:5000/health

# Register endpoint (should require POST)
curl http://localhost:5000/api/auth/register

# Should return method not allowed or validation error
```

### Check Frontend

```bash
# Open browser
http://localhost:8080

# You should see the Tally Accounting Hub homepage
```

---

## 🎉 Success!

If you've completed all steps successfully:

✅ PostgreSQL database is running
✅ Backend server is running on http://localhost:5000
✅ Frontend is running on http://localhost:8080
✅ You can register and login users
✅ Authentication system is fully functional!

---

## 📚 Next Steps

1. **Test all features:**
   - Registration
   - Login
   - OTP verification (if enabled)
   - Google OAuth (if configured)
   - Forgot password
   - Profile update

2. **Review security settings:**
   - Change default JWT secrets
   - Configure rate limiting
   - Set up email service

3. **Deploy to production:**
   - See DEPLOYMENT.md
   - Use environment-specific .env files
   - Enable HTTPS
   - Set up monitoring

---

## 💡 Tips

- **Development:** Keep OTP_ENABLED=false for faster testing
- **Production:** Enable OTP and configure real email service
- **Security:** Never commit .env file to git
- **Backups:** Regular database backups are essential
- **Monitoring:** Set up logging and error tracking

---

## 🆘 Need Help?

- Check the main README.md
- Review server logs in `logs/app.log`
- Check database logs
- Ensure all environment variables are set
- Verify PostgreSQL is running

---

**Installation complete! 🚀**

You now have a fully functional production-ready authentication system!
