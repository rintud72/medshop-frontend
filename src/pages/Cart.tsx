import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function Cart() {
  const { cartItems, removeFromCart, addToCart, isLoading } = useCart(); 
  const navigate = useNavigate();
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const total = cartItems.reduce(
    (sum, item) => sum + item.priceAtOrder * item.quantity,
    0
  );

  const handleRemove = async (medicineId: string) => {
    setLoadingItemId(medicineId);
    try {
      await removeFromCart(medicineId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleIncrease = async (item: typeof cartItems[0]) => {
    if (item.quantity >= item.medicineId.stock) {
      toast.error(`Only ${item.medicineId.stock} units available`);
      return;
    }
    setLoadingItemId(item._id);
    try {
      await addToCart(item.medicineId._id, 1); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleDecrease = async (item: typeof cartItems[0]) => {
    setLoadingItemId(item._id);
    try {
      if (item.quantity > 1) {
        await addToCart(item.medicineId._id, -1); 
      } else {
        await removeFromCart(item.medicineId._id);
        toast.success('Item removed from cart');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    } finally {
      setLoadingItemId(null);
    }
  };


  if (isLoading && cartItems.length === 0) { 
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="heading-2 mb-2">Your cart is empty</h2>
          <p className="body-text text-muted-foreground mb-6">
            Add some medicines to get started
          </p>
          <Button onClick={() => navigate('/medicines')}>Browse Medicines</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="heading-1 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            
            const medicine = item.medicineId;
            if (!medicine) return null; 

            const isItemLoading = loadingItemId === item._id;

            return (
              <Card key={item._id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                      {medicine.image ? (
                        <img
                          src={medicine.image}
                          alt={medicine.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            // ✅ সমাধান: URL পরিবর্তন করা হলো
                            target.src = 'https://placehold.co/96x96?text=Medicine';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="label-text mb-1">{medicine.name}</h3>
                      <p className="body-small text-muted-foreground mb-2">
                        {formatPrice(item.priceAtOrder)}
                      </p>
                      <p className="heading-3 text-primary">
                        {formatPrice(item.priceAtOrder * item.quantity)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(medicine._id)}
                        disabled={isItemLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center gap-2 border rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDecrease(item)}
                          disabled={isItemLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center label-text">
                          {isItemLoading ? '...' : item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleIncrease(item)}
                          disabled={isItemLoading || item.quantity >= medicine.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div>
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <h3 className="heading-3 mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between body-text">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between body-text">
                  <span>Delivery</span>
                  <span className="text-secondary">FREE</span>
                </div>
                <div className="border-t pt-2 flex justify-between heading-3">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}