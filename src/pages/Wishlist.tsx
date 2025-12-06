// ফাইল: src/pages/Wishlist.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import MedicineCard from '@/components/medicine/MedicineCard';
import { Loader2 } from 'lucide-react';
import type { Medicine } from '@/types';

export default function Wishlist() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get('/users/wishlist');
        setMedicines(response.data.wishlist);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchWishlist();
  }, [user]);

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="heading-1 mb-6">My Wishlist</h1>
      {medicines.length === 0 ? (
        <p className="text-muted-foreground">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {medicines.map((medicine) => (
            <MedicineCard key={medicine._id} medicine={medicine} />
          ))}
        </div>
      )}
    </div>
  );
}