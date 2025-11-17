import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartItem {
  _id: string;
  medicineId: {
    _id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
  quantity: number;
  priceAtOrder: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (medicineId: string, quantity: number) => Promise<void>;
  removeFromCart: (medicineId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const refreshCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get('/cart');
      setCartItems(response.data.cart.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addToCart = async (medicineId: string, quantity: number) => {
    try {
      await api.post('/cart/add', { medicineId, quantity });
      await refreshCart();
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (medicineId: string) => {
    try {
      await api.delete(`/cart/remove/${medicineId}`);
      await refreshCart();
    } catch (error) {
      throw error;
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, refreshCart, clearCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}