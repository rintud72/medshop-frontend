// ফাইল: src/pages/Profile.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Plus, Eye, EyeOff } from 'lucide-react'; // ✅ Eye এবং EyeOff ইম্পোর্ট করা হলো
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Address } from '@/types';
import { AddressForm } from '@/components/AddressForm'; 

export default function Profile() {
  const { user } = useAuth(); 
  
  // প্রোফাইল এডিটিং স্টেট
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // অ্যাড্রেস স্টেট
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  // পাসওয়ার্ড পরিবর্তনের স্টেট
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  // ✅ পাসওয়ার্ড দেখানোর স্টেট (Show/Hide)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // অ্যাড্রেস ফেচ করা
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get('/users/profile/addresses');
        setAddresses(response.data.addresses);
      } catch (error) {
        toast.error('Failed to fetch addresses');
      }
    };
    
    if(user) {
      fetchAddresses();
      setFormData({
        name: user.name,
        email: user.email
      });
    }
  }, [user]); 

  // প্রোফাইল সাবমিট
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.put('/users/profile', formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const updatedUser = { ...JSON.parse(storedUser), ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // অ্যাড্রেস ডিলিট
  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/users/profile/addresses/${addressId}`);
      setAddresses(addresses.filter(addr => addr._id !== addressId));
      toast.success('Address deleted');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    }
  };

  // পাসওয়ার্ড পরিবর্তন হ্যান্ডলার
  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsPasswordLoading(true);
    try {
      await api.put('/users/profile/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success("Password changed successfully");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // ফর্ম রিসেট
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsPasswordLoading(false);
    }
  };


  if (!user) return null; 

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="heading-1 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* কলাম ১: প্রোফাইল এবং পাসওয়ার্ড */}
        <div className="space-y-8">
          
          {/* কার্ড ১: পার্সোনাল ইনফরমেশন (অপরিবর্তিত) */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ name: user.name, email: user.email }); 
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="body-small text-muted-foreground mb-1">Full Name</p>
                    <p className="label-text">{formData.name}</p> 
                  </div>
                  <div>
                    <p className="body-small text-muted-foreground mb-1">Email</p>
                    <p className="label-text">{formData.email}</p>
                  </div>
                  <div>
                    <p className="body-small text-muted-foreground mb-1">Role</p>
                    <p className="label-text">{user.role}</p>
                  </div>
                  <div>
                    <p className="body-small text-muted-foreground mb-1">Account Status</p>
                    <p className="label-text">{user.isVerified ? 'Verified ✓' : 'Not Verified'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ✅ কার্ড ২: পাসওয়ার্ড পরিবর্তন (Show/Hide বাটন সহ) */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                
                {/* Current Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"} 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                {/* New Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"} 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                {/* Confirm New Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"} 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" disabled={isPasswordLoading}>
                  {isPasswordLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* কলাম ২: অ্যাড্রেস বুক (অপরিবর্তিত) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Address Book</CardTitle>
              <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                  </DialogHeader>
                  <AddressForm onSave={(newAddress) => {
                    setAddresses([...addresses, newAddress]);
                    setIsAddressDialogOpen(false);
                  }} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {addresses.length === 0 ? (
              <p className="text-muted-foreground">You have no saved addresses.</p>
            ) : (
              addresses.map((addr) => (
                <div key={addr._id} className="flex justify-between items-start p-4 border rounded-lg">
                  <div className="body-small">
                    <p className="font-medium">{addr.street}</p>
                    <p>{addr.city}, {addr.postalCode}</p>
                    <p>{addr.phone}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr._id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}