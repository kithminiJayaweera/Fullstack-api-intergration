# JWT + HTTP-Only Cookie Authentication Guide 🔐

## ✅ What I Fixed

Your authentication system now uses **BOTH JWT tokens AND HTTP-only cookies** for maximum security:

### Backend Changes (TypeScript)

1. **`backend/routes/authRoutes.ts`**
   - ✅ Register & Login: Sets JWT in **HTTP-only cookie** (`auth_token`)
   - ✅ Still returns token in JSON response (for debugging/compatibility)
   - ✅ Logout: Clears the HTTP-only cookie from server
   - ✅ Creates both `AuthUser` (credentials) and `User` (profile) documents

2. **`backend/middleware/auth.ts`**
   - ✅ Checks cookie FIRST (`req.cookies.auth_token`)
   - ✅ Falls back to Authorization header if no cookie
   - ✅ Supports both `id` and `userId` in JWT payload
   - ✅ Properly maps decoded token to `req.user`

3. **`backend/server.ts`**
   - ✅ CORS allows multiple origins (5173, 5174, or FRONTEND_URL env var)
   - ✅ `credentials: true` enables cookies across origins
   - ✅ `cookieParser()` middleware parses cookies

### Frontend Changes (React + TypeScript)

4. **`frontend/src/apis/auth.ts`**
   - ✅ `withCredentials: true` sends cookies automatically
   - ✅ Removed localStorage token logic
   - ✅ Cookie sent automatically with every request

5. **`frontend/src/contexts/AuthContext.tsx`**
   - ✅ NO localStorage usage (more secure!)
   - ✅ On app load: calls `/me` (cookie sent automatically)
   - ✅ Login/Register: Cookie set by server automatically
   - ✅ Logout: Calls server to clear cookie

---

## 🔒 Security Benefits

### Why HTTP-only Cookies are Better than localStorage

| Feature | localStorage | HTTP-only Cookie |
|---------|--------------|------------------|
| **XSS Protection** | ❌ JavaScript can read it | ✅ JavaScript CANNOT access |
| **CSRF Protection** | ✅ Not vulnerable | ⚠️ Need SameSite=lax/strict |
| **Automatic sending** | ❌ Must manually add to headers | ✅ Browser sends automatically |
| **Server-side control** | ❌ Client controls it | ✅ Server sets & clears it |

### Cookie Settings Explained

```typescript
res.cookie('auth_token', token, {
  httpOnly: true,      // ✅ JavaScript cannot read this cookie (XSS protection)
  secure: true,        // ✅ Only sent over HTTPS in production
  sameSite: 'lax',     // ✅ CSRF protection (blocks cross-site requests)
  maxAge: 7 days       // ✅ Expires in 7 days
});
```

### JWT Payload (What's Inside the Token)

```json
{
  "id": "user_id_here",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "iat": 1700000000,
  "exp": 1700604800
}
```

**❌ NEVER include:**
- Passwords (even hashed)
- Sensitive personal data
- Credit card info

---

## 🚀 How to Test

### 1. Start Backend

```powershell
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
📦 Database: usersdb
🔐 Collections: Users, AuthUsers
🚀 Server running on port 5000
```

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

### 3. Test Signup Flow

**A) In Browser (http://localhost:5174/signup):**

1. Fill the form:
   - First Name: Alice
   - Last Name: Smith
   - Email: alice@example.com
   - Password: password123
   - Phone: +1234567890 (optional)

2. Submit → You should be redirected to dashboard

3. Check DevTools:
   - **Application → Cookies → http://localhost:5000**
   - You should see: `auth_token` with a long JWT value
   - HttpOnly: ✅ (checkmark should be present)

**B) With curl (manual test):**

```bash
curl -i -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Bob","lastName":"Jones","email":"bob@example.com","password":"password123"}' \
  -c cookies.txt
```

Expected response headers:
```
Set-Cookie: auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Lax
```

### 4. Test Login Flow

**Browser:**
1. Logout (clears cookie)
2. Go to /login
3. Enter credentials
4. Check cookie is set again

**curl:**
```bash
curl -i -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@example.com","password":"password123"}' \
  -c cookies.txt
```

### 5. Test Protected Routes

**Browser:**
- Navigate to /users or /products
- Should work without any manual token handling

**curl with cookie:**
```bash
# Use the cookie from previous request
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```

