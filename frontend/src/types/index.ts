export interface Service {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  category: string; // Residential, Commercial, Emergency
  serviceType: string; // Installation, Repair, Inspection, Upgrade
  duration: number; // in minutes
  materialCost?: number;
  laborRate?: number;
  minimumCharge?: number;
  requiresPermit: boolean;
  permitCost?: number;
  difficultyLevel: string; // Easy, Standard, Complex
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
  address?: string;
  propertyType?: string; // Residential, Commercial, Industrial
}

export interface ApiError {
  error: string;
  errors?: Array<{
    msg: string;
    param: string;
    value: any;
  }>;
}