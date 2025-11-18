export interface Address {
  _id: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface Medicine {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
  addresses: Address[];
}

export interface Order {
  _id: string;
  userId: User | string;
  medicineId: Medicine | string;
  quantity: number;
  priceAtOrder: number;
  paymentMethod: 'COD' | 'ONLINE';
  
  // ✅ আলাদা ফিল্ড
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
          
  paymentId?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalMedicines: number;
  totalStock: number;
  lowStockMedicines: Array<{
    _id: string;
    name: string;
    stock: number;
  }>;
}