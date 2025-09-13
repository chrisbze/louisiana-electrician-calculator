import { getServices, calculateQuote } from '../api'
import { Service, CustomerInfo } from '@/types'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('API functions', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
  })

  describe('getServices', () => {
    it('fetches services successfully', async () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockServices
      })

      const result = await getServices()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/services')
      expect(result).toEqual(mockServices)
    })

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(getServices()).rejects.toThrow('Failed to fetch services')
    })

    it('uses default API URL when environment variable is not set', async () => {
      delete process.env.NEXT_PUBLIC_API_URL

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })

      await getServices()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/services')
    })
  })

  describe('calculateQuote', () => {
    it('calculates quote successfully', async () => {
      const mockQuote = {
        id: 1,
        services: [],
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

      const services = [{ serviceId: 1, quantity: 1 }]
      const customerInfo: CustomerInfo = {
        name: 'John Doe',
        email: 'john@example.com'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuote
      })

      const result = await calculateQuote(services, customerInfo)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/quotes/calculate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            services,
            customerInfo
          })
        }
      )
      expect(result).toEqual(mockQuote)
    })

    it('calculates quote without customer info', async () => {
      const mockQuote = {
        id: 1,
        services: [],
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

      const services = [{ serviceId: 1, quantity: 1 }]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuote
      })

      const result = await calculateQuote(services)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/quotes/calculate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            services,
            customerInfo: undefined
          })
        }
      )
      expect(result).toEqual(mockQuote)
    })

    it('throws error when calculation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid request' })
      })

      await expect(calculateQuote([{ serviceId: 1, quantity: 1 }]))
        .rejects.toThrow('Failed to calculate quote')
    })
  })
})