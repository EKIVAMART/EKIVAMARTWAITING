'use client';

import { useState, useCallback } from 'react';
import { waitlistApi, JoinWaitlistRequest } from '@/lib/api';

interface UseWaitlistReturn {
  joinWaitlist: (data: JoinWaitlistRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  submittedRole: 'customer' | 'vendor' | null;
  reset: () => void;
}

export function useWaitlist(): UseWaitlistReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedRole, setSubmittedRole] = useState<'customer' | 'vendor' | null>(null);

  const reset = useCallback(() => {
    setError(null);
    setIsSuccess(false);
    setSubmittedRole(null);
  }, []);

  const joinWaitlist = useCallback(async (data: JoinWaitlistRequest) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    setSubmittedRole(data.role);

    try {
      await waitlistApi.join(data);
      setIsSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    joinWaitlist,
    isLoading,
    error,
    isSuccess,
    submittedRole,
    reset,
  };
}