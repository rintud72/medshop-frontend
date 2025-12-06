import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPrice, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Order, User, Medicine } from '@/types';
// ✅ FileText আইকন ইম্পোর্ট
import { FileText } from 'lucide-react';

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'COD':
        return 'bg-blue-500 text-white';
      case 'Processing':
        return 'bg-purple-500 text-white';
      case 'Shipped':
        return 'bg-orange-500 text-white';
      case 'Delivered':
        return 'bg-green-600 text-white';
      case 'Pending':
        return 'bg-yellow-500 text-white';
      case 'Cancelled':
      case 'Failed':
        return 'bg-destructive text-white';
      default:
        return 'bg-muted';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="heading-1">Manage Orders</h1>
        <div className="animate-pulse h-64 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="heading-1">Manage Orders</h1>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Medicine</TableHead>
              {/* ✅ Prescription Column Added */}
              <TableHead>Prescription</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
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
                      <p className="font-medium">{user ? user.name : 'Deleted User'}</p>
                      <p className="text-sm text-muted-foreground">{user ? user.email : 'N/A'}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>{medicine ? medicine.name : 'Deleted Medicine'}</TableCell>
                  
                  {/* ✅ Prescription View Link */}
                  <TableCell>
                    {order.prescription ? (
                      <a 
                        href={order.prescription} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
                      >
                        <FileText className="h-4 w-4" /> View
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-xs">None</span>
                    )}
                  </TableCell>

                  <TableCell>{formatPrice(order.priceAtOrder * order.quantity)}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value: string) => handleStatusChange(order._id, value)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="COD">COD</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}