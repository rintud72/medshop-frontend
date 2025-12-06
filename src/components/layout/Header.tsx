import { Link, useNavigate } from 'react-router-dom';
// ✅ Heart icon import kora holo
import { ShoppingCart, User, LogOut, LayoutDashboard, Package, Heart } from 'lucide-react';
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
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">M+</span>
          </div>
          <span className="heading-3 text-primary">MedShop</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="label-text text-foreground hover:text-primary transition-colors">
            Home
          </Link>

          <Link to="/medicines" className="label-text text-foreground hover:text-primary transition-colors">
            Medicines
          </Link>
        </nav>

        <div className="flex items-center gap-4">

          {user && (
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">

                <div className="px-2 py-1.5">
                  <p className="label-text">{user.name}</p>
                  <p className="body-small text-muted-foreground">{user.email}</p>
                </div>

                <DropdownMenuSeparator />

                {user.role === 'ADMIN' && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuItem onClick={() => navigate('/orders')}>
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </DropdownMenuItem>

                {/* ✅ Wishlist Link Added Here */}
                <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
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