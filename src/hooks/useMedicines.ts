import { useState, useEffect } from 'react';
import api from '@/lib/api';
import type { Medicine } from '@/types';

export function useMedicines(page = 1, search = '') {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get('/medicines', {
          params: { page, search }
        });
        setMedicines(response.data.medicines);
        setTotal(response.data.total);
      } catch (err) {
        setError('Failed to fetch medicines');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicines();
  }, [page, search]);

  return { medicines, total, isLoading, error };
}

export function useMedicine(id: string) {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get(`/medicines/${id}`);
        
        // ✅ Fix: 'response.data.medicine' er bodole 'response.data' hobe
        setMedicine(response.data); 
        
      } catch (err) {
        setError('Failed to fetch medicine details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMedicine();
    }
  }, [id]);

  return { medicine, isLoading, error };
}