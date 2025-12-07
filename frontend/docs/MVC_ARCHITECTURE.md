# Backend MVC Architecture - Complete Restructure

## ✅ New Folder Structure

```
backend/src/
├── config/
│   ├── cloudinary.config.ts    # Cloudinary configuration
│   └── database.config.ts      # MongoDB connection
├── controllers/
│   ├── auth.controller.ts      # Authentication business logic
│   ├── user.controller.ts      # User management logic
│   └── product.controller.ts   # Product management logic
├── middleware/
│   ├── auth.middleware.ts      # JWT authentication middleware
│   ├── admin.middleware.ts     # Admin authorization middleware
│   └── upload.middleware.ts    # Multer file upload middleware
├── models/
│   ├── user.model.ts           # User schema & model
│   └── product.model.ts        # Product schema & model
├── routes/
│   ├── auth.routes.ts          # Authentication routes
│   ├── user.routes.ts          # User CRUD routes
│   └── product.routes.ts       # Product CRUD routes
└── server.ts                   # Application entry point
```

## 📋 Naming Conventions Applied

### Files:
- **Controllers**: `*.controller.ts` (e.g., `auth.controller.ts`)
- **Models**: `*.model.ts` (e.g., `user.model.ts`)
- **Routes**: `*.routes.ts` (e.g., `auth.routes.ts`)
- **Middleware**: `*.middleware.ts` (e.g., `auth.middleware.ts`)
- **Config**: `*.config.ts` (e.g., `database.config.ts`)

### Exports:
- **Controllers**: Named exports for each function
  ```typescript
  export const register = async (req, res) => { ... }
  export const login = async (req, res) => { ... }
  ```

- **Routes**: Default export of router
  ```typescript
  export default router;
  ```

- **Middleware**: Named exports
  ```typescript
  export const authenticate = (req, res, next) => { ... }
  export const requireAdmin = (req, res, next) => { ... }
  ```

- **Models**: Default export of model
  ```typescript
  export default mongoose.model<IUser>('User', UserSchema);
  ```

## 🏗️ MVC Pattern Implementation

### **Models** (Data Layer)
- Define database schemas
- Handle data validation
- Manage database operations
- Location: `models/*.model.ts`

**Files:**
- `user.model.ts` - User schema with password hashing, JWT generation
- `product.model.ts` - Product schema with categories, Cloudinary integration

### **Controllers** (Business Logic Layer)
- Handle request processing
- Implement business logic
- Call model methods
- Send responses
- Location: `controllers/*.controller.ts`

**Files:**
- `auth.controller.ts` - register, login, logout, getCurrentUser, deleteAccount
- `user.controller.ts` - getAllUsers, createUser, updateUser, deleteUser
- `product.controller.ts` - getAllProducts, getProductById, createProduct, updateProduct, deleteProduct

### **Routes** (API Layer)
- Define HTTP endpoints
- Map routes to controllers
- Apply middleware
- Location: `routes/*.routes.ts`

**Files:**
- `auth.routes.ts` - POST /register, /login, /logout, GET /me, DELETE /delete-account
- `user.routes.ts` - GET /, POST /, PUT /:id, DELETE /:id
- `product.routes.ts` - GET /, GET /:id, POST /, PUT /:id, DELETE /:id

### **Middleware** (Cross-Cutting Concerns)
- Authentication (JWT validation)
- Authorization (admin checks)
- File uploads (Multer)
- Error handling
- Location: `middleware/*.middleware.ts`

**Files:**
- `auth.middleware.ts` - `authenticate()` - validates JWT tokens
- `admin.middleware.ts` - `requireAdmin()` - checks admin role
- `upload.middleware.ts` - `upload` - handles file uploads (5MB limit, images only)

### **Config** (Configuration Layer)
- Database connections
- Third-party service configs
- Environment variables
- Location: `config/*.config.ts`

**Files:**
- `database.config.ts` - MongoDB connection with Mongoose
- `cloudinary.config.ts` - Cloudinary setup for image hosting

## 🔄 Before vs After

### Before (Old Structure):
```
routes/
  ├── authRoutes.ts       ❌ (controller logic mixed in)
  ├── userRoutes.ts       ❌ (controller logic mixed in)
  └── productRoutes.ts    ❌ (controller logic mixed in)
models/
  ├── User.ts             ❌
  ├── Product.ts          ❌
  └── AuthUser.ts         ❌ (duplicate)
middleware/
  ├── auth.ts             ❌
  ├── adminAuth.ts        ❌
  └── upload.ts           ❌
config/
  ├── database.ts         ❌
  └── cloudinary.ts       ❌
```

### After (New MVC Structure):
```
controllers/              ✅ NEW - Separated business logic
  ├── auth.controller.ts
  ├── user.controller.ts
  └── product.controller.ts
routes/                   ✅ Clean routes, no logic
  ├── auth.routes.ts
  ├── user.routes.ts
  └── product.routes.ts
models/                   ✅ Proper naming
  ├── user.model.ts
  └── product.model.ts
middleware/               ✅ Consistent naming
  ├── auth.middleware.ts
  ├── admin.middleware.ts
  └── upload.middleware.ts
config/                   ✅ Consistent naming
  ├── database.config.ts
  └── cloudinary.config.ts
```

## 📊 Benefits of MVC Architecture

### 1. **Separation of Concerns**
- Each layer has a single responsibility
- Easier to understand and maintain
- Changes in one layer don't affect others

### 2. **Testability**
- Controllers can be tested independently
- Mock data layer for unit tests
- Test routes without full server

### 3. **Reusability**
- Controllers can be reused across different routes
- Models handle all data operations
- Middleware applied to multiple routes

### 4. **Scalability**
- Easy to add new features
- Clear structure for team collaboration
- Consistent patterns across codebase

### 5. **Maintainability**
- Clear naming conventions
- Easy to locate specific functionality
- Reduced code duplication

## 🔍 Code Examples

### Route (Thin Layer)
```typescript
// auth.routes.ts
import * as authController from '../controllers/auth.controller';

router.post('/register', authController.register);
router.post('/login', authController.login);
```

### Controller (Business Logic)
```typescript
// auth.controller.ts
export const login = async (req, res) => {
  const { email, password } = req.body;
  // Validation
  // Database queries
  // Token generation
  // Response
};
```

### Model (Data Layer)
```typescript
// user.model.ts
const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});
UserSchema.methods.comparePassword = async function(password) { ... };
```

## 📝 Import Patterns

```typescript
// In server.ts
import authRoutes from './routes/auth.routes';
import connectDB from './config/database.config';

// In routes
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

// In controllers
import User from '../models/user.model';
import cloudinary from '../config/cloudinary.config';
```

## ✅ Migration Checklist

- [x] Created `controllers/` folder
- [x] Extracted business logic to controllers
- [x] Renamed route files to `*.routes.ts`
- [x] Renamed model files to `*.model.ts`
- [x] Renamed middleware files to `*.middleware.ts`
- [x] Renamed config files to `*.config.ts`
- [x] Updated imports in `server.ts`
- [x] Updated imports in routes
- [x] Removed old files
- [x] Tested application (both servers running)

## 🚀 Next Steps

1. **Restart Backend**: 
   ```bash
   cd backend
   npm run dev
   ```

2. **Verify**:
   - Backend should start without errors
   - All routes should work as before
   - Authentication should function properly

3. **Test All Features**:
   - User registration/login
   - Product CRUD operations
   - File uploads to Cloudinary
   - Admin-only routes

## 📚 Additional MVC Best Practices

### Controllers Should:
- ✅ Handle HTTP request/response
- ✅ Call model methods
- ✅ Return appropriate status codes
- ❌ NOT contain SQL/MongoDB queries directly
- ❌ NOT handle file system operations

### Models Should:
- ✅ Define schema/structure
- ✅ Validate data
- ✅ Handle database operations
- ✅ Contain business logic related to data
- ❌ NOT handle HTTP requests

### Routes Should:
- ✅ Map URLs to controllers
- ✅ Apply middleware
- ✅ Define HTTP methods
- ❌ NOT contain business logic
- ❌ NOT contain database queries

---

**Your backend is now following industry-standard MVC architecture!** 🎉
