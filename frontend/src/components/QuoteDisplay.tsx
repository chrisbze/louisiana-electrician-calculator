'use client';

import { Quote, Service } from '@/types';

interface QuoteDisplayProps {
  quote: Quote | null;
  selectedServices: { serviceId: number; quantity: number }[];
  services: Service[];
}

export default function QuoteDisplay({ quote, selectedServices, services }: QuoteDisplayProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} minutes`;
    } else if (mins === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDiscountText = (servicesCount: number) => {
    if (servicesCount >= 3) {
      return '15% discount for 3+ services';
    } else if (servicesCount === 2) {
      return '10% discount for 2 services';
    }
    return null;
  };

  if (!quote && selectedServices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quote Summary</h2>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">Select services to see your quote</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    // Show preview before calculation
    const previewServices = selectedServices.map(selected => {
      const service = services.find(s => s.id === selected.serviceId)!;
      return {
        ...service,
        quantity: selected.quantity,
        lineTotal: service.basePrice * selected.quantity,
      };
    });

    const subtotal = previewServices.reduce((sum, service) => sum + service.lineTotal, 0);
    const discountText = getDiscountText(selectedServices.length);

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quote Preview</h2>
        
        <div className="space-y-3 mb-6">
          {previewServices.map((service) => (
            <div key={service.id} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-900">{service.name}</div>
                <div className="text-sm text-gray-500">
                  Qty: {service.quantity} × {formatPrice(service.basePrice)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatPrice(service.lineTotal)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          
          {discountText && (
            <div className="flex justify-between items-center mb-2 text-green-600">
              <span className="text-sm">{discountText}</span>
              <span className="font-semibold">-</span>
            </div>
          )}

          <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2 border-t">
            <span>Estimated Total</span>
            <span>~{formatPrice(subtotal * (discountText ? (selectedServices.length >= 3 ? 0.85 : 0.90) : 1))}</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Click "Calculate Quote" to get the final pricing and save your quote.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Quote</h2>
        <div className="text-sm text-gray-500">
          Quote #{quote.id}
        </div>
      </div>

      {/* Services */}
      <div className="space-y-3 mb-6">
        {quote.services.map((service) => (
          <div key={service.id} className="flex justify-between items-center py-3 border-b border-gray-100">
            <div className="flex-1">
              <div className="font-medium text-gray-900">{service.name}</div>
              <div className="text-sm text-gray-500 mt-1">
                {service.description}
              </div>
              <div className="text-sm text-gray-500">
                Qty: {service.quantity} × {formatPrice(service.basePrice)} | 
                Duration: {formatDuration(service.duration * service.quantity)}
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="font-semibold">{formatPrice(service.lineTotal)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Summary */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">{formatPrice(quote.pricing.subtotal)}</span>
        </div>

        {quote.pricing.discount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span>
              {getDiscountText(quote.services.length)} Applied
            </span>
            <span className="font-semibold">
              -{formatPrice(quote.pricing.discount)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-3 border-t">
          <span>Total</span>
          <span>{formatPrice(quote.pricing.total)}</span>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Estimated Duration:</span>
          <span className="font-medium">{formatDuration(quote.estimatedDuration)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Quote Valid Until:</span>
          <span className="font-medium">{formatDate(quote.validUntil)}</span>
        </div>
        {quote.customerInfo?.name && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Customer:</span>
            <span className="font-medium">{quote.customerInfo.name}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => window.print()}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Print Quote
        </button>
        <button
          onClick={() => {
            const quoteText = `Service Quote #${quote.id}\n\nServices:\n${quote.services.map(s => `- ${s.name} (${s.quantity}x): ${formatPrice(s.lineTotal)}`).join('\n')}\n\nSubtotal: ${formatPrice(quote.pricing.subtotal)}\nDiscount: -${formatPrice(quote.pricing.discount)}\nTotal: ${formatPrice(quote.pricing.total)}\n\nValid until: ${formatDate(quote.validUntil)}`;
            
            if (navigator.share) {
              navigator.share({
                title: `Service Quote #${quote.id}`,
                text: quoteText,
              });
            } else {
              navigator.clipboard.writeText(quoteText);
              alert('Quote copied to clipboard!');
            }
          }}
          className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200"
        >
          Share Quote
        </button>
      </div>
    </div>
  );
}