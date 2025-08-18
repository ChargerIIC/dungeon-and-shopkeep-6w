import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PrintButton } from '@/components/print-button'

describe('PrintButton', () => {
  const mockOnPrint = jest.fn()

  beforeEach(() => {
    mockOnPrint.mockClear()
  })

  it('renders print button with correct text', () => {
    render(<PrintButton onPrint={mockOnPrint} />)
    
    expect(screen.getByRole('button', { name: /print card/i })).toBeInTheDocument()
    expect(screen.getByText('Print Card')).toBeInTheDocument()
  })

  it('displays printer icon', () => {
    render(<PrintButton onPrint={mockOnPrint} />)
    
    // Check for the printer icon (SVG element)
    const icon = screen.getByRole('button').querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('calls onPrint when clicked', async () => {
    const user = userEvent.setup()
    render(<PrintButton onPrint={mockOnPrint} />)
    
    const button = screen.getByRole('button', { name: /print card/i })
    await user.click(button)
    
    expect(mockOnPrint).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<PrintButton onPrint={mockOnPrint} disabled={true} />)
    
    const button = screen.getByRole('button', { name: /print card/i })
    expect(button).toBeDisabled()
  })

  it('does not call onPrint when disabled and clicked', async () => {
    const user = userEvent.setup()
    render(<PrintButton onPrint={mockOnPrint} disabled={true} />)
    
    const button = screen.getByRole('button', { name: /print card/i })
    await user.click(button)
    
    expect(mockOnPrint).not.toHaveBeenCalled()
  })

  it('has correct CSS classes', () => {
    render(<PrintButton onPrint={mockOnPrint} />)
    
    const button = screen.getByRole('button', { name: /print card/i })
    expect(button).toHaveClass('flex', 'items-center', 'space-x-2')
  })

  it('handles keyboard interaction', async () => {
    const user = userEvent.setup()
    render(<PrintButton onPrint={mockOnPrint} />)
    
    const button = screen.getByRole('button', { name: /print card/i })
    button.focus()
    await user.keyboard('{Enter}')
    
    expect(mockOnPrint).toHaveBeenCalledTimes(1)
  })
})
