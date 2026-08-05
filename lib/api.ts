// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://faflora-production.onrender.com';

export interface JoinWaitlistRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'vendor';
  referralSource?: string;
}

export interface LaunchConfigResponse {
  launchDate: string;
  title: string;
  subtitle: string;
  isLaunched: boolean;
  updatedAt: string;
}

export const waitlistApi = {
  async join(data: JoinWaitlistRequest): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/waitlist/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        referralSource: data.referralSource,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Too many signup attempts. Please try again later.');
      }
      throw new Error(result.message || 'Failed to join waitlist');
    }

    return result;
  },

  async getLaunchConfig(): Promise<LaunchConfigResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/waitlist/launch-config`);
      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error('Invalid response');
    } catch (error) {
      // Return fallback - July 1st, 2026
      return {
        launchDate: new Date(2026, 6, 1, 0, 0, 0).toISOString(),
        title: 'Something Amazing is Coming',
        subtitle: "Nigeria's Premier Multi-Vendor Marketplace",
        isLaunched: false,
        updatedAt: new Date().toISOString(),
      };
    }
  },
};