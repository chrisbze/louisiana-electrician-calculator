import { render, screen, fireEvent } from '@testing-library/react'
import ServiceSelector from '../ServiceSelector'
import { Service } from '@/types'

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
  },
  {
    id: 2,
    name: 'SEO Optimization',
    description: 'SEO audit and optimization',
    basePrice: 800,
    category: 'Digital Marketing',
    duration: 480,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
]

const mockOnServiceToggle = jest.fn()

describe('ServiceSelector', () => {
  beforeEach(() => {
    mockOnServiceToggle.mockClear()
  })

  it('renders all services', () => {
    render(
      <ServiceSelector
        services={mockServices}
        selectedServices={[]}
        onServiceToggle={mockOnServiceToggle}
      />
    )

    expect(screen.getByText('Website Design')).toBeInTheDocument()
    expect(screen.getByText('SEO Optimization')).toBeInTheDocument()
    expect(screen.getByText('$2,500.00')).toBeInTheDocument()
    expect(screen.getByText('$800.00')).toBeInTheDocument()
  })

  it('shows services grouped by category', () => {
    render(
      <ServiceSelector
        services={mockServices}
        selectedServices={[]}
        onServiceToggle={mockOnServiceToggle}
      />
    )

    expect(screen.getByText('Web Development')).toBeInTheDocument()
    expect(screen.getByText('Digital Marketing')).toBeInTheDocument()
  })

  it('handles service selection', () => {
    render(
      <ServiceSelector
        services={mockServices}
        selectedServices={[]}
        onServiceToggle={mockOnServiceToggle}
      />
    )

    const checkbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(checkbox)

    expect(mockOnServiceToggle).toHaveBeenCalledWith(1, 1)
  })

  it('shows selected services as checked', () => {
    const selectedServices = [{ serviceId: 1, quantity: 2 }]
    
    render(
      <ServiceSelector
        services={mockServices}
        selectedServices={selectedServices}
        onServiceToggle={mockOnServiceToggle}
      />
    )

    const checkbox = screen.getAllByRole('checkbox')[0]
    expect(checkbox).toBeChecked()
  })

  it('allows quantity adjustment for selected services', () => {
    const selectedServices = [{ serviceId: 1, quantity: 2 }]
    
    render(
      <ServiceSelector
        services={mockServices}
        selectedServices={selectedServices}
        onServiceToggle={mockOnServiceToggle}
      />
    )

    const quantityInput = screen.getByDisplayValue('2')
    fireEvent.change(quantityInput, { target: { value: '3' } })

    expect(mockOnServiceToggle).toHaveBeenCalledWith(1, 3)
  })

  it('shows duration information', () => {
    render(
      <ServiceSelector
        services={mockServices}
        selectedServices={[]}
        onServiceToggle={mockOnServiceToggle}
      />
    )

    expect(screen.getByText('24 hours')).toBeInTheDocument()
    expect(screen.getByText('8 hours')).toBeInTheDocument()
  })
})