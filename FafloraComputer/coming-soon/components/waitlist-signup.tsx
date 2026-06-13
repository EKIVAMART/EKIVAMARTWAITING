'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  TrendingUp, 
  Mail, 
  ArrowRight, 
  CheckCircle,
  User,
  ChevronDown,
  Users,
  Search,
  Gift,
  Star,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { FaInstagram, FaFacebook, FaTiktok, FaLinkedinIn, FaYoutube, FaTwitter } from 'react-icons/fa';
import { useWaitlist } from '@/hooks/useWaitlist';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: 'customer' | 'vendor';
  referralSource: string;
};

const referralOptions = [
  { value: 'instagram', label: 'Instagram', icon: FaInstagram },
  { value: 'facebook', label: 'Facebook', icon: FaFacebook },
  { value: 'tiktok', label: 'Tiktok', icon: FaTiktok },
  { value: 'linkedin', label: 'Linkedin', icon: FaLinkedinIn },
  { value: 'twitter', label: 'Twitter/X', icon: FaTwitter },
  { value: 'youtube', label: 'YouTube', icon: FaYoutube },
  { value: 'ads', label: 'Online Ads (Google, Facebook, Instagram)', icon: TrendingUp },
  { value: 'friend', label: 'Friend or Family', icon: Users },
  { value: 'google', label: 'Google Search', icon: Search },
  { value: 'event', label: 'Event / Expo', icon: Gift },
  { value: 'other', label: 'Other', icon: Star },
];

export function WaitlistSignup() {
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const { joinWaitlist, isLoading, error, isSuccess, submittedRole, reset: resetHookState } = useWaitlist();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset: resetForm } = useForm<FormData>();
  
  const selectedRole = watch('role');
  const selectedReferral = watch('referralSource');
  const selectedReferralOption = referralOptions.find(opt => opt.value === selectedReferral);

  // Handle success state - only trigger once
  useEffect(() => {
    if (isSuccess && !showSuccess) {
      resetForm();
      setShowSuccess(true);
      // Auto-hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
        resetHookState();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, showSuccess, resetForm, resetHookState]);

  // Handle error state - only trigger once
  useEffect(() => {
    if (error && !showError) {
      setShowError(true);
      // Auto-hide error message after 5 seconds
      const timer = setTimeout(() => {
        setShowError(false);
        resetHookState();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, showError, resetHookState]);

  const onSubmit = async (data: FormData) => {
    // Reset error/success display states before new submission
    setShowSuccess(false);
    setShowError(false);
    await joinWaitlist({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      referralSource: data.referralSource || undefined,
    });
  };

  // Success Message
  if (showSuccess) {
    const successMessage = submittedRole === 'vendor'
      ? {
          title: "You're on the list!",
          message: "We'll notify you when Faflora launches. Get ready to start selling and grow your business!"
        }
      : {
          title: "You're on the list!",
          message: "We'll notify you when Faflora launches. Get ready to discover authentic Nigerian products!"
        };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="p-6 bg-green-50 border border-green-200 rounded-xl text-center"
      >
        <div className="flex justify-center mb-3">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-brand-800 font-semibold text-lg mb-2">{successMessage.title}</h3>
        <p className="text-brand-500 text-sm">{successMessage.message}</p>
      </motion.div>
    );
  }

  // Error Message
  if (showError && error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="p-6 bg-red-50 border border-red-200 rounded-xl text-center"
      >
        <div className="flex justify-center mb-3">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-red-800 font-semibold text-lg mb-2">Something went wrong</h3>
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={() => {
            setShowError(false);
            resetHookState();
          }}
          className="mt-4 text-sm text-red-600 hover:text-red-700 underline"
        >
          Try again
        </button>
      </motion.div>
    );
  }

  // Form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* First & Last Name */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500" />
            <input
              type="text"
              placeholder="First name"
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-white text-brand-800 placeholder:text-brand-500 border-brand-200 focus:border-brand-500 focus:outline-none transition-all"
              {...register('firstName', { required: 'First name is required' })}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 text-sm font-semibold">*</span>
          </div>
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1 text-left">{errors.firstName.message}</p>
          )}
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Last name"
            className="w-full px-4 py-3 rounded-xl border-2 bg-white text-brand-800 placeholder:text-brand-500 border-brand-200 focus:border-brand-500 focus:outline-none transition-all"
            {...register('lastName', { required: 'Last name is required' })}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 text-sm font-semibold">*</span>
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1 text-left">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500" />
          <input
            type="email"
            placeholder="Email address"
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-white text-brand-800 placeholder:text-brand-500 border-brand-200 focus:border-brand-500 focus:outline-none transition-all"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
              },
            })}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 text-sm font-semibold">*</span>
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 text-left">{errors.email.message}</p>
        )}
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-brand-600 text-sm mb-2 text-left font-medium">
          I want to join as: <span className="text-brand-500 text-sm font-semibold">*</span>
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

      {/* Referral Source - Optional */}
      <div>
        <label className="block text-brand-600 text-sm mb-2 text-left font-medium">
          How did you hear about us? <span className="text-brand-400 text-xs font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsReferralOpen(!isReferralOpen)}
            className="w-full px-4 py-3 rounded-xl border-2 bg-white text-left flex items-center justify-between border-brand-200 focus:border-brand-500 transition-all"
          >
            <div className="flex items-center gap-2">
              {selectedReferralOption ? (
                <>
                  <selectedReferralOption.icon className="w-5 h-5 text-brand-500" />
                  <span className="text-brand-800">{selectedReferralOption.label}</span>
                </>
              ) : (
                <>
                  <Star className="w-5 h-5 text-brand-500" />
                  <span className="text-brand-500">Select an option</span>
                </>
              )}
            </div>
            <ChevronDown className={`w-5 h-5 text-brand-500 transition-transform duration-200 ${isReferralOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isReferralOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-brand-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto"
              >
                {referralOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setValue('referralSource', option.value);
                      setIsReferralOpen(false);
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-brand-50 transition-colors text-left ${
                      selectedReferral === option.value ? 'bg-brand-50 text-brand-800' : 'text-brand-700'
                    }`}
                  >
                    <option.icon className="w-5 h-5 text-brand-500" />
                    <span className="text-sm">{option.label}</span>
                    {selectedReferral === option.value && (
                      <CheckCircle className="w-4 h-4 text-brand-600 ml-auto" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <input type="hidden" {...register('referralSource')} />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-brand-600 to-brand-700 text-white hover:from-brand-700 hover:to-brand-800 transition-all disabled:opacity-50 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Joining Waitlist...
          </>
        ) : (
          <>
            Join Waitlist
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}