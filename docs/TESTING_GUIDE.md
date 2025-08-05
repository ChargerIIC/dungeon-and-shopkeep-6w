# React Component Testing Guide

This guide explains the testing setup and best practices for testing React components in the Dungeon & Shopkeep project.

## Testing Stack

### Core Testing Libraries
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities focused on user behavior  
- **@testing-library/jest-dom**: Additional Jest matchers for DOM testing
- **@testing-library/user-event**: Advanced user interaction simulation

### Why This Stack?

1. **User-Focused Testing**: Tests how users actually interact with components
2. **Built-in Next.js Support**: Excellent integration with Next.js projects
3. **TypeScript Support**: Full TypeScript integration out of the box
4. **Firebase Mocking**: Easy to mock Firebase services for isolated testing
5. **Accessibility Testing**: Built-in accessibility testing capabilities

## Installation

Install the testing dependencies:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest jest jest-environment-jsdom
```

## Configuration Files

The testing setup includes these configuration files:

- `jest.config.js` - Jest configuration with Next.js integration
- `jest.setup.js` - Test setup and global mocks
- `__tests__/` - Directory containing all test files

## Writing Tests

### Test File Structure

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentName } from '@/components/component-name'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Testing Patterns

#### 1. Component Rendering
```typescript
it('renders component with correct text', () => {
  render(<PrintButton onPrint={mockFn} />)
  expect(screen.getByText('Print Shop')).toBeInTheDocument()
})
```

#### 2. User Interactions
```typescript
it('calls function when clicked', async () => {
  const user = userEvent.setup()
  const mockFn = jest.fn()
  
  render(<PrintButton onPrint={mockFn} />)
  await user.click(screen.getByRole('button'))
  
  expect(mockFn).toHaveBeenCalledTimes(1)
})
```

#### 3. Form Interactions
```typescript
it('updates input value', async () => {
  const user = userEvent.setup()
  render(<ShopCreator />)
  
  const input = screen.getByLabelText('Shop Title')
  await user.type(input, 'New Shop Name')
  
  expect(input).toHaveValue('New Shop Name')
})
```

#### 4. Conditional Rendering
```typescript
it('shows empty state when no items', () => {
  render(<ShopDisplay items={[]} />)
  expect(screen.getByText(/No items available/)).toBeInTheDocument()
})
```

#### 5. Props Testing
```typescript
it('applies disabled state correctly', () => {
  render(<PrintButton onPrint={mockFn} disabled={true} />)
  expect(screen.getByRole('button')).toBeDisabled()
})
```

## Testing Firebase Integration

### Mocking Firebase
Firebase is automatically mocked in `jest.setup.js`:

```typescript
jest.mock('@/lib/firebase', () => ({
  signInWithGoogle: jest.fn(),
  saveShop: jest.fn(),
  // ... other Firebase functions
}))
```

### Testing Firebase-dependent Components
```typescript
import { saveShop } from '@/lib/firebase'

it('saves shop when save button clicked', async () => {
  const mockSaveShop = saveShop as jest.MockedFunction<typeof saveShop>
  mockSaveShop.mockResolvedValue('shop-id')
  
  // Test implementation
})
```

## Common Testing Scenarios

### 1. Testing Theme Changes
```typescript
it('applies theme classes correctly', () => {
  const { rerender } = render(<ShopDisplay theme="parchment" />)
  // Assert parchment theme classes
  
  rerender(<ShopDisplay theme="tavern" />)
  // Assert tavern theme classes
})
```

### 2. Testing Error States
```typescript
it('displays error message on save failure', async () => {
  const mockSaveShop = saveShop as jest.MockedFunction<typeof saveShop>
  mockSaveShop.mockRejectedValue(new Error('Save failed'))
  
  // Trigger save action
  // Assert error message is displayed
})
```

### 3. Testing Loading States
```typescript
it('shows loading spinner during save', async () => {
  const mockSaveShop = saveShop as jest.MockedFunction<typeof saveShop>
  mockSaveShop.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
  
  // Trigger save action
  expect(screen.getByText('Saving...')).toBeInTheDocument()
})
```

### 4. Testing Authentication Flow
```typescript
it('shows sign in prompt when not authenticated', () => {
  // Mock unauthenticated state
  render(<ShopCreator />)
  expect(screen.getByText('Please sign in')).toBeInTheDocument()
})
```

## Running Tests

### Available Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage Goals

The configuration sets these coverage thresholds:
- **Branches**: 70%
- **Functions**: 70% 
- **Lines**: 70%
- **Statements**: 70%

## Best Practices

### 1. Test User Behavior, Not Implementation
```typescript
// ✅ Good - tests user behavior
expect(screen.getByText('Shop saved!')).toBeInTheDocument()

// ❌ Bad - tests implementation details
expect(component.state.isSaved).toBe(true)
```

### 2. Use Semantic Queries
```typescript
// ✅ Good - accessible and semantic
screen.getByRole('button', { name: /save shop/i })
screen.getByLabelText('Shop Title')

// ❌ Bad - fragile and not accessible
screen.getByClassName('save-button')
screen.getByTestId('shop-title')
```

### 3. Test Edge Cases
```typescript
it('handles empty shop title gracefully', () => {
  render(<ShopDisplay shopTitle="" />)
  expect(screen.getByText('Unnamed Shop')).toBeInTheDocument()
})
```

### 4. Use Descriptive Test Names
```typescript
// ✅ Good - clear and descriptive
it('displays error message when save fails due to network error')

// ❌ Bad - vague and unclear
it('handles error')
```

### 5. Group Related Tests
```typescript
describe('ShopDisplay', () => {
  describe('when rendering items', () => {
    // Tests for item rendering
  })
  
  describe('when no items provided', () => {
    // Tests for empty state
  })
})
```

## Testing Specific Components

### ShopDisplay Component
- ✅ Renders shop title and owner
- ✅ Displays items grouped by category
- ✅ Shows empty state when no items
- ✅ Applies theme styles correctly
- ✅ Handles print mode

### PrintButton Component
- ✅ Renders with correct text and icon
- ✅ Calls onPrint when clicked
- ✅ Respects disabled state
- ✅ Handles keyboard interactions

### Firebase Integration
- ✅ Handles authentication state changes
- ✅ Saves shop data correctly
- ✅ Loads user's saved shops
- ✅ Handles Firebase errors gracefully

## Debugging Tests

### Common Issues

1. **Component not rendering**: Check for missing props or context providers
2. **Elements not found**: Use `screen.debug()` to see rendered output
3. **Async operations**: Ensure you're using `await` with user events
4. **Firebase mocks**: Verify mocks are properly configured in jest.setup.js

### Debugging Commands
```typescript
// See what's rendered
screen.debug()

// Find elements by different queries
screen.logTestingPlaygroundURL() // Interactive query builder
```

## CI/CD Integration

The tests can be integrated into your GitHub Actions workflow:

```yaml
- name: Run tests
  run: npm test -- --coverage --watchAll=false

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Next Steps

1. **Install dependencies**: `npm install` (testing packages are already added to package.json)
2. **Run tests**: `npm test`
3. **Add more tests**: Use the examples as templates for testing your components
4. **Set up CI**: Add test running to your GitHub Actions workflow
5. **Monitor coverage**: Aim to maintain or improve the coverage thresholds

## Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Queries Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
