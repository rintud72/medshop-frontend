import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// ------------------------------------------------------------
// 📌 Navigation Items Configuration
// Each object defines a sidebar link with icon + label
// ------------------------------------------------------------
const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/medicines', icon: Package, label: 'Medicines' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/users', icon: Users, label: 'Users' },
];

export default function AdminLayout() {
  const location = useLocation(); // Used to highlight the current active page

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">

        {/* ------------------------------------------------------------
            🧭 Admin Sidebar Navigation (Fixed Left Panel)
           ------------------------------------------------------------ */}
        <aside className="w-64 min-h-screen bg-white border-r fixed">
          <div className="p-6">

            {/* Admin Branding / Header */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">M+</span>
              </div>
              <div>
                <h2 className="heading-3 text-primary">MedShop</h2>
                <p className="body-small text-muted-foreground">Admin Panel</p>
              </div>
            </div>

            {/* ------------------------------------------
                📌 Sidebar Navigation Links
               ------------------------------------------ */}
            <nav className="space-y-2">

              {/* Back to store (non-admin homepage) */}
              <Link to="/">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Store
                </Button>
              </Link>

              {/* Dynamic admin routes */}
              {navItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button
                    // Highlight button when route is active
                    variant={location.pathname === item.to ? 'default' : 'ghost'}
                    className={cn(
                      'w-full justify-start',
                      location.pathname === item.to && 'bg-primary text-white'
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* ------------------------------------------------------------
            📄 Main Content Area
            Uses <Outlet /> to load child admin pages dynamically
           ------------------------------------------------------------ */}
        <main className="flex-1 ml-64 p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
