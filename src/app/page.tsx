'use client'

import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ShoppingBag, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth';
import useAuthStore from '@/store/authStore';

export default function Login() {
  const router = useRouter();
  const { user } = useAuthStore();
 
 
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { mutate, isPending } = useLogin();



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-[#16A34A] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1748342319942-223b99937d4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Fresh groceries"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md mb-6">
            <ShoppingBag className="w-16 h-16" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Namma Mart</h1>
          <p className="text-xl text-center max-w-md font-light text-green-50">
            Admin Management Portal: Monitor inventory, orders, and sales in real-time.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex flex-col items-center justify-center mb-8">
            <div className="bg-green-100 p-3 rounded-xl mb-3">
              <ShoppingBag className="w-10 h-10 text-[#16A34A]" />
            </div>
            <span className="text-2xl font-bold text-[#111827]">Namma Mart</span>
            <p className="text-sm text-gray-500">Admin Portal</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#111827] mb-2 text-center lg:text-left">Welcome Back</h2>
              <p className="text-[#6B7280] text-center lg:text-left">Please enter your credentials to login</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#111827] mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#16A34A]">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="admin@nammamart.com"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#16A34A] focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#111827] mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#16A34A]">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#16A34A] focus:bg-white transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#111827]"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center cursor-pointer">
                  
                  
                </label>
                <button type="button" className="text-sm font-medium text-[#16A34A] hover:text-[#15803D]">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#16A34A] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#15803D] active:scale-[0.98] transition-all shadow-lg shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

          </div>
          
          <Link 
            href="/" 
            className="mt-8 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}