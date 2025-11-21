import { useState, useEffect } from 'react';
// ✅ Eye icon import kora holo
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Medicine } from '@/types';

export default function ManageMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit/Add States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', category: '', image: null as File | null
  });

  // ✅ View Details States
  const [viewingMedicine, setViewingMedicine] = useState<Medicine | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const fetchMedicines = async () => {
    try {
      const response = await api.get('/medicines?page=1&limit=100');
      setMedicines(response.data.medicines);
    } catch (error) {
      toast.error('Failed to fetch medicines');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('category', formData.category);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      if (editingMedicine) {
        await api.put(`/medicines/${editingMedicine._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Medicine updated successfully');
      } else {
        await api.post('/medicines', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Medicine added successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchMedicines();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;

    try {
      await api.delete(`/medicines/${id}`);
      toast.success('Medicine deleted successfully');
      fetchMedicines();
    } catch (error) {
      toast.error('Failed to delete medicine');
    }
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      description: medicine.description,
      price: medicine.price.toString(),
      stock: medicine.stock.toString(),
      category: medicine.category,
      image: null
    });
    setIsDialogOpen(true);
  };

  // ✅ View Handler
  const handleView = (medicine: Medicine) => {
    setViewingMedicine(medicine);
    setIsViewOpen(true);
  };

  const resetForm = () => {
    setEditingMedicine(null);
    setFormData({
      name: '', description: '', price: '', stock: '', category: '', image: null
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="heading-1">Manage Medicines</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open: boolean) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medicine Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })} />
              </div>
              <Button type="submit" className="w-full">
                {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* ✅ View Details Dialog Added */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Medicine Details</DialogTitle>
            </DialogHeader>
            {viewingMedicine && (
              <div className="space-y-4">
                <div className="aspect-video bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden border">
                  {viewingMedicine.image ? (
                    <img src={viewingMedicine.image} alt={viewingMedicine.name} className="h-full object-contain" />
                  ) : (
                    <span className="text-muted-foreground">No Image</span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{viewingMedicine.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{viewingMedicine.category}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Price</p><p className="font-semibold">{formatPrice(viewingMedicine.price)}</p></div>
                  <div><p className="text-muted-foreground">Stock</p><p className="font-semibold">{viewingMedicine.stock} units</p></div>
                </div>
                <div><p className="text-muted-foreground mb-1">Description</p><p className="text-sm bg-muted p-3 rounded-md">{viewingMedicine.description}</p></div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow key={medicine._id}>
                  <TableCell className="font-medium">{medicine.name}</TableCell>
                  <TableCell>{medicine.category}</TableCell>
                  <TableCell>{formatPrice(medicine.price)}</TableCell>
                  <TableCell>{medicine.stock}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      
                      {/* ✅ View Button Added */}
                      <Button variant="ghost" size="icon" onClick={() => handleView(medicine)}>
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>

                      <Button variant="ghost" size="icon" onClick={() => handleEdit(medicine)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(medicine._id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}