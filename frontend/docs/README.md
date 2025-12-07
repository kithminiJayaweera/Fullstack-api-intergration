# API Integration Task

Full-stack application with **secure JWT + Cookie authentication**, MongoDB integration, and comprehensive user management.

## 🔐 Authentication System

**JWT tokens stored in HTTP-only cookies** - NO localStorage!

### Security Features
- ✅ **HttpOnly Cookies** - JavaScript cannot access tokens (XSS protection)
- ✅ **SameSite Cookies** - CSRF protection  
- ✅ **No localStorage** - Secure token storage
- ✅ **bcrypt Password Hashing** - Secure password storage (10 salt rounds)
- ✅ **JWT Verification** - Token tampering detection

---

## 🚀 Quick Start

### 1. Backend Setup
```powershell
cd backend
copy .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```
Backend runs on: **http://localhost:5000**

### 2. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:5174**

### 3. Test
1. Open http://localhost:5174/signup
2. Create an account
3. Open DevTools (F12) → Application → Cookies → http://localhost:5000
4. Verify `auth_token` cookie exists with HttpOnly ✅

---

## 🧪 Testing

### Visual Test Tool
Open `cookie-test.html` in your browser - provides a simple interface to test all authentication endpoints.

### Manual Testing
1. Register at http://localhost:5174/signup
2. Open DevTools (F12) → Application → Cookies
3. Verify `auth_token` cookie under http://localhost:5000
4. Navigate to Dashboard (protected route)
5. Cookie should be sent automatically

---

## 📚 Documentation

| File | Description |
|------|-------------|
| **TESTING_GUIDE.md** | Comprehensive testing instructions |
| **JWT_COOKIE_GUIDE.md** | JWT + Cookie authentication details |
| **AUTH_SETUP.md** | Authentication setup documentation |
| **cookie-test.html** | Visual testing tool |

---

## 🏗️ Project Structure

```
api-integration-task/
├── backend/                 # Express.js API server
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth middleware (cookie-first)
│   ├── models/             # MongoDB models (AuthUser, User)
│   ├── routes/             # API routes (auth, users)
│   └── server.ts           # Main server file
│
├── frontend/                # React + TypeScript frontend
│   └── src/
│       ├── apis/           # Axios config (withCredentials: true)
│       ├── contexts/       # AuthContext (no localStorage)
│       ├── components/     # UI components
│       └── pages/          # Pages (Auth, Dashboard, Users, etc.)
│
├── cookie-test.html        # Visual testing tool
└── START_HERE.md           # Testing guide

```

---

## 🔑 Environment Variables

Create `.env` in the `backend` folder:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:5174
```

---

## 🛡️ How Cookie Authentication Works

### Registration/Login Flow
1. User submits credentials
2. Backend validates and generates JWT
3. Backend sets HTTP-only cookie with JWT
4. Frontend receives response (cookie set automatically by browser)
5. User is authenticated

### Protected Route Access
1. User navigates to protected page
2. Browser automatically sends cookie with request
3. Backend middleware extracts token from cookie
4. Backend verifies JWT and returns data
5. Page loads with user data

### Logout Flow
1. User clicks logout
2. Backend clears the cookie
3. Frontend redirects to login
4. User must re-authenticate

---

## 🎯 API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new user (sets cookie)
- `POST /api/auth/login` - Login user (sets cookie)
- `POST /api/auth/logout` - Logout user (clears cookie)

### Authentication (Protected)
- `GET /api/auth/me` - Get current user (requires cookie)

### Users (Protected)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

---

## 🧰 Tech Stack

### Backend
- **Node.js** + **Express** (TypeScript)
- **MongoDB** + **Mongoose** (Database)
- **jsonwebtoken** (JWT generation/verification)
- **bcryptjs** (Password hashing)
- **cookie-parser** (Cookie handling)
- **cors** (Cross-origin requests with credentials)

### Frontend
- **React** + **TypeScript**
- **Axios** (API client with `withCredentials: true`)
- **React Router** (Navigation + protected routes)
- **Shadcn/UI** (UI components)
- **Tailwind CSS** (Styling)

---

## ✅ Implementation Checklist

- [x] JWT authentication with HTTP-only cookies
- [x] No localStorage (XSS protection)
- [x] CORS configured with credentials
- [x] Cookie-first authentication middleware
- [x] Automatic cookie sending with axios
- [x] Protected routes on frontend
- [x] Comprehensive debug logging
- [x] Visual testing tool (cookie-test.html)
- [x] Complete documentation
- [ ] **YOUR TURN**: Test in browser and verify cookies work!

---

## 🐛 Troubleshooting

### Cookie Not Appearing?
1. Check backend logs for `🍪 Cookie set with options`
2. Check Network tab for `Set-Cookie` header
3. Check Application → Cookies in DevTools
4. See `COOKIE_DEBUG_TEST.md` for detailed troubleshooting

### 401 Unauthorized?
1. Verify cookie exists in DevTools
2. Check backend logs for `✅ Token found in cookie`
3. Clear cookies and login again

### CORS Errors?
1. Check backend logs for `✅ CORS allowed`
2. Verify frontend URL matches allowed origins
3. Ensure `credentials: true` in CORS config

---

## 📖 Learn More

- **JWT Documentation**: https://jwt.io/
- **HTTP Cookies**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
- **CORS with Credentials**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials

---

## 🎉 You're Ready!

Everything is configured and documented. Open **START_HERE.md** to begin testing!

For the best testing experience, open `cookie-test.html` in your browser for visual feedback.
