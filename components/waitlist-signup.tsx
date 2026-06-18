'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';
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
import { FaInstagram, FaFacebook, FaTiktok, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
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
  { value: 'twitter', label: 'Twitter/X', icon: FaXTwitter },
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
  
  const referralButtonRef = useRef<HTMLButtonElement>(null);
  const referralMenuRef = useRef<HTMLDivElement>(null);
  
  const { joinWaitlist, isLoading, error, isSuccess, submittedRole, reset: resetHookState } = useWaitlist();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset: resetForm } = useForm<FormData>();
  
  const selectedRole = watch('role');
  const selectedReferral = watch('referralSource');
  const selectedReferralOption = referralOptions.find(opt => opt.value === selectedReferral);

  // Close referral dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isReferralOpen &&
        referralButtonRef.current &&
        !referralButtonRef.current.contains(event.target as Node) &&
        referralMenuRef.current &&
        !referralMenuRef.current.contains(event.target as Node)
      ) {
        setIsReferralOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isReferralOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isReferralOpen) {
        setIsReferralOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isReferralOpen]);

  // Handle success state
  useEffect(() => {
    if (isSuccess && !showSuccess) {
      resetForm();
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        resetHookState();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, showSuccess, resetForm, resetHookState]);

  // Handle error state
  useEffect(() => {
    if (error && !showError) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        resetHookState();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, showError, resetHookState]);

  const onSubmit = async (data: FormData) => {
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

  // Success Message - Consistent with page.tsx styling
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
        role="status"
        aria-live="polite"
        aria-label="Success notification"
      >
        <div className="flex justify-center mb-3" aria-hidden="true">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-brand-800 font-semibold text-lg mb-2">{successMessage.title}</h3>
        <p className="text-brand-600 text-sm">{successMessage.message}</p>
      </motion.div>
    );
  }

  // Error Message - Consistent with page.tsx styling
  if (showError && error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="p-6 bg-red-50 border border-red-200 rounded-xl text-center"
        role="alert"
        aria-live="assertive"
        aria-label="Error notification"
      >
        <div className="flex justify-center mb-3" aria-hidden="true">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-brand-800 font-semibold text-lg mb-2">Something went wrong</h3>
        <p className="text-brand-600 text-sm">{error}</p>
        <button
          onClick={() => {
            setShowError(false);
            resetHookState();
          }}
          className="mt-4 text-sm text-brand-600 hover:text-brand-700 underline rounded px-2 py-1"
          aria-label="Try again"
        >
          Try again
        </button>
      </motion.div>
    );
  }

  // Form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* First & Last Name */}
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <div>
          <div className="relative">
            <label htmlFor="firstName" className="sr-only">First name</label>
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500" aria-hidden="true" />
            <input
              id="firstName"
              type="text"
              placeholder="First name"
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-white text-brand-800 placeholder:text-brand-400 border-brand-200 focus:border-brand-500 transition-all"
              aria-required="true"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              {...register('firstName', { required: 'First name is required' })}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 text-sm font-semibold" aria-hidden="true">*</span>
          </div>
          {errors.firstName && (
            <p id="firstName-error" className="text-red-500 text-xs mt-1 text-left" role="alert">
              {errors.firstName.message}
            </p>
          )}
        </div>
        
        <div>
          <div className="relative">
            <label htmlFor="lastName" className="sr-only">Last name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Last name"
              className="w-full px-4 py-3 rounded-xl border-2 bg-white text-brand-800 placeholder:text-brand-400 border-brand-200 focus:border-brand-500 transition-all"
              aria-required="true"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              {...register('lastName', { required: 'Last name is required' })}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 text-sm font-semibold" aria-hidden="true">*</span>
          </div>
          {errors.lastName && (
            <p id="lastName-error" className="text-red-500 text-xs mt-1 text-left" role="alert">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <div className="relative">
          <label htmlFor="email" className="sr-only">Email address</label>
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500" aria-hidden="true" />
          <input
            id="email"
            type="email"
            placeholder="Email address"
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-white text-brand-800 placeholder:text-brand-400 border-brand-200 focus:border-brand-500 transition-all"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
              },
            })}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 text-sm font-semibold" aria-hidden="true">*</span>
        </div>
        {errors.email && (
          <p id="email-error" className="text-red-500 text-xs mt-1 text-left" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Role Selection */}
      <div>
        <fieldset>
          <legend className="text-brand-700 text-sm mb-2 text-left font-medium">
            I want to join as: <span className="text-brand-500 text-sm font-semibold" aria-hidden="true">*</span>
          </legend>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="radio"
                id="role-customer"
                value="customer"
                className="hidden peer/customer"
                {...register('role', { required: 'Please select a role' })}
              />
              <label
                htmlFor="role-customer"
                className={`cursor-pointer flex flex-col items-center p-4 rounded-xl border-2 transition-all peer-checked/customer:bg-brand-50 peer-checked/customer:border-brand-500 peer-checked/customer:shadow-md ${
                  selectedRole === 'customer'
                    ? 'bg-brand-50 border-brand-500 shadow-md'
                    : 'bg-white border-brand-200 hover:border-brand-300 hover:bg-brand-50/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  selectedRole === 'customer' ? 'bg-brand-600' : 'bg-brand-100'
                }`} aria-hidden="true">
                  <ShoppingBag className={`w-5 h-5 ${
                    selectedRole === 'customer' ? 'text-white' : 'text-brand-600'
                  }`} aria-hidden="true" />
                </div>
                <span className={`font-semibold text-sm ${
                  selectedRole === 'customer' ? 'text-brand-800' : 'text-brand-600'
                }`}>Customer</span>
                <span className="text-xs text-brand-500">Shop authentic products</span>
              </label>
            </div>
            
            <div>
              <input
                type="radio"
                id="role-vendor"
                value="vendor"
                className="hidden peer/vendor"
                {...register('role', { required: 'Please select a role' })}
              />
              <label
                htmlFor="role-vendor"
                className={`cursor-pointer flex flex-col items-center p-4 rounded-xl border-2 transition-all peer-checked/vendor:bg-brand-50 peer-checked/vendor:border-brand-500 peer-checked/vendor:shadow-md ${
                  selectedRole === 'vendor'
                    ? 'bg-brand-50 border-brand-500 shadow-md'
                    : 'bg-white border-brand-200 hover:border-brand-300 hover:bg-brand-50/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  selectedRole === 'vendor' ? 'bg-brand-600' : 'bg-brand-100'
                }`} aria-hidden="true">
                  <TrendingUp className={`w-5 h-5 ${
                    selectedRole === 'vendor' ? 'text-white' : 'text-brand-600'
                  }`} aria-hidden="true" />
                </div>
                <span className={`font-semibold text-sm ${
                  selectedRole === 'vendor' ? 'text-brand-800' : 'text-brand-600'
                }`}>Vendor</span>
                <span className="text-xs text-brand-500">Grow your business</span>
              </label>
            </div>
          </div>
          {errors.role && (
            <p id="role-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.role.message}
            </p>
          )}
        </fieldset>
      </div>

      {/* Referral Source - Optional */}
      <div>
        <label id="referral-label" className="block text-brand-700 text-sm mb-2 text-left font-medium">
          How did you hear about us? <span className="text-brand-400 text-xs font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <button
            ref={referralButtonRef}
            type="button"
            onClick={() => setIsReferralOpen(!isReferralOpen)}
            className="w-full px-4 py-3 rounded-xl border-2 bg-white text-left flex items-center justify-between border-brand-200 focus:border-brand-500 transition-all"
            aria-haspopup="listbox"
            aria-expanded={isReferralOpen}
            aria-labelledby="referral-label"
          >
            <div className="flex items-center gap-2">
              {selectedReferralOption ? (
                <>
                  <selectedReferralOption.icon className="w-5 h-5 text-brand-500" aria-hidden="true" />
                  <span className="text-brand-800">{selectedReferralOption.label}</span>
                </>
              ) : (
                <>
                  <Star className="w-5 h-5 text-brand-500" aria-hidden="true" />
                  <span className="text-brand-500">Select an option</span>
                </>
              )}
            </div>
            <ChevronDown className={`w-5 h-5 text-brand-500 transition-transform duration-200 ${isReferralOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          
          <AnimatePresence>
            {isReferralOpen && (
              <motion.div
                ref={referralMenuRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-brand-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto"
                role="listbox"
                aria-labelledby="referral-label"
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
                    role="option"
                    aria-selected={selectedReferral === option.value}
                  >
                    <option.icon className="w-5 h-5 text-brand-500" aria-hidden="true" />
                    <span className="text-sm">{option.label}</span>
                    {selectedReferral === option.value && (
                      <CheckCircle className="w-4 h-4 text-brand-600 ml-auto" aria-hidden="true" />
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
        className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-brand-600 to-brand-700 text-white hover:from-brand-700 hover:to-brand-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            Joining Waitlist...
          </>
        ) : (
          <>
            Join Waitlist
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}