import { Link } from 'react-router-dom';
import { useMedicines } from '@/hooks/useMedicines';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Shield, Truck, HeadphonesIcon, Pill } from 'lucide-react';
import MedicineCard from '@/components/medicine/MedicineCard';
import { useAuth } from '@/contexts/AuthContext';
export default function Home() {
  const { medicines, isLoading } = useMedicines(1, '');
  const { user } = useAuth();
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="heading-1 mb-6">
              Your Health, <span className="text-primary">Our Priority</span>
            </h1>
            <p className="body-text text-muted-foreground mb-8 max-w-2xl">
              Get genuine medicines delivered to your doorstep. Fast, secure, and reliable pharmacy service you can trust.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/medicines">
                <Button size="lg" className="gap-2">
                  Browse Medicines <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              {!user && (
                <Link to="/register">
                  <Button size="lg" variant="outline">
                    Sign Up Now
                  </Button>
                </Link>
              )}
              
            </div>

            <div className="flex flex-wrap gap-6 mt-12">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="label-text">100% Genuine</p>
                  <p className="body-small text-muted-foreground">Verified Products</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="label-text">Fast Delivery</p>
                  <p className="body-small text-muted-foreground">Quick & Secure</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <HeadphonesIcon className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="label-text">24/7 Support</p>
                  <p className="body-small text-muted-foreground">Always Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </section>

      {/* Popular Medicines */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="heading-2 mb-2">Popular Medicines</h2>
              <p className="body-text text-muted-foreground">
                Trusted by thousands of customers
              </p>
            </div>
            <Link to="/medicines">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {medicines.slice(0, 4).map((medicine) => (
                <MedicineCard key={medicine._id} medicine={medicine} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-2">Why Choose MedShop?</h2>
            <p className="body-text text-muted-foreground">
              Your trusted partner in healthcare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="heading-3 mb-2">Verified Medicines</h3>
                <p className="body-small text-muted-foreground">
                  All our medicines are sourced from licensed manufacturers and verified for authenticity.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Truck className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="heading-3 mb-2">Fast Delivery</h3>
                <p className="body-small text-muted-foreground">
                  Quick and secure delivery to your doorstep. Track your order in real-time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Pill className="h-7 w-7 text-accent" />
                </div>
                <h3 className="heading-3 mb-2">Wide Selection</h3>
                <p className="body-small text-muted-foreground">
                  Extensive range of medicines and healthcare products for all your needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}