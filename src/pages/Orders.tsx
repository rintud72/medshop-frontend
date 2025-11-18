import { useOrders } from '@/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Medicine } from '@/types';

export default function Orders() {
  const { orders, isLoading } = useOrders();

  // 🚚 ডেলিভারি স্ট্যাটাস কালার
  const getOrderColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-blue-500 text-white';
      case 'Shipped': return 'bg-orange-500 text-white';
      case 'Delivered': return 'bg-green-600 text-white';
      case 'Cancelled': return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // 💳 পেমেন্ট স্ট্যাটাস কালার
  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-500 text-white';
      case 'Pending': return 'bg-yellow-500 text-white';
      case 'Failed': return 'bg-red-500 text-white';
      default: return 'bg-muted';
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  if (orders.length === 0) {
    return <div className="p-8 text-center">No orders found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="heading-1 mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const medicine = order.medicineId as Medicine | null;
          if (!medicine) return null;

          return (
            <Card key={order._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="heading-3">{medicine.name}</CardTitle>
                    <p className="body-small text-muted-foreground mt-1">
                      Ordered on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  
                  {/* ✅ দুটি আলাদা ব্যাজ */}
                  <div className="flex flex-col gap-2 items-end">
                    <Badge className={getOrderColor(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
                    <Badge variant="outline" className={getPaymentColor(order.paymentStatus)}>
                      Payment: {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="body-small text-muted-foreground mb-1">Quantity</p>
                    <p className="label-text">{order.quantity} units</p>
                  </div>
                  <div>
                    <p className="body-small text-muted-foreground mb-1">Total</p>
                    <p className="heading-3 text-primary">{formatPrice(order.priceAtOrder * order.quantity)}</p>
                  </div>
                  <div>
                    <p className="body-small text-muted-foreground mb-1">Payment Method</p>
                    <p className="label-text">{order.paymentMethod}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}