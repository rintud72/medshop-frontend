import { useState, useEffect } from 'react';
import api from '@/lib/api';
import type { Order } from '@/types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/orders/my');
      setOrders(response.data.orders);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, isLoading, error, refetch: fetchOrders };
}