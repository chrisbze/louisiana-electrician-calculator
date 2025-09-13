import { render, screen, fireEvent } from '@testing-library/react'
import CustomerForm from '../CustomerForm'
import { CustomerInfo } from '@/types'

const mockOnChange = jest.fn()

describe('CustomerForm', () => {
  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders all form fields', () => {
    render(
      <CustomerForm
        customerInfo={{}}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
  })

  it('displays current customer info values', () => {
    const customerInfo: CustomerInfo = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    }

    render(
      <CustomerForm
        customerInfo={customerInfo}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument()
  })

  it('calls onChange when name is updated', () => {
    render(
      <CustomerForm
        customerInfo={{}}
        onChange={mockOnChange}
      />
    )

    const nameInput = screen.getByLabelText(/name/i)
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      name: 'Jane Doe'
    })
  })

  it('calls onChange when email is updated', () => {
    render(
      <CustomerForm
        customerInfo={{}}
        onChange={mockOnChange}
      />
    )

    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      email: 'jane@example.com'
    })
  })

  it('calls onChange when phone is updated', () => {
    render(
      <CustomerForm
        customerInfo={{}}
        onChange={mockOnChange}
      />
    )

    const phoneInput = screen.getByLabelText(/phone/i)
    fireEvent.change(phoneInput, { target: { value: '+0987654321' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      phone: '+0987654321'
    })
  })

  it('shows optional label for phone field', () => {
    render(
      <CustomerForm
        customerInfo={{}}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText(/phone.*optional/i)).toBeInTheDocument()
  })

  it('preserves existing values when updating a single field', () => {
    const initialInfo: CustomerInfo = {
      name: 'John Doe',
      email: 'john@example.com'
    }

    render(
      <CustomerForm
        customerInfo={initialInfo}
        onChange={mockOnChange}
      />
    )

    const phoneInput = screen.getByLabelText(/phone/i)
    fireEvent.change(phoneInput, { target: { value: '+1234567890' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    })
  })
})