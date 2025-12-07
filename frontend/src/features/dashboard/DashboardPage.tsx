/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { Package, Users, TrendingUp, DollarSign } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import PriceDistributionChart from '@/components/dashboard/PriceDistributionChart';
import DashboardSkeleton from '@/components/shared/DashboardSkeleton';
import { useProducts } from '@/features/products/hooks/useProductQueries';
import { useMongoUsers } from '@/features/users/hooks/useMongoUsers';

export default function DashboardPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: paginatedData } = useMongoUsers(1, 10);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalUsers = paginatedData?.pagination?.total || 0; // Get total count from pagination
    const totalRevenue = products.reduce((sum: number, p: any) => sum + p.price * p.stock, 0);
    const averageRating = products.length > 0
      ? products.reduce((sum: number, p: any) => sum + p.rating, 0) / products.length
      : 0;

    return {
      totalProducts,
      totalUsers,
      totalRevenue,
      activeRate: averageRating,
    };
  }, [products, paginatedData?.pagination?.total]);

  // Calculate price distribution
  const priceDistribution = useMemo(() => {
    const ranges = [
      { name: '$0-50', min: 0, max: 50, value: 0, count: 0 },
      { name: '$51-100', min: 51, max: 100, value: 0, count: 0 },
      { name: '$101-500', min: 101, max: 500, value: 0, count: 0 },
      { name: '$501-1000', min: 501, max: 1000, value: 0, count: 0 },
      { name: '$1000+', min: 1001, max: Infinity, value: 0, count: 0 },
    ];

    products.forEach((product: any) => {
      const range = ranges.find((r) => product.price >= r.min && product.price <= r.max);
      if (range) {
        range.value += product.price;
        range.count += 1;
      }
    });

    return ranges.filter((r) => r.count > 0);
  }, [products]);

  // Show loading skeleton while fetching products
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of your products and users
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Average Rating"
          value={stats.activeRate.toFixed(1)}
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PriceDistributionChart data={priceDistribution} />
        
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{stats.totalProducts}</span> products available
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{stats.totalUsers}</span> users in the system
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <p className="text-sm text-gray-600">
                Average product rating: <span className="font-medium">{stats.activeRate.toFixed(2)}/5</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
