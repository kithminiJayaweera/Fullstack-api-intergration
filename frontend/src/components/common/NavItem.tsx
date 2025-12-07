// import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '@/constants/routes.constant';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="mb-8 mt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">API Data Table</h1>

        <nav className="flex gap-2 border-b border-gray-200 pb-4">
          {APP_ROUTES.map((r: (typeof APP_ROUTES)[number]) => {
            const Icon = r.icon;
            const active = location.pathname === r.path;
            return (
              <Button
                key={r.path}
                asChild
                variant={active ? 'default' : 'ghost'}
                className="gap-2"
              >
                <Link to={r.path}>
                  <Icon className="h-4 w-4" />
                  {r.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}