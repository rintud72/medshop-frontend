import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '@/lib/api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void; // ✅ এই ফাংশনটি যোগ করা হয়েছে
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // ✅ নতুন updateUser ফাংশন
  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    const { token: newToken, user: newUser } = response.data;
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post('/users/register', { name, email, password });
  };

  const verifyOtp = async (email: string, otp: string) => {
     await api.post('/users/verify-otp', { email, otp });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      verifyOtp, 
      logout, 
      updateUser, // ✅ প্রভাইডারে পাস করা হলো
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}