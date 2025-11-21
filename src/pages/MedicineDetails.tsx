import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import { useMedicine } from '@/hooks/useMedicines';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';

export default function MedicineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { medicine, isLoading, error } = useMedicine(id!);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items');
      navigate('/login');
      return;
    }
    if (!medicine || medicine.stock === 0) return;

    setIsAdding(true);
    try {
      await addToCart(medicine._id, 1);
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading details...</div>;
  if (error || !medicine) return <div className="p-8 text-center text-red-500">Medicine not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="h-96 bg-slate-50 flex items-center justify-center p-8 border-r">
              {medicine.image ? (
                <img 
                  src={medicine.image} 
                  alt={medicine.name} 
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              ) : (
                <Package className="h-32 w-32 text-muted-foreground" />
              )}
            </div>

            {/* Details Section */}
            <div className="p-8 flex flex-col justify-center">
              <div className="mb-4">
                {medicine.category && (
                  <Badge variant="secondary" className="mb-2">
                    {medicine.category}
                  </Badge>
                )}
                <h1 className="heading-1 mb-2">{medicine.name}</h1>
                <p className="heading-2 text-primary mb-4">
                  {formatPrice(medicine.price)}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="body-text text-muted-foreground">
                    {medicine.description || 'No description available.'}
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                  <span className="font-medium">Availability</span>
                  {medicine.stock > 0 ? (
                    <span className="text-green-600 font-bold flex items-center gap-2">
                      In Stock ({medicine.stock})
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold">Out of Stock</span>
                  )}
                </div>

                <Button 
                  size="lg" 
                  className="w-full gap-2"
                  onClick={handleAddToCart}
                  disabled={isAdding || medicine.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {isAdding ? 'Adding...' : medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}