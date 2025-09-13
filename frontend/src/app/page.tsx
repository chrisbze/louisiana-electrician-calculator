'use client';

import { useState, useEffect } from 'react';
import ServiceSelector from '@/components/ServiceSelector';
import QuoteDisplay from '@/components/QuoteDisplay';
import CustomerForm from '@/components/CustomerForm';
import { Service, Quote, CustomerInfo } from '@/types';
import { calculateQuote, getServices } from '@/lib/api';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<{ serviceId: number; quantity: number }[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({});
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      setError('Failed to load services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (serviceId: number, quantity: number = 1) => {
    setSelectedServices(prev => {
      const existing = prev.find(s => s.serviceId === serviceId);
      if (existing) {
        if (quantity === 0) {
          return prev.filter(s => s.serviceId !== serviceId);
        } else {
          return prev.map(s => 
            s.serviceId === serviceId ? { ...s, quantity } : s
          );
        }
      } else {
        return [...prev, { serviceId, quantity }];
      }
    });
  };

  const handleCalculateQuote = async () => {
    if (selectedServices.length === 0) {
      setError('Please select at least one service');
      return;
    }

    setCalculating(true);
    setError(null);

    try {
      const quoteData = await calculateQuote(selectedServices, customerInfo);
      setQuote(quoteData);
    } catch (err) {
      setError('Failed to calculate quote');
      console.error('Error calculating quote:', err);
    } finally {
      setCalculating(false);
    }
  };

  const handleReset = () => {
    setSelectedServices([]);
    setCustomerInfo({});
    setQuote(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <svg className="w-12 h-12 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <h1 className="text-4xl font-bold text-gray-900">
              Louisiana Electrician Quote Calculator
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Get instant quotes for electrical services in Louisiana. Licensed, insured electricians 
            serving residential and commercial properties. Automatic volume discounts available.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-600">
            <span className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Licensed & Insured
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Emergency Services Available
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              NEC Code Compliant
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ServiceSelector
              services={services}
              selectedServices={selectedServices}
              onServiceToggle={handleServiceToggle}
            />
            
            <CustomerForm
              customerInfo={customerInfo}
              onChange={setCustomerInfo}
            />

            <div className="flex space-x-4">
              <button
                onClick={handleCalculateQuote}
                disabled={calculating || selectedServices.length === 0}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
              >
                {calculating ? 'Calculating Quote...' : 'Get Instant Quote'}
              </button>
              
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Reset
              </button>
            </div>
          </div>

          <div>
            <QuoteDisplay 
              quote={quote}
              selectedServices={selectedServices}
              services={services}
            />
          </div>
        </div>
      </div>
    </main>
  );
}