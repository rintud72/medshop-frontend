import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatPrice, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Order, User, Medicine } from '@/types';

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getOrderColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-blue-500';
      case 'Shipped': return 'bg-orange-500';
      case 'Delivered': return 'bg-green-600';
      case 'Cancelled': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="heading-1">Manage Orders</h1>
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Medicine</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Pay Status</TableHead> {/* ✅ */}
              <TableHead>Order Status</TableHead> {/* ✅ */}
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const user = order.userId as User | null;
              const medicine = order.medicineId as Medicine | null;
              
              return (
                <TableRow key={order._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user ? user.name : 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">{user ? user.email : ''}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>{medicine ? medicine.name : 'N/A'}</TableCell>
                  <TableCell>{formatPrice(order.priceAtOrder * order.quantity)}</TableCell>
                  
                  {/* ✅ পেমেন্ট স্ট্যাটাস (Read-only) */}
                  <TableCell>
                    <Badge variant={order.paymentStatus === 'Paid' ? 'default' : 'secondary'}>
                      {order.paymentStatus}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">{order.paymentMethod}</div>
                  </TableCell>

                  {/* ✅ অর্ডার স্ট্যাটাস (Changeable) */}
                  <TableCell>
                    <Select
                      value={order.orderStatus}
                      onValueChange={(val) => handleStatusChange(order._id, val)}
                    >
                      <SelectTrigger className={`w-32 text-white ${getOrderColor(order.orderStatus)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}