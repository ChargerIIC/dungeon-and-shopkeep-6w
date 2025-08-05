import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ShopDisplay } from '@/components/shop-display'

// Mock data for testing
const mockShopData = {
  shopTitle: 'Test Emporium',
  ownerName: 'Test Merchant',
  items: [
    {
      id: '1',
      name: 'Test Sword',
      category: 'Weapon',
      price: 15,
      currency: 'GP'
    },
    {
      id: '2',
      name: 'Test Armor',
      category: 'Armor',
      price: 25,
      currency: 'GP'
    },
    {
      id: '3',
      name: 'Healing Potion',
      category: 'Potions',
      price: 50,
      currency: 'SP'
    }
  ],
  theme: 'parchment'
}

describe('ShopDisplay', () => {
  it('renders shop title and owner', () => {
    render(
      <ShopDisplay
        shopTitle={mockShopData.shopTitle}
        ownerName={mockShopData.ownerName}
        items={mockShopData.items}
        theme={mockShopData.theme}
      />
    )

    expect(screen.getByText('Test Emporium')).toBeInTheDocument()
    expect(screen.getByText(/Proprietor: Test Merchant/i)).toBeInTheDocument()
  })

  it('displays all shop items with correct information', () => {
    render(
      <ShopDisplay
        shopTitle={mockShopData.shopTitle}
        ownerName={mockShopData.ownerName}
        items={mockShopData.items}
        theme={mockShopData.theme}
      />
    )

    // Check if all items are displayed
    expect(screen.getByText('Test Sword')).toBeInTheDocument()
    expect(screen.getByText('Test Armor')).toBeInTheDocument()
    expect(screen.getByText('Healing Potion')).toBeInTheDocument()

    // Check if prices are displayed
    expect(screen.getByText('15 GP')).toBeInTheDocument()
    expect(screen.getByText('25 GP')).toBeInTheDocument()
    expect(screen.getByText('50 SP')).toBeInTheDocument()
  })

  it('groups items by category', () => {
    render(
      <ShopDisplay
        shopTitle={mockShopData.shopTitle}
        ownerName={mockShopData.ownerName}
        items={mockShopData.items}
        theme={mockShopData.theme}
      />
    )

    // Check if category headers are displayed
    expect(screen.getByText('Weapon')).toBeInTheDocument()
    expect(screen.getByText('Armor')).toBeInTheDocument()
    expect(screen.getByText('Potions')).toBeInTheDocument()
  })

  it('displays empty state when no items provided', () => {
    render(
      <ShopDisplay
        shopTitle={mockShopData.shopTitle}
        ownerName={mockShopData.ownerName}
        items={[]}
        theme={mockShopData.theme}
      />
    )

    expect(screen.getByText(/No items available in this shop yet/i)).toBeInTheDocument()
  })

  it('displays default text when shop title is empty', () => {
    render(
      <ShopDisplay
        shopTitle=""
        ownerName={mockShopData.ownerName}
        items={mockShopData.items}
        theme={mockShopData.theme}
      />
    )

    expect(screen.getByText('Unnamed Shop')).toBeInTheDocument()
  })

  it('displays default text when owner name is empty', () => {
    render(
      <ShopDisplay
        shopTitle={mockShopData.shopTitle}
        ownerName=""
        items={mockShopData.items}
        theme={mockShopData.theme}
      />
    )

    expect(screen.getByText(/Proprietor: Unknown Merchant/i)).toBeInTheDocument()
  })

  it('applies theme classes correctly', () => {
    const { container } = render(
      <ShopDisplay
        shopTitle={mockShopData.shopTitle}
        ownerName={mockShopData.ownerName}
        items={mockShopData.items}
        theme="tavern"
      />
    )

    // Check if theme-specific classes are applied
    const cardElement = container.querySelector('[data-slot="card"]')
    expect(cardElement).toBeInTheDocument()
  })

  it('renders category icons', () => {
    render(
      <ShopDisplay
        shopTitle={mockShopData.shopTitle}
        ownerName={mockShopData.ownerName}
        items={mockShopData.items}
        theme={mockShopData.theme}
      />
    )

    // Check for SVG icons (category icons)
    const icons = screen.queryAllByRole('img')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('handles print mode correctly', () => {
    const { container } = render(
      <ShopDisplay
        shopTitle={mockShopData.shopTitle}
        ownerName={mockShopData.ownerName}
        items={mockShopData.items}
        theme={mockShopData.theme}
        isPrintMode={true}
      />
    )

    const printElement = container.querySelector('.print-mode')
    expect(printElement).toBeInTheDocument()
  })

  it('handles multiple items in same category', () => {
    const itemsWithDuplicateCategory = [
      ...mockShopData.items,
      {
        id: '4',
        name: 'Magic Sword',
        category: 'Weapon',
        price: 100,
        currency: 'GP'
      }
    ]

    render(
      <ShopDisplay
        shopTitle={mockShopData.shopTitle}
        ownerName={mockShopData.ownerName}
        items={itemsWithDuplicateCategory}
        theme={mockShopData.theme}
      />
    )

    // Should only have one "Weapon" category header
    const weaponHeaders = screen.getAllByText('Weapon')
    expect(weaponHeaders).toHaveLength(1)

    // But should display both weapons
    expect(screen.getByText('Test Sword')).toBeInTheDocument()
    expect(screen.getByText('Magic Sword')).toBeInTheDocument()
  })
})
