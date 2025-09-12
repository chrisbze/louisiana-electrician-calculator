export interface Service {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  duration: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface QuotedService {
  id: number;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  quantity: number;
  lineTotal: number;
  duration: number;
}

export interface Quote {
  id: number;
  services: QuotedService[];
  pricing: {
    subtotal: number;
    discount: number;
    total: number;
  };
  estimatedDuration: number;
  validUntil: string;
  customerInfo?: CustomerInfo;
  createdAt: string;
}

export interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ApiError {
  error: string;
  errors?: Array<{
    msg: string;
    param: string;
    value: any;
  }>;
}