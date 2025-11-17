import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react'; 

export default function Register() {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // রিসেন্ড বাটনের লোডিং এর জন্য
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // লগইন পেজ থেকে রিডাইরেক্ট হয়ে আসলে
    if (location.state?.email) {
      setEmail(location.state.email);
      setStep('verify');
    }
  }, [location.state]);


  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(name, email, password);
      toast.success('OTP sent to your email!');
      setStep('verify');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await verifyOtp(email, otp);
      toast.success('Account verified! Please login to continue.'); 
      navigate('/login'); 
    } catch (error: any) { // ✅✅✅ এই ব্র্যাকেটটি এখানে ঠিক করা আছে
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally { // ✅✅✅
      setIsLoading(false);
    }
  };

  // ✅ নতুন ফাংশন: OTP রিসেন্ড করার জন্য
  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      // ব্যাকএন্ড এখন ঠিক, তাই register ফাংশন কল করলেই নতুন OTP আসবে
      await register(name, email, password);
      toast.success('New OTP sent to your email!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };


  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="heading-2">
            {step === 'register' ? 'Create an account' : 'Verify your email'}
          </CardTitle>
          <CardDescription className="body-small">
            {step === 'register'
              ? 'Enter your details to create your account'
              : `Enter the OTP sent to ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* রেজিস্ট্রেশন ফর্ম ... */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword((prev) => !prev)} 
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          ) : (
            // ✅ ভেরিফাই ফর্ম
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              {/* ✅ বাটন গ্রুপ (এখন এটি ফর্মের ভেতরেই থাকবে) */}
              <div className="flex gap-2">
  <Button
    type="button"
    variant="ghost"
    className="flex-1"
    onClick={() => {
      setStep('register');
      navigate('/register', { replace: true, state: {} });
    }}
  >
    Back
  </Button>

  <Button
    type="button"
    variant="outline"
    className="flex-1"
    onClick={handleResendOtp}
    disabled={isResending}
  >
    {isResending ? 'Sending...' : 'Resend OTP'}
  </Button>
</div>

            </form>
          )}

          {step === 'register' && (
            <div className="mt-4 text-center body-small text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}