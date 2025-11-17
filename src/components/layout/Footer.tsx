import { Link } from 'react-router-dom';
import { Shield, Truck, HeadphonesIcon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t mt-20">
      <div className="container mx-auto px-4 py-12">

        {/* ------------------------------------------------------------
            🏛️ Footer Main Grid Section
            Contains: Brand Info, Quick Links, Support, Choose Us
           ------------------------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* ------------------------------------------------------------
              🧪 Brand / About Section
              Shows logo + short description
             ------------------------------------------------------------ */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">M+</span>
              </div>
              <span className="heading-3 text-primary">MedShop</span>
            </div>

            <p className="body-small text-muted-foreground">
              Your trusted online pharmacy for quality medicines and healthcare products.
            </p>
          </div>

          {/* ------------------------------------------------------------
              📎 Quick Navigation Links
              Helps users jump to important pages quickly
             ------------------------------------------------------------ */}
          <div>
            <h3 className="label-text mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="body-small text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/medicines"
                  className="body-small text-muted-foreground hover:text-primary transition-colors"
                >
                  Medicines
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="body-small text-muted-foreground hover:text-primary transition-colors"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* ------------------------------------------------------------
              🛟 Support Section
              Static informational elements
             ------------------------------------------------------------ */}
          <div>
            <h3 className="label-text mb-4">Support</h3>
            <ul className="space-y-2">
              <li className="body-small text-muted-foreground">Contact Us</li>
              <li className="body-small text-muted-foreground">FAQs</li>
              <li className="body-small text-muted-foreground">Privacy Policy</li>
            </ul>
          </div>

          {/* ------------------------------------------------------------
              🛡 Why Choose Us
              Highlights service benefits using icons
             ------------------------------------------------------------ */}
          <div>
            <h3 className="label-text mb-4">Why Choose Us</h3>

            <div className="space-y-3">
              {/* Genuine Products */}
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-secondary mt-0.5" />
                <div>
                  <p className="body-small font-medium">100% Genuine</p>
                  <p className="body-small text-muted-foreground text-xs">Verified medicines</p>
                </div>
              </div>

              {/* Fast Delivery */}
              <div className="flex items-start gap-2">
                <Truck className="h-5 w-5 text-secondary mt-0.5" />
                <div>
                  <p className="body-small font-medium">Fast Delivery</p>
                  <p className="body-small text-muted-foreground text-xs">Quick & secure</p>
                </div>
              </div>

              {/* 24/7 Support */}
              <div className="flex items-start gap-2">
                <HeadphonesIcon className="h-5 w-5 text-secondary mt-0.5" />
                <div>
                  <p className="body-small font-medium">24/7 Support</p>
                  <p className="body-small text-muted-foreground text-xs">Always here to help</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------
            📌 Footer Bottom Bar (Copyright)
           ------------------------------------------------------------ */}
        <div className="border-t mt-8 pt-8 text-center">
          <p className="body-small text-muted-foreground">
            © {new Date().getFullYear()} MedShop. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
