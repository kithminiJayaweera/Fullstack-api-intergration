# Cookie Authentication Debugging Guide

## Current Setup
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5174
- **Cookie name**: `auth_token`
- **Cookie settings**: httpOnly, sameSite: lax, 7-day expiry

## Step-by-Step Testing Instructions

### Step 1: Restart Backend Server
```powershell
cd backend
npm run dev
```

**Expected Console Output:**
```
🌐 CORS allowed origins: [ 'http://localhost:5173', 'http://localhost:5174' ]
🔌 MongoDB connected: ...
✅ Server running on port 5000
```

### Step 2: Start Frontend (if not running)
```powershell
cd frontend
npm run dev
```

Open browser at: http://localhost:5174

### Step 3: Test Registration with Debug Logs

1. **Navigate to**: http://localhost:5174/signup

2. **Fill form** with test data:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
   - Phone (optional): +1234567890

3. **Submit form**

4. **Check Browser Console** (F12 → Console tab):
   - Look for: `📤 API Request: POST /auth/register`
   - Look for: `🍪 withCredentials: true`
   - Look for: `📥 API Response: 201 /auth/register`
   - Look for: `🔐 Auth response headers:` (should show Set-Cookie if present)

5. **Check Backend Console**:
   ```
   🔍 CORS check - Request origin: http://localhost:5174
   ✅ CORS allowed - origin matched: http://localhost:5174
   ✅ User registered: test@example.com
   🍪 Cookie set with options: {
     name: 'auth_token',
     tokenPreview: 'eyJhbGciOiJIUzI1NI...',
     httpOnly: true,
     secure: false,
     sameSite: 'lax',
     maxAge: '604800000ms (7 days)'
   }
   ```

6. **Check Browser DevTools → Application → Cookies**:
   - Navigate to: Application tab → Storage → Cookies → http://localhost:5000
   - **Look for `auth_token` cookie**
   - Should show:
     - Name: `auth_token`
     - Value: `eyJhbGciOiJIUzI1NI...` (long JWT string)
     - Domain: `localhost`
     - Path: `/`
     - HttpOnly: ✅ (checked)
     - Secure: ❌ (unchecked in dev mode)
     - SameSite: `Lax`

7. **Check Network Tab**:
   - Open: DevTools → Network tab
   - Find: `register` request (POST)
   - Click on it
   - Go to: **Response Headers** section
   - **Look for**: `Set-Cookie: auth_token=eyJhb...`
   - If you DON'T see it, there's a problem with cookie setting

### Step 4: Test Protected Route (verify cookie is sent)

1. **Navigate to**: http://localhost:5174/ (dashboard)

2. **This should trigger `/api/auth/me` request**

3. **Check Browser Console**:
   - Look for: `📤 API Request: GET /auth/me`
   - Look for: `🍪 withCredentials: true`

4. **Check Backend Console**:
   ```
   🔍 Auth middleware - checking credentials...
   📝 All cookies: { auth_token: 'eyJhbGciOiJIUzI1NI...' }
   📝 Headers origin: http://localhost:5174
   ✅ Token found in cookie
   🔐 Token source: cookie
   ```

5. **If successful**, you should see user data in the response
6. **If failed**, backend will log: `❌ No token found in cookies or headers`

---

## Common Issues & Solutions

### Issue 1: Cookie Not Appearing in Browser
**Symptoms**: 
- Backend logs show "🍪 Cookie set with options"
- But Browser DevTools shows no cookie under localhost:5000

**Possible Causes**:
1. **Browser blocking third-party cookies**
2. **SameSite policy too strict**
3. **Domain mismatch** (localhost vs 127.0.0.1)

**Solutions**:
```typescript
// Try adding explicit domain in backend/routes/authRoutes.ts
res.cookie('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  domain: 'localhost', // Add this
  path: '/' // Add this
});
```

### Issue 2: CORS Preflight Failing
**Symptoms**: 
- Network tab shows OPTIONS request before POST
- OPTIONS returns 200 but POST fails
- CORS error in console

**Solution**: Already configured! Check backend logs for:
```
✅ CORS allowed - origin matched: http://localhost:5174
```

### Issue 3: Cookie Set But Not Sent to Backend
**Symptoms**:
- Cookie appears in DevTools under localhost:5000
- But backend logs show: `📝 All cookies: {}`

**Possible Causes**:
1. **Cookie domain doesn't match request domain**
2. **Path doesn't match**
3. **Secure flag set in dev mode**

**Solution**: Verify cookie domain is `localhost` (not `.localhost` or specific subdomain)

### Issue 4: Using 127.0.0.1 Instead of localhost
**Symptoms**: 
- Frontend at http://127.0.0.1:5174
- Backend at http://localhost:5000 (or vice versa)
- Cookies don't work

**Solution**: Use `localhost` consistently for both frontend and backend

---

## Manual cURL Tests

### Test 1: Register with Cookie
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -H "Origin: http://localhost:5174" `
  -d '{\"email\":\"curl@test.com\",\"password\":\"test123\",\"firstName\":\"Curl\",\"lastName\":\"Test\"}' `
  -c cookies.txt -v
```

**Expected**: 
- Response headers should include: `Set-Cookie: auth_token=...`
- Cookie saved to `cookies.txt`

### Test 2: Access Protected Route with Cookie
```powershell
curl -X GET http://localhost:5000/api/auth/me `
  -H "Origin: http://localhost:5174" `
  -b cookies.txt -v
```

**Expected**: 
- Should return user data (not 401)
- Backend logs should show: `✅ Token found in cookie`

---

## Debug Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5174
- [ ] CORS logs show origin matched
- [ ] Register request returns 201 status
- [ ] Backend logs show "🍪 Cookie set with options"
- [ ] Network tab shows `Set-Cookie` header in response
- [ ] Browser DevTools shows `auth_token` cookie under localhost:5000
- [ ] Cookie has HttpOnly flag checked
- [ ] Protected route (/me) sends cookie in request
- [ ] Backend middleware logs show "✅ Token found in cookie"
- [ ] No CORS errors in browser console
- [ ] No 401 errors after login/register

---

## Next Steps if Still Not Working

1. **Check browser cookie settings**:
   - Chrome: Settings → Privacy → Cookies → "Allow all cookies"
   - Edge: Settings → Cookies → "Don't block cookies"

2. **Try different browser** (Chrome, Edge, Firefox)

3. **Clear all cookies and cache** (Ctrl+Shift+Delete)

4. **Check backend environment**:
   ```powershell
   cd backend
   type .env
   ```
   Ensure `NODE_ENV` is NOT set to "production" (or set to "development")

5. **Verify cookie-parser is working**:
   - Backend logs should show all cookies as an object
   - If shows `undefined`, cookie-parser middleware may not be loaded

6. **Check middleware order in server.ts**:
   ```typescript
   app.use(cors({...}));     // MUST be first
   app.use(cookieParser());  // MUST be before routes
   app.use(express.json());
   app.use('/api/auth', authRoutes); // After all middleware
   ```
