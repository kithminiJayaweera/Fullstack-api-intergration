import { Database, UserPlus, Mail, type LucideIcon } from 'lucide-react';

export const APP_ROUTES: { path: string; label: string; icon: LucideIcon }[] = [
  { path: '/', label: 'API Users', icon: Database },
  { path: '/newly-added', label: 'Newly Added Users', icon: UserPlus },
];

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  USERS: '/users',
  MONGO_PRODUCTS: '/mongo-products',
  PRODUCTS: '/products',
  PROFILE: '/profile',
  INQUIRY: '/inquiry',
  LOGIN: '/login',
  SIGNUP: '/signup',
} as const;