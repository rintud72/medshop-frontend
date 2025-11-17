// ফাইল: src/pages/Checkout.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'; // ✅ Dialog ইম্পোর্ট
import { Plus } from 'lucide-react'; // ✅ Plus আইকন ইম্পোর্ট
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Address } from '@/types'; 
import { AddressForm } from '@/components/AddressForm'; // ✅ নতুন ফর্ম ইম্পোর্ট

export default function Checkout() {
  const { cartItems, clearCart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false); // ✅ Dialog স্টেট

  // সেভ করা অ্যাড্রেস ফেচ করা
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get('/users/profile/addresses');
        setAddresses(response.data.addresses);
        if (response.data.addresses.length > 0) {
          setSelectedAddressId(response.data.addresses[0]._id);
        }
      } catch (error) {
        toast.error('Failed to fetch addresses');
      } finally {
        setIsAddressLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.priceAtOrder * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // ... (এই ফাংশনটি অপরিবর্তিত) ...
    e.preventDefault();

    if (!selectedAddressId) {
      toast.error('Please select a shipping address');
      return;
    }
    
    const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
    if (!selectedAddress) {
      toast.error('Invalid address selected');
      return;
    }

    setIsLoading(true);

    try {
      if (paymentMethod === 'COD') {
        await api.post('/cart/checkout', { address: selectedAddress }); 
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/orders');
      } else {
        // Online payment flow
        const { data } = await api.post('/payments/create-order');
        
        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: 'MedShop',
          description: 'Medicine Order',
          order_id: data.orderId,
          handler: async (response: any) => {
            try {
              await api.post('/payments/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                address: selectedAddress 
              });
              
              toast.success('Payment successful! Order placed.');
              clearCart();
              navigate('/orders');
            } catch (error) {
              toast.error('Payment verification failed');
              await refreshCart();
            }
          },
          prefill: {
            name: data.userName,
            email: data.userEmail
          },
          theme: {
            color: '#0ea5e9'
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  if (cartItems.length === 0) {
    return null; 
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="heading-1 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <Card>
              <CardHeader>
                {/* ✅ "Add New" বাটন যোগ করা হলো */}
                <div className="flex items-center justify-between">
                  <CardTitle>Shipping Address</CardTitle>
                  <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                      </DialogHeader>
                      <AddressForm onSave={(newAddress) => {
                        setAddresses([...addresses, newAddress]); // নতুন অ্যাড্রেস লিস্টে যোগ করা
                        setSelectedAddressId(newAddress._id); // নতুন অ্যাড্রেসটি সিলেক্ট করা
                        setIsAddressDialogOpen(false); // ডায়ালগ বন্ধ করা
                      }} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isAddressLoading ? (
                  <p>Loading addresses...</p>
                ) : addresses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Please add a new address to proceed.
                  </p>
                ) : (
                  <RadioGroup 
                    value={selectedAddressId || ''} 
                    onValueChange={setSelectedAddressId}
                  >
                    {addresses.map((addr) => (
                      <div key={addr._id} className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value={addr._id} id={addr._id} />
                        <Label htmlFor={addr._id} className="flex-1 cursor-pointer body-small">
                          <p className="font-medium">{addr.street}</p>
                          <p>{addr.city}, {addr.postalCode}</p>
                          <p>{addr.phone}</p>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ... (পেমেন্ট মেথড অপরিবর্তিত) ... */}
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'COD' | 'ONLINE')}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="COD" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div>
                        <p className="label-text">Cash on Delivery</p>
                        <p className="body-small text-muted-foreground">Pay when you receive</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="ONLINE" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      <div>
                        <p className="label-text">Online Payment</p>
                        <p className="body-small text-muted-foreground">Pay securely online</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isLoading || isAddressLoading || addresses.length === 0}>
              {isLoading ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
            </Button>
          </form>
        </div>

        <div>
          {/* ... (অর্ডার সামারি কার্ড অপরিবর্তিত) ... */}
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => {
                  const medicine = item.medicineId;
                  if (!medicine) {
                    return null;
                  }
                  return (
                    <div key={item._id} className="flex justify-between body-small">
                      <span>
                        {medicine.name} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.priceAtOrder * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between body-text">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between body-text">
                  <span>Delivery</span>
                  <span className="text-secondary">FREE</span>
                </div>
                <div className="flex justify-between heading-3 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}