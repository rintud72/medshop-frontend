import { useState, useEffect } from 'react';
import { Star, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import type { Review } from '@/types';

interface ReviewsProps {
  medicineId: string;
}

export default function Reviews({ medicineId }: ReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // রিভিউ ফেচ করা
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews/${medicineId}`);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Failed to fetch reviews');
      }
    };
    fetchReviews();
  }, [medicineId]);

  // রিভিউ সাবমিট করা
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/reviews', {
        medicineId,
        rating,
        comment
      });
      
      setReviews([response.data.review, ...reviews]);
      setComment('');
      setRating(0);
      toast.success('Review submitted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="heading-2 mb-6">Customer Reviews ({reviews.length})</h2>

      {/* Review Form */}
      {user ? (
        <div className="bg-slate-50 p-6 rounded-lg mb-8 border">
          <h3 className="label-text mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <Textarea
              placeholder="Share your experience with this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </div>
      ) : (
        <div className="bg-slate-50 p-6 rounded-lg mb-8 border text-center">
          <p className="text-muted-foreground mb-2">Please login to write a review.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b pb-6 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{review.userId.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="body-text text-slate-600">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}