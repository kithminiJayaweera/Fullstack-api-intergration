import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ChevronRight, UserCircle, Package2Icon, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    path: '/products',
    icon: Package,
  },
  {
    title: 'User Added Products',
    path: '/mongo-products',
    icon: Package2Icon,
  },
  {
    title: 'Users',
    path: '/users',
    icon: Users,
  },
  {
    title: 'Inquiry',
    path: '/inquiry',
    icon: Mail,
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: UserCircle,
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white shadow-sm">
      <div className="flex h-full flex-col">
        {/* Logo / Brand */}
        <div className="flex h-16 items-center border-b px-6">
          <LayoutDashboard className="h-6 w-6 text-blue-600" />
          <span className="ml-3 text-xl font-bold text-gray-900">Navigation</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1">{item.title}</span>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="text-xs text-gray-500">
            © 2025 API INTEGRATION
          </div>
        </div>
      </div>
    </aside>
  );
}