Expected response:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "bob@example.com",
    "name": "Bob Jones",
    "role": "user"
  }
}
```

### 6. Verify JWT Contents

Copy the token from:
- Response JSON (field: `token`), OR
- Cookie value from DevTools

Paste into https://jwt.io/ and verify:
- ✅ Payload has: id, email, name, role
- ❌ Payload does NOT have: password

### 7. Test Logout

**Browser:**
1. Click logout
2. Check cookie is deleted (Application → Cookies)
3. Try accessing protected route → should redirect to login

**curl:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

---

## 🗄️ Database Collections

After signup, check MongoDB:

### `authusers` Collection (Sensitive)
```json
{
  "_id": "...",
  "email": "alice@example.com",
  "password": "$2a$10$hashed...", // ✅ Hashed with bcrypt
  "name": "Alice Smith",
  "role": "user",
  "createdAt": "2024-11-24T...",
  "updatedAt": "2024-11-24T..."
}
```

### `users` Collection (Non-Sensitive Profile)
```json
{
  "_id": "...",
  "email": "alice@example.com",
  "firstName": "Alice",
  "lastName": "Smith",
  "phone": "+1234567890",
  "age": null,
  "gender": null,
  "birthDate": null,
  "createdAt": "2024-11-24T...",
  "updatedAt": "2024-11-24T..."
}
```

---

## 🔧 Environment Variables

### `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://...your-connection-string.../usersdb
NODE_ENV=development
JWT_SECRET=your-super-secret-key-min-32-chars-long-random-string
FRONTEND_URL=http://localhost:5174
```

**Generate a secure JWT_SECRET:**

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Output example:
# a1b2c3d4e5f6...long-random-string...
```

---

## 🐛 Common Issues & Fixes

### Issue: "CORS policy: Origin not allowed"

**Cause:** Frontend runs on different port than backend expects

**Fix:** Add your port to `server.ts`:
```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', // ✅ Your port
  process.env.FRONTEND_URL
];
```

### Issue: Cookie not being set

**Symptoms:**
- No `auth_token` in DevTools → Cookies
- 401 errors on protected routes

**Fixes:**
1. Ensure backend `credentials: true` in CORS
2. Ensure frontend `withCredentials: true` in axios
3. Check browser URL matches allowed origins EXACTLY
   - `http://localhost:5174` ≠ `http://127.0.0.1:5174`

### Issue: "Cannot GET /api/auth/register"

**Cause:** Hitting GET instead of POST, or route not registered

**Fix:** Ensure you're using POST and backend logs show route registration

### Issue: Token expired errors

**Cause:** Token has 7-day expiration

**Fix:** Login again. For longer sessions, increase `expiresIn` in `authUser.ts`:
```typescript
jwt.sign(payload, secret, { expiresIn: '30d' }); // 30 days
```

### Issue: Cookie sent but backend says "No token"

**Cause:** Cookie name mismatch or middleware not parsing cookies

**Fix:**
1. Verify cookie name is `auth_token` in DevTools
2. Ensure `cookieParser()` is used BEFORE routes in `server.ts`
3. Check middleware logs

---

## 🔐 Security Best Practices

### ✅ Currently Implemented

1. **HTTP-only cookies** - XSS protection
2. **SameSite=lax** - CSRF protection
3. **Secure flag in production** - HTTPS only
4. **Password hashing** - bcrypt with salt
5. **JWT expiration** - 7-day limit
6. **No sensitive data in JWT** - Only id/email/role

### 🎯 Recommended Enhancements

1. **Add Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

2. **Add Helmet for Security Headers**
   ```bash
   npm install helmet
   ```

3. **Implement Refresh Tokens**
   - Short-lived access token (15 min)
   - Long-lived refresh token (30 days, HTTP-only cookie)

4. **Add CSRF Token** (if you switch to full cookie-only)
   ```bash
   npm install csurf
   ```

5. **Environment-specific secrets**
   - Use different JWT_SECRET per environment
   - Rotate secrets periodically

---

## 📝 API Endpoints

### Auth Routes

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | No | Logout (clears cookie) |
| GET | `/api/auth/me` | Yes | Get current user |

### User Routes (Protected)

| Method | Endpoint | Auth Required | Admin Only | Description |
|--------|----------|---------------|------------|-------------|
| GET | `/api/users` | Yes | No | List all users |
| GET | `/api/users/:id` | Yes | No | Get user by ID |
| POST | `/api/users` | Yes | Yes | Create user |
| PUT | `/api/users/:id` | Yes | Yes | Update user |
| DELETE | `/api/users/:id` | Yes | Yes | Delete user |

---

## 🎉 Summary

Your app now uses:
- ✅ **JWT tokens** for stateless authentication
- ✅ **HTTP-only cookies** for secure token storage
- ✅ **No localStorage** (more secure!)
- ✅ **Automatic cookie handling** (browser does it for you)
- ✅ **bcrypt** for password hashing
- ✅ **Separate collections** for auth and profile data

The cookie is sent **automatically** by the browser with every request - you don't need to manually add Authorization headers!

---

## 🚀 Next Steps

Choose one:

**A) Profile Management**
- Add endpoint to update User profile (phone, age, gender)
- Create UI to edit profile

**B) Admin Panel**
- Add admin-only routes
- Create admin dashboard

**C) Advanced Security**
- Implement refresh token flow
- Add rate limiting
- Add CSRF protection

**D) Production Deployment**
- Set up HTTPS
- Configure production environment
- Use proper JWT_SECRET
- Set CORS to specific origins only

Let me know which you want to implement next!
