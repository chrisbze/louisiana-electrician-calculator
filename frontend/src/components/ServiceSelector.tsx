'use client';

import { useState } from 'react';
import { Service } from '@/types';

interface ServiceSelectorProps {
  services: Service[];
  selectedServices: { serviceId: number; quantity: number }[];
  onServiceToggle: (serviceId: number, quantity: number) => void;
}

export default function ServiceSelector({
  services,
  selectedServices,
  onServiceToggle,
}: ServiceSelectorProps) {
  const [filter, setFilter] = useState('all');
  
  const categories = ['all', ...Array.from(new Set(services.map(service => service.category)))];
  
  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(service => service.category === filter);

  const getSelectedQuantity = (serviceId: number) => {
    return selectedServices.find(s => s.serviceId === serviceId)?.quantity || 0;
  };

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Services</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredServices.map((service) => {
          const quantity = getSelectedQuantity(service.id);
          const isSelected = quantity > 0;

          return (
            <div
              key={service.id}
              className={`border rounded-lg p-4 transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onServiceToggle(service.id, 1);
                        } else {
                          onServiceToggle(service.id, 0);
                        }
                      }}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-2 text-sm flex-wrap">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {service.category}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      {service.serviceType}
                    </span>
                    {service.requiresPermit && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        ⚠️ Permit Required
                      </span>
                    )}
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {service.difficultyLevel}
                    </span>
                    <span className="text-gray-600">
                      Duration: {formatDuration(service.duration)}
                    </span>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-xl font-bold text-gray-900">
                    {formatPrice(service.basePrice)}
                  </div>
                  {service.minimumCharge && service.minimumCharge !== service.basePrice && (
                    <div className="text-xs text-gray-500">
                      Min: {formatPrice(service.minimumCharge)}
                    </div>
                  )}
                  {service.requiresPermit && service.permitCost && (
                    <div className="text-xs text-orange-600">
                      +{formatPrice(service.permitCost)} permit
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="mt-2">
                      <label className="text-sm text-gray-600">Quantity:</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <button
                          onClick={() => onServiceToggle(service.id, Math.max(1, quantity - 1))}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onServiceToggle(service.id, quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No services found in this category.
        </div>
      )}
    </div>
  );
}