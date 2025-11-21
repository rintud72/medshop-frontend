import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ✅ Eye icon import kora holo
import { ShoppingCart, Package, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import type { Medicine } from '@/types';

interface MedicineCardProps {
  medicine: Medicine;
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (medicine.stock === 0) {
      toast.error('This medicine is out of stock');
      return;
    }

    setIsAdding(true);

    try {
      await addToCart(medicine._id, 1);
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  // ✅ View Details Handler
  const handleViewDetails = () => {
    navigate(`/medicines/${medicine._id}`);
  };

  const imageUrl = medicine.image?.startsWith('http')
    ? medicine.image
    : `${medicine.image}`;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <CardContent className="p-4 flex-1 cursor-pointer" onClick={handleViewDetails}>
        
        <div className="aspect-square rounded-lg bg-slate-100 mb-4 overflow-hidden relative">
          {medicine.image ? (
            <img
              src={imageUrl}
              alt={medicine.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/300x300?text=Medicine';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
          )}

          {medicine.stock === 0 && (
            <Badge className="absolute top-2 right-2 bg-destructive">
              Out of Stock
            </Badge>
          )}

          {medicine.stock > 0 && medicine.stock < 10 && (
            <Badge className="absolute top-2 right-2 bg-accent">
              Low Stock
            </Badge>
          )}
        </div>

        {medicine.category && (
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs font-normal">
              {medicine.category}
            </Badge>
          </div>
        )}

        <h3 className="label-text mb-1 line-clamp-2 group-hover:text-primary transition-colors">{medicine.name}</h3>
        <p className="body-small text-muted-foreground mb-2 line-clamp-2">
          {medicine.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="heading-3 text-primary">
            {formatPrice(medicine.price)}
          </span>
          <span className="body-small text-muted-foreground">
            Stock: {medicine.stock}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        
        {/* ✅ View Button Added */}
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleViewDetails}
          title="View Details"
          className="shrink-0"
        >
          <Eye className="h-4 w-4" />
        </Button>

        <Button
          className="flex-1 gap-2"
          onClick={handleAddToCart}
          disabled={isAdding || medicine.stock === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}