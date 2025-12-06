import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext'; // ✅ ইউজার ইনফোর জন্য
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // ✅ বাটন ইম্পোর্ট
import { Badge } from '@/components/ui/badge';
import { Package, Download } from 'lucide-react'; // ✅ Download আইকন
import { formatPrice, formatDate } from '@/lib/utils';
import type { Medicine } from '@/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Orders() {
  const { orders, isLoading } = useOrders();
  const { user } = useAuth(); // ✅ বর্তমান ইউজার

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

  // ✅ ইনভয়েস জেনারেট করার ফাংশন
  const handleDownloadInvoice = (order: any) => {
    const doc = new jsPDF();
    const medicine = order.medicineId;

    // --- Header ---
    doc.setFontSize(20);
    doc.text('MedShop', 14, 22);
    doc.setFontSize(10);
    doc.text('Your Trusted Online Pharmacy', 14, 28);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 34);

    // --- Invoice Info ---
    doc.setFontSize(12);
    doc.text(`Invoice #${order._id.slice(-6).toUpperCase()}`, 140, 22);
    doc.setFontSize(10);
    doc.text(`Order ID: ${order._id}`, 140, 28);
    doc.text(`Status: ${order.status}`, 140, 34);

    // --- Customer Details ---
    doc.line(14, 40, 196, 40); // Horizontal Line
    doc.text('Bill To:', 14, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(user?.name || 'Customer', 14, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(user?.email || '', 14, 60);
    
    if (order.address) {
      doc.text(`${order.address.street}, ${order.address.city}`, 14, 65);
      doc.text(`Phone: ${order.address.phone}`, 14, 70);
    }

    // --- Order Table ---
    autoTable(doc, {
      startY: 80,
      head: [['Item', 'Quantity', 'Price', 'Total']],
      body: [
        [
          medicine?.name || 'Medicine',
          order.quantity,
          `Rs. ${order.priceAtOrder}`,
          `Rs. ${order.priceAtOrder * order.quantity}`
        ]
      ],
      theme: 'grid',
      headStyles: { fillColor: [14, 165, 233] } // Primary Color
    });

    // --- Total Amount ---
    // @ts-ignore (autoTable creates finalY)
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Grand Total: Rs. ${order.priceAtOrder * order.quantity}`, 140, finalY);

    // --- Footer ---
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for shopping with MedShop!', 14, finalY + 20);
    doc.text('Contact: support@medshop.com', 14, finalY + 25);

    // Save PDF
    doc.save(`Invoice_${order._id}.pdf`);
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
          const medicine = order.medicineId as Medicine | null; 

          if (!medicine) {
            return null; 
          }

          return (
            <Card key={order._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="heading-3">{medicine.name}</CardTitle>
                    <p className="body-small text-muted-foreground mt-1">
                      Order placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
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
              
              {/* ✅ Invoice Download Button */}
              <CardFooter className="bg-slate-50 border-t flex justify-end p-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => handleDownloadInvoice(order)}
                >
                  <Download className="h-4 w-4" />
                  Download Invoice
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}