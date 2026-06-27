# 🔐 Production-Ready Authentication Module

A complete, secure, and scalable authentication system with email/password, Google OAuth, and optional OTP verification.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Usage](#usage)
- [Deployment](#deployment)

---

## ✨ Features

### Authentication Methods
- ✅ Email/Password Registration & Login
- ✅ Google OAuth Integration
- ✅ Optional OTP Email Verification
- ✅ Forgot Password & Reset
- ✅ Remember Me Functionality
- ✅ Secure Session Management

### Security
- 🔒 JWT Token Authentication
- 🔒 Bcrypt Password Hashing
- 🔒 CSRF Protection
- 🔒 Rate Limiting
- 🔒 XSS Protection
- 🔒 SQL Injection Prevention
- 🔒 Account Lockout (5 failed attempts)
- 🔒 Secure HTTP-Only Cookies
- 🔒 Input Sanitization

### User Experience
- 📧 Email Verification with OTP
- 🔑 Password Strength Indicator
- 👁️ Show/Hide Password Toggle
- ✅ Form Validation
- 🔄 Google Single Sign-On
- 💾 Persistent Sessions (Remember Me)

### Graceful Degradation
- ⚠️ OTP system optional (configurable)
- ⚠️ Google Auth optional (configurable)
- ⚠️ Never crashes on missing config
- ⚠️ Meaningful error messages

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Token authentication
- **Bcrypt** - Password hashing
- **Passport.js** - Google OAuth
- **Nodemailer** - Email service
- **Express-Validator** - Input validation
- **Helmet** - Security headers
- **Express-Rate-Limit** - Rate limiting

### Frontend
- **React 19** - UI framework
- **TanStack Router** - Routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd auth/backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd auth/frontend

# Install dependencies
npm install

# Start development server
npm start
```

---

## 🔧 Environment Setup

### Backend `.env` Configuration

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:8080

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/tally_auth
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tally_auth
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

# Session Configuration
SESSION_SECRET=your_session_secret_key

# Cookie Configuration
COOKIE_SECRET=your_cookie_secret_key

# OTP Configuration (OPTIONAL)
OTP_ENABLED=true
OTP_EXPIRY=10
EMAIL_SERVICE_KEY=your_email_service_key_here
EMAIL_FROM=noreply@tallyaccounting.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Google OAuth Configuration (OPTIONAL)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Security Configuration
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
MAX_LOGIN_ATTEMPTS=5
ACCOUNT_LOCKOUT_TIME=30

# CORS Configuration
CORS_ORIGIN=http://localhost:8080
```

### Frontend `.env` Configuration

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🗄️ Database Setup

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE tally_auth;

# Exit
\q
```

### Run Migrations

```bash
# Backend directory
cd auth/backend

# Run migrations
npm run migrate

# Or manually
psql -U postgres -d tally_auth -f database/schema.sql
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/verify-otp` | Verify OTP code | No |
| POST | `/api/auth/resend-otp` | Resend OTP | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |
| POST | `/api/auth/refresh` | Refresh JWT token | Yes |

### Google OAuth

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | Google OAuth callback |

---

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Rate Limiting
- **Login**: 5 attempts per 15 minutes per IP
- **Registration**: 3 attempts per hour per IP
- **OTP Requests**: 3 attempts per hour per user
- **Password Reset**: 3 attempts per hour per email

### Account Lockout
- Account locked after 5 failed login attempts
- Lockout duration: 30 minutes
- Email notification on lockout

### Token Security
- JWT tokens stored in HTTP-only cookies
- Secure flag enabled in production
- SameSite attribute set to 'strict'
- CSRF protection enabled
- Token refresh mechanism

### Input Validation
- All inputs sanitized
- Email format validation
- Password strength validation
- XSS prevention
- SQL injection prevention

---

## 📖 Usage

### Registration Flow

```javascript
// 1. User fills registration form
{
  fullName: "John Doe",
  email: "john@example.com",
  password: "SecurePass123!",
  confirmPassword: "SecurePass123!",
  acceptTerms: true
}

// 2. Backend validates and creates user
// 3. If OTP_ENABLED=true:
//    - Generate 6-digit OTP
//    - Send email
//    - Return tempToken
// 4. If OTP_ENABLED=false:
//    - Skip OTP
//    - Return accessToken
//    - User logged in
```

### Login Flow

```javascript
// 1. User enters credentials
{
  email: "john@example.com",
  password: "SecurePass123!",
  rememberMe: true
}

// 2. Backend validates credentials
// 3. If OTP_ENABLED=true:
//    - Generate OTP
//    - Send email
//    - Return tempToken
// 4. If OTP_ENABLED=false:
//    - Return accessToken & refreshToken
//    - User logged in
```

### OTP Verification Flow

```javascript
// 1. User enters OTP
{
  tempToken: "...",
  otpCode: "123456"
}

// 2. Backend verifies OTP
// 3. Return accessToken & refreshToken
// 4. User logged in
```

### Google OAuth Flow

```javascript
// 1. User clicks "Continue with Google"
// 2. Redirect to Google consent screen
// 3. User authorizes
// 4. Google redirects to callback
// 5. Backend creates/finds user
// 6. Return tokens
// 7. User logged in
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Update `JWT_SECRET` with strong random key
- [ ] Configure production database
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Configure CORS for production domain
- [ ] Set up email service (SendGrid, AWS SES)
- [ ] Configure Google OAuth production credentials
- [ ] Enable rate limiting
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Configure backup strategy
- [ ] Set up logging
- [ ] Enable security headers
- [ ] Configure firewall rules

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Environment Variables

Replace all example values with production-grade secrets:

```bash
# Generate secure random keys
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📁 Folder Structure

```
auth/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   ├── passport.js
│   │   └── security.js
│   ├── controllers/
│   │   └── authController.js
│   ├── database/
│   │   ├── migrations/
│   │   └── schema.sql
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rateLimiter.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── OTP.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── otpService.js
│   │   └── tokenService.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── OTPVerification.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── ResetPassword.tsx
│   │   │   └── GoogleButton.tsx
│   │   └── ui/
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── services/
│   │   └── authService.ts
│   ├── utils/
│   │   └── validators.ts
│   └── routes/
│       ├── login.tsx
│       ├── register.tsx
│       └── verify-otp.tsx
└── README.md
```

---

## 🧪 Testing

```bash
# Run backend tests
cd auth/backend
npm test

# Run frontend tests
cd auth/frontend
npm test

# Run integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

---

## 🐛 Troubleshooting

### OTP Not Sending

1. Check `OTP_ENABLED=true` in `.env`
2. Verify `EMAIL_SERVICE_KEY` is set
3. Check SMTP credentials
4. Review email service logs

### Google Auth Not Working

1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. Check callback URL matches Google Console
3. Ensure domain is authorized in Google Console

### Database Connection Issues

1. Verify PostgreSQL is running
2. Check database credentials
3. Ensure database exists
4. Check firewall rules

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Support

For issues and questions:
- Open an issue on GitHub
- Contact: support@tallyaccounting.com

---

**Built with ❤️ for Tally Accounting Hub Pro**
