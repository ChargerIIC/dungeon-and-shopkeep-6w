// __tests__/components/theme-toggle.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useTheme } from 'next-themes'
import { ThemeToggle } from '@/components/theme-toggle'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>

describe('ThemeToggle', () => {
  const mockSetTheme = jest.fn()

  beforeEach(() => {
    mockSetTheme.mockClear()
    mockUseTheme.mockReturnValue({
      setTheme: mockSetTheme,
      theme: 'light',
      themes: ['light', 'dark', 'system'],
      resolvedTheme: 'light',
      systemTheme: 'light'
    } as any)
  })

  it('renders theme toggle button with accessibility label', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Toggle theme')
  })

  it('displays sun and moon icons with proper transitions', () => {
    render(<ThemeToggle />)
    
    // Use data-testid or more reliable selectors
    const sunIcon = screen.getByTestId('sun-icon') || document.querySelector('[data-lucide="sun"]')
    const moonIcon = screen.getByTestId('moon-icon') || document.querySelector('[data-lucide="moon"]')
    
    expect(sunIcon).toBeInTheDocument()
    expect(moonIcon).toBeInTheDocument()
  })

  it('opens dropdown menu when button is clicked', async () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Wait for dropdown to appear
    await waitFor(() => {
      expect(screen.getByText('Light')).toBeInTheDocument()
      expect(screen.getByText('Dark')).toBeInTheDocument()
      expect(screen.getByText('System')).toBeInTheDocument()
    })
  })

  it('calls setTheme with correct value when light theme is selected', async () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Wait for dropdown to open
    await waitFor(() => {
      expect(screen.getByText('Light')).toBeInTheDocument()
    })
    
    const lightOption = screen.getByText('Light')
    fireEvent.click(lightOption)
    
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('calls setTheme with correct value when dark theme is selected', async () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Dark')).toBeInTheDocument()
    })
    
    const darkOption = screen.getByText('Dark')
    fireEvent.click(darkOption)
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('calls setTheme with correct value when system theme is selected', async () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('System')).toBeInTheDocument()
    })
    
    const systemOption = screen.getByText('System')
    fireEvent.click(systemOption)
    
    expect(mockSetTheme).toHaveBeenCalledWith('system')
  })

  it('applies correct CSS classes for styling', () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    // Check for classes that actually exist in your component
    expect(button).toHaveClass('inline-flex')
    // Add other classes that your component actually uses
  })

  it('handles keyboard navigation for accessibility', async () => {
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    
    // Test Enter key opens dropdown
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
    
    await waitFor(() => {
      expect(screen.getByText('Light')).toBeInTheDocument()
    })
    
    // Test Escape key closes dropdown
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    
    await waitFor(() => {
      expect(screen.queryByText('Light')).not.toBeInTheDocument()
    })
  })
})