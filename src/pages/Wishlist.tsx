import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import MedicineCard from '@/components/medicine/MedicineCard';
import { Loader2, Heart } from 'lucide-react';
import type { Medicine } from '@/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get('/users/wishlist');
        setMedicines(response.data.wishlist || []);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchWishlist();
  }, [user]);

  // ✅ ফিল্টার: এপিআই থেকে আনা মেডিসিনগুলোর মধ্যে যেগুলো বর্তমান ইউজারের wishlist-এ আছে শুধু সেগুলোই দেখাবে।
  // এর ফলে, হার্টে ক্লিক করে রিমুভ করলে সাথে সাথে পেজ থেকে আইটেমটি চলে যাবে।
  const displayedMedicines = medicines.filter(medicine => 
    user?.wishlist?.includes(medicine._id)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (displayedMedicines.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="heading-2 mb-2">Your wishlist is empty</h2>
          <p className="body-text text-muted-foreground mb-6">
            Save items you want to view later by clicking the heart icon on medicine cards.
          </p>
          <Button onClick={() => navigate('/medicines')}>
            Browse Medicines
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="heading-1 mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedMedicines.map((medicine) => (
          <MedicineCard key={medicine._id} medicine={medicine} />
        ))}
      </div>
    </div>
  );
}