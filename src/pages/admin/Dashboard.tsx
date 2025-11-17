import { useState, useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import type { DashboardStats } from '@/types';

export default function Dashboard() {
  // Stores dashboard stats fetched from backend
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Tracks loading state while fetching dashboard data
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch Dashboard Stats
   * - Runs on initial render only (empty dependency array)
   * - Retrieves users, orders, revenue, stock, low stock medicines etc.
   */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  /**
   * Loading Skeleton UI
   * - Shows placeholders while data is being fetched
   */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="heading-1">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // If stats failed to load (unexpected), return nothing
  if (!stats) return null;

  /**
   * Dashboard Stats Cards
   * - Each card displays a key metric and icon
   * - Allows clean reuse of UI structure
   */
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Stock',
      value: stats.totalStock,
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="heading-1">Dashboard</h1>

      {/* ======= Stats Cards ======= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* Metric Title & Value */}
                <div>
                  <p className="body-small text-muted-foreground mb-1">{stat.title}</p>
                  <p className="heading-2">{stat.value}</p>
                </div>

                {/* Metric Icon */}
                <div
                  className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ======= Low Stock Alert Section ======= */}
      {stats.lowStockMedicines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.lowStockMedicines.map((medicine) => (
                <div
                  key={medicine._id}
                  className="flex items-center justify-between p-3 bg-accent/5 rounded-lg"
                >
                  {/* Medicine Name */}
                  <span className="label-text">{medicine.name}</span>

                  {/* Remaining Stock */}
                  <span className="body-small text-accent font-medium">
                    Only {medicine.stock} left
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
