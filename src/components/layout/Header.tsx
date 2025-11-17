import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const { user, logout } = useAuth();       // 🔐 Auth context → access user info & logout function
  const { cartCount } = useCart();          // 🛒 Cart context → real-time cart item count
  const navigate = useNavigate();           // 🔀 Router navigation helper

  // ------------------------------------------------------------
  // 🔓 Logout handler
  // Logs the user out using context → redirects to home page
  // ------------------------------------------------------------
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* ------------------------------------------------------------
            🏥 Brand Logo + Home Link
            Clicking the logo always returns to home page
           ------------------------------------------------------------ */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">M+</span>
          </div>
          <span className="heading-3 text-primary">MedShop</span>
        </Link>

        {/* ------------------------------------------------------------
            🧭 Primary Navigation (Visible only on Desktop)
            Minimal links for clean UI on desktop devices
           ------------------------------------------------------------ */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="label-text text-foreground hover:text-primary transition-colors">
            Home
          </Link>

          <Link to="/medicines" className="label-text text-foreground hover:text-primary transition-colors">
            Medicines
          </Link>
        </nav>

        {/* ------------------------------------------------------------
            🔧 Right Side Controls
            - Cart Icon (Only when logged in)
            - User Menu (Profile, Orders, Logout)
            - Login / Register buttons (When not logged in)
           ------------------------------------------------------------ */}
        <div className="flex items-center gap-4">

          {/* ------------------------------------------------------------
              🛒 Cart Button (Only visible for logged-in users)
              Shows badge for total cart items
             ------------------------------------------------------------ */}
          {user && (
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />

                {/* 🟣 Cart Count Badge */}
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {/* ------------------------------------------------------------
              👤 User Dropdown (When logged in)
              Shows:
              - User info
              - Admin dashboard (only for admin)
              - Orders, Profile
              - Logout
             ------------------------------------------------------------ */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">

                {/* User Mini Profile in Menu */}
                <div className="px-2 py-1.5">
                  <p className="label-text">{user.name}</p>
                  <p className="body-small text-muted-foreground">{user.email}</p>
                </div>

                <DropdownMenuSeparator />

                {/* ------------------------------------------------------------
                    🛠 Admin Panel Access (Visible only to Admin users)
                   ------------------------------------------------------------ */}
                {user.role === 'ADMIN' && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                {/* ------------------------------------------------------------
                    📦 User Shortcuts
                   ------------------------------------------------------------ */}
                <DropdownMenuItem onClick={() => navigate('/orders')}>
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* ------------------------------------------------------------
                    🚪 Logout Button
                   ------------------------------------------------------------ */}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* ------------------------------------------------------------
                🔓 When User is NOT Logged In
                Show Login + Signup buttons
               ------------------------------------------------------------ */
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>Sign Up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
