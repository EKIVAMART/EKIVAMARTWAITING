'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, Mail, ArrowRight, CheckCircle } from 'lucide-react';

type FormData = {
  email: string;
  role: 'customer' | 'vendor';
};

export function WaitlistSignup() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, reset } = useForm<FormData>();
  
  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    console.log('Waitlist submission:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    reset();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 bg-green-50 border border-green-200 rounded-xl text-center"
      >
        <div className="flex justify-center mb-3">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-brand-800 font-semibold text-lg mb-2">You're on the list!</h3>
        <p className="text-brand-500 text-sm">
          We'll notify you when Faflora launches. Get ready to transform your shopping/selling experience!
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email field */}
      <div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500" />
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-white text-brand-800 placeholder:text-brand-500 border-brand-200 focus:border-brand-500 focus:outline-none transition-all"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 text-left">{errors.email.message}</p>
        )}
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-brand-600 text-sm mb-2 text-left font-medium">
          I want to join as:
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label
            className={`cursor-pointer flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
              selectedRole === 'customer'
                ? 'bg-brand-50 border-brand-500 shadow-md'
                : 'bg-white border-brand-200 hover:border-brand-300 hover:bg-brand-50/50'
            }`}
          >
            <input
              type="radio"
              value="customer"
              className="hidden"
              {...register('role', { required: 'Please select a role' })}
            />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              selectedRole === 'customer' ? 'bg-brand-600' : 'bg-brand-100'
            }`}>
              <ShoppingBag className={`w-5 h-5 ${
                selectedRole === 'customer' ? 'text-white' : 'text-brand-600'
              }`} />
            </div>
            <span className={`font-semibold text-sm ${
              selectedRole === 'customer' ? 'text-brand-800' : 'text-brand-600'
            }`}>Customer</span>
            <span className="text-xs text-brand-500">Shop authentic products</span>
          </label>
          
          <label
            className={`cursor-pointer flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
              selectedRole === 'vendor'
                ? 'bg-brand-50 border-brand-500 shadow-md'
                : 'bg-white border-brand-200 hover:border-brand-300 hover:bg-brand-50/50'
            }`}
          >
            <input
              type="radio"
              value="vendor"
              className="hidden"
              {...register('role', { required: 'Please select a role' })}
            />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              selectedRole === 'vendor' ? 'bg-brand-600' : 'bg-brand-100'
            }`}>
              <TrendingUp className={`w-5 h-5 ${
                selectedRole === 'vendor' ? 'text-white' : 'text-brand-600'
              }`} />
            </div>
            <span className={`font-semibold text-sm ${
              selectedRole === 'vendor' ? 'text-brand-800' : 'text-brand-600'
            }`}>Vendor</span>
            <span className="text-xs text-brand-500">Grow your business</span>
          </label>
        </div>
        {errors.role && (
          <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-brand-600 to-brand-700 text-white hover:from-brand-700 hover:to-brand-800 transition-all disabled:opacity-50 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        {isSubmitting ? 'Joining Waitlist...' : 'Join Waitlist'}
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}