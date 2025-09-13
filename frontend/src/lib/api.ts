import { Service, Quote, CustomerInfo, ApiError } from '@/types';

// Dynamic API URL based on client location
const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
  }
  
  // Client-side: check if we're accessing via network IP
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3002';
  } else {
    // Use the same IP as the frontend but port 3002 for backend
    return `http://${hostname}:3002`;
  }
};

const API_BASE_URL = getApiUrl();

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.error || 'An error occurred');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async getServices(): Promise<Service[]> {
    return this.request<Service[]>('/api/services');
  }

  async getService(id: number): Promise<Service> {
    return this.request<Service>(`/api/services/${id}`);
  }

  async calculateQuote(
    services: { serviceId: number; quantity?: number }[],
    customerInfo?: CustomerInfo
  ): Promise<Quote> {
    return this.request<Quote>('/api/quotes/calculate', {
      method: 'POST',
      body: JSON.stringify({ services, customerInfo }),
    });
  }

  async getQuotes(): Promise<Quote[]> {
    return this.request<Quote[]>('/api/quotes');
  }

  async getQuote(id: number): Promise<Quote> {
    return this.request<Quote>(`/api/quotes/${id}`);
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// Export individual functions for easier use
export const getServices = () => apiClient.getServices();
export const getService = (id: number) => apiClient.getService(id);
export const calculateQuote = (
  services: { serviceId: number; quantity?: number }[],
  customerInfo?: CustomerInfo
) => apiClient.calculateQuote(services, customerInfo);
export const getQuotes = () => apiClient.getQuotes();
export const getQuote = (id: number) => apiClient.getQuote(id);

export default apiClient;