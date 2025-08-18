/**
 * Tests for input validation
 */
import { 
  validateShopTitle, 
  validateOwnerName, 
  validateItemName, 
  validateItemPrice, 
  validateItemCategory,
  validateShop,
  sanitizeString 
} from '../lib/validation'

describe('Input Validation', () => {
  describe('validateShopTitle', () => {
    it('should accept valid shop titles', () => {
      const result = validateShopTitle('Mystic Emporium')
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject empty titles', () => {
      const result = validateShopTitle('')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Shop title is required')
    })

    it('should reject titles that are too long', () => {
      const longTitle = 'a'.repeat(101)
      const result = validateShopTitle(longTitle)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Shop title must be no more than 100 characters long')
    })

    it('should reject titles with invalid characters', () => {
      const result = validateShopTitle('<script>alert("xss")</script>')
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('invalid characters'))).toBe(true)
    })
  })

  describe('validateItemPrice', () => {
    it('should accept valid prices', () => {
      const result = validateItemPrice(10.5)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject negative prices', () => {
      const result = validateItemPrice(-1)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Item price must be at least 0')
    })

    it('should reject prices that are too high', () => {
      const result = validateItemPrice(1000000)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Item price must be no more than 999999')
    })

    it('should reject non-numeric values', () => {
      const result = validateItemPrice(NaN)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Item price must be a valid number')
    })
  })

  describe('validateItemCategory', () => {
    it('should accept valid categories', () => {
      const result = validateItemCategory('Weapon')
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject invalid categories', () => {
      const result = validateItemCategory('InvalidCategory')
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('must be one of'))).toBe(true)
    })
  })

  describe('validateShop', () => {
    const validShop = {
      title: 'Test Shop',
      owner: 'Test Owner',
      items: [
        { name: 'Test Item', category: 'Weapon', price: 10, currency: 'GP' }
      ],
      theme: 'parchment'
    }

    it('should accept valid shops', () => {
      const result = validateShop(validShop)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject shops with invalid titles', () => {
      const invalidShop = { ...validShop, title: '' }
      const result = validateShop(invalidShop)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('Shop title'))).toBe(true)
    })

    it('should reject shops with too many items', () => {
      const itemsArray = Array(101).fill(validShop.items[0])
      const invalidShop = { ...validShop, items: itemsArray }
      const result = validateShop(invalidShop)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Shop can only have a maximum of 100 items.')
    })
  })

  describe('sanitizeString', () => {
    it('should remove HTML tags', () => {
      const result = sanitizeString('<script>alert("xss")</script>Hello')
      expect(result).toBe('alert(\"xss\")Hello')
    })

    it('should remove javascript protocols', () => {
      const result = sanitizeString('javascript:alert("xss")')
      expect(result).toBe('')
    })

    it('should remove event handlers', () => {
      const result = sanitizeString('onclick=alert("xss") Hello')
      expect(result).toBe('Hello')
    })

    it('should trim whitespace', () => {
      const result = sanitizeString('  Hello World  ')
      expect(result).toBe('Hello World')
    })

    it('should limit length as safety measure', () => {
      const longString = 'a'.repeat(1500)
      const result = sanitizeString(longString)
      expect(result.length).toBe(1000)
    })
  })
})
