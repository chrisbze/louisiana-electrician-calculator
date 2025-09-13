import { render, screen } from '@testing-library/react'
import QuoteDisplay from '../QuoteDisplay'
import { Quote, Service } from '@/types'

const mockServices: Service[] = [
  {
    id: 1,
    name: 'Website Design',
    description: 'Custom website design',
    basePrice: 2500,
    category: 'Web Development',
    duration: 1440,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
]

const mockQuote: Quote = {
  id: 1,
  services: [
    {
      id: 1,
      name: 'Website Design',
      description: 'Custom website design',
      category: 'Web Development',
      basePrice: 2500,
      quantity: 1,
      lineTotal: 2500,
      duration: 1440
    }
  ],
  pricing: {
    subtotal: 2500,
    discount: 0,
    total: 2500
  },
  estimatedDuration: 1440,
  validUntil: '2023-12-31T00:00:00Z',
  customerInfo: null,
  createdAt: '2023-01-01T00:00:00Z'
}

describe('QuoteDisplay', () => {
  it('shows placeholder when no quote is available', () => {
    render(
      <QuoteDisplay
        quote={null}
        selectedServices={[]}
        services={mockServices}
      />
    )

    expect(screen.getByText('Your Quote')).toBeInTheDocument()
    expect(screen.getByText('Select services to see your quote')).toBeInTheDocument()
  })

  it('displays quote details when quote is provided', () => {
    render(
      <QuoteDisplay
        quote={mockQuote}
        selectedServices={[{ serviceId: 1, quantity: 1 }]}
        services={mockServices}
      />
    )

    expect(screen.getByText('Website Design')).toBeInTheDocument()
    expect(screen.getByText('$2,500.00')).toBeInTheDocument()
    expect(screen.getByText('24 hours')).toBeInTheDocument()
  })

  it('shows pricing breakdown', () => {
    render(
      <QuoteDisplay
        quote={mockQuote}
        selectedServices={[{ serviceId: 1, quantity: 1 }]}
        services={mockServices}
      />
    )

    expect(screen.getByText('Subtotal:')).toBeInTheDocument()
    expect(screen.getByText('Total:')).toBeInTheDocument()
  })

  it('shows discount when applicable', () => {
    const quoteWithDiscount: Quote = {
      ...mockQuote,
      pricing: {
        subtotal: 2500,
        discount: 250,
        total: 2250
      }
    }

    render(
      <QuoteDisplay
        quote={quoteWithDiscount}
        selectedServices={[{ serviceId: 1, quantity: 1 }]}
        services={mockServices}
      />
    )

    expect(screen.getByText('Discount:')).toBeInTheDocument()
    expect(screen.getByText('-$250.00')).toBeInTheDocument()
  })

  it('shows total estimated duration', () => {
    render(
      <QuoteDisplay
        quote={mockQuote}
        selectedServices={[{ serviceId: 1, quantity: 1 }]}
        services={mockServices}
      />
    )

    expect(screen.getByText('Total Duration: 24 hours')).toBeInTheDocument()
  })

  it('formats currency correctly', () => {
    render(
      <QuoteDisplay
        quote={mockQuote}
        selectedServices={[{ serviceId: 1, quantity: 1 }]}
        services={mockServices}
      />
    )

    const totalAmount = screen.getByText('$2,500.00')
    expect(totalAmount).toBeInTheDocument()
  })
})