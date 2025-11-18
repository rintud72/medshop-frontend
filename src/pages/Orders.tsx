import { useOrders } from '@/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Medicine } from '@/types';

export default function Orders() {
  const { orders, isLoading } = useOrders();

  // ✅ সমাধান: ব্যাজের রঙ অ্যাডমিন প্যানেলের সাথে মিলিয়ে আপডেট করা হলো
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'COD':
        return 'bg-blue-500 text-white'; // অর্ডার কনফার্মড
      case 'Processing':
        return 'bg-purple-500 text-white'; // প্রসেসিং
      case 'Shipped':
        return 'bg-orange-500 text-white'; // পাঠানো হয়েছে
      case 'Delivered':
        return 'bg-green-600 text-white'; // ডেলিভারি সম্পন্ন
      case 'Pending':
        return 'bg-yellow-500 text-white'; // পেমেন্ট পেন্ডিং
      case 'Cancelled':
      case 'Failed':
        return 'bg-destructive text-white'; // বাতিল বা ফেইলড
      default:
        return 'bg-muted';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="heading-2 mb-2">No orders yet</h2>
          <p className="body-text text-muted-foreground">
            Your order history will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="heading-1 mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          // ✅ medicine ভেরিয়েবল এখন null হতে পারে
          const medicine = order.medicineId as Medicine | null; 

          // ✅ (সমাধান) যদি মেডিসিন null হয় (ডিলিট হয়ে গিয়ে থাকলে), এই অর্ডারটি বাদ দাও
          if (!medicine) {
            return null; 
          }

          return (
            <Card key={order._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    {/* ✅ এখন এটি নিরাপদ */}
                    <CardTitle className="heading-3">{medicine.name}</CardTitle>
                    <p className="body-small text-muted-foreground mt-1">
                      Order placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  {/* ✅ নতুন রঙের ফাংশন এখানে কাজ করবে */}
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="body-small text-muted-foreground mb-1">Quantity</p>
                    <p className="label-text">{order.quantity} units</p>
                  </div>
                  <div>
                    <p className="body-small text-muted-foreground mb-1">Total Amount</p>
                    <p className="heading-3 text-primary">
                      {formatPrice(order.priceAtOrder * order.quantity)}
                    </p>
                  </div>
                  <div>
                    <p className="body-small text-muted-foreground mb-1">Payment Method</p>
                    <p className="label-text">{order.paymentMethod}</p>
                  </div>
                  {order.address && (
                    <div>
                      <p className="body-small text-muted-foreground mb-1">Delivery Address</p>
                      <p className="body-small">
                        {order.address.street}, {order.address.city}, {order.address.postalCode}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}