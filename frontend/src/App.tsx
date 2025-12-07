import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import DashboardPage from './features/dashboard/DashboardPage';
import NewlyAddedUsersTable from './features/users/pages/NewlyAddedUsersTable';
import ProductsTable from './features/products/pages/ProductsTable';
import MongoProductsPage from './features/products/pages/MongoProductsPage';
import ProfilePage from './features/users/pages/ProfilePage';
import InquiryPage from './features/inquiry/pages/InquiryPage';
import Sidebar from '@/components/common/Sidebar';
import Navbar from '@/components/common/Navbar';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />

                {/* Main Content Area */}
                <div className="ml-64 flex-1 flex flex-col">
                  {/* Top Navigation Bar */}
                  <Navbar />

                  {/* Page Content */}
                  <main className="flex-1 p-8">
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/products" element={<ProductsTable />} />
                      <Route path="/mongo-products" element={<MongoProductsPage />} />
                      <Route path="/users" element={<NewlyAddedUsersTable />} />
                      <Route path="/inquiry" element={<InquiryPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;