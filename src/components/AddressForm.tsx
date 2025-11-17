// ফাইল: src/components/AddressForm.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Address } from '@/types';

interface AddressFormProps {
  // ফর্ম সেভ হওয়ার পর এই ফাংশনটি কল হবে
  onSave: (newAddress: Address) => void;
}

export function AddressForm({ onSave }: AddressFormProps) {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // ব্যাকএন্ডে নতুন অ্যাড্রেস পোস্ট করা
      const response = await api.post('/users/profile/addresses', formData);
      
      // ব্যাকএন্ড থেকে আসা সম্পূর্ণ অ্যাড্রেস অ্যারে
      const allAddresses: Address[] = response.data.addresses;
      
      // নতুন অ্যাড্রেসটি (যা অ্যারের শেষে থাকবে) খুঁজে বের করা
      const newAddress = allAddresses[allAddresses.length - 1];

      toast.success('Address added successfully');
      onSave(newAddress); // নতুন অ্যাড্রেসটি (ID সহ) প্যারেন্ট কম্পোনেন্টকে পাঠানো

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="street">Street Address</Label>
        <Input id="street" value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input id="postalCode" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Address'}
      </Button>
    </form>
  );
}