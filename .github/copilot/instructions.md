# Project Instructions for GitHub Copilot

## Project Overview
This is a Tabletop RPG utilities application built with Next.js, TypeScript, and Firebase. It provides tools for managing NPCs, shops, and encounters for tabletop role-playing games.

## Key Technologies
- Next.js 14+ with App Router
- TypeScript
- Firebase (Auth, Firestore, Storage)
- TailwindCSS
- Radix UI Components
- Lucide Icons
- NPM

## Code Style Guidelines
1. Use TypeScript for type safety
2. Follow functional component patterns
3. Use const assertions for static objects
4. Implement proper error handling with try/catch
5. Use proper type definitions for all props and state

## Component Structure
- Components should be organized by feature
- Shared components go in `/components`
- Pages use the Next.js App Router structure
- Models and types should be in `/lib/models`
- Firebase functions should be in `/lib/firebase.ts`

## Theme System
The application uses a consistent theme system across preview components:
- Parchment (default)
- Tavern
- Arcane
- Forest
- Dungeon

It also supports a Light, Dark, and System theme for the overall UI

## Type Patterns
\`\`\`typescript
interface BaseItem {
  id: string
  name: string
  description: string
}

interface BaseStats {
  STR: number
  DEX: number
  CON: number
  INT: number
  WIS: number
  CHA: number
}

interface BaseCombatStats {
  armorClass: number
  hitPoints: number
  speed: number
  proficiencyBonus: number
}
\`\`\`

## Firebase Pattern
- All Firebase operations should be wrapped in try/catch blocks
- Always check for authentication before database operations
- Use proper security rules validation
- Include proper typing for all Firebase operations

## Styling Patterns
- Use Tailwind classes with consistent naming
- Follow the theme configuration pattern
- Use the card-3d class for depth effects
- Include print styles for all components
- Use responsive design patterns

## Error Handling
\`\`\`typescript
try {
  // Firebase operations
} catch (error) {
  console.error("Operation failed:", error)
  throw new Error("Friendly error message")
}
\`\`\`

## Authentication Pattern
\`\`\`typescript
if (!auth.currentUser) {
  throw new Error("No authenticated user")
}
\`\`\`

## State Management
- Use React hooks for local state
- Implement proper loading states
- Handle authentication state globally
- Use proper form state management

## Print Optimization
- Include print-specific classes
- Optimize layouts for printing
- Handle page breaks appropriately
- Maintain theme consistency in print

## Security Considerations
- Validate all user input
- Implement proper Firebase security rules
- Handle authentication state securely
- Protect sensitive operations
- Only allow saving and loading operations for logged in users

## Performance Optimization
- Implement proper lazy loading
- Use proper image optimization
- Implement proper caching strategies
- Use proper bundling optimization

## Change Request Guidelines

### When Adding New Features
1. **Always search the codebase first** to understand existing patterns and components
2. **Follow the established theme system** - ensure new features support all 5 themes (Parchment, Tavern, Arcane, Forest, Dungeon)
3. **Implement Firebase integration** for save/load functionality following the existing patterns
4. **Add print optimization** - include print-specific styles and layouts
5. **Use existing UI components** from `/components/ui/` when possible
6. **Follow the established data models** in `/lib/models/` or extend them appropriately
7. **Add supporting unit tests where possible** - create test files in `__tests__/` directory following existing patterns
8. **Never delete package-lock.json** - preserve the npm lock file in all code changes

### For Form-Based Features
- Use controlled components with proper state management
- Implement real-time preview functionality where applicable
- Include form validation and error handling
- Follow the established input styling patterns
- Add loading states for async operations

### For Display Components
- Support all theme variations with proper color schemes
- Include responsive design for mobile and desktop
- Implement proper typography hierarchy
- Add print-specific styling with `@media print`
- Use the card-3d class for depth effects

### For Database Operations
- Always check authentication before operations
- Use proper TypeScript interfaces for data structures
- Implement proper error handling with user-friendly messages
- Include loading states and success feedback
- Follow the established Firebase patterns in `/lib/firebase.ts`

### Code Organization Rules
- New pages go in `/app/[feature-name]/page.tsx`
- Shared components go in `/components/`
- Feature-specific components can be co-located with pages
- Data models and types go in `/lib/models/`
- Utility functions go in `/lib/utils/`

### Testing Considerations
- Ensure all new features work in both authenticated and guest modes
- Test print functionality across different browsers
- Verify theme switching works correctly
- Test responsive design on mobile devices
- Validate Firebase operations with proper error scenarios
- **Write unit tests for new components and utilities** using Jest and React Testing Library
- **Follow existing test patterns** found in `__tests__/` directory
- **Test critical user flows** and edge cases

### Performance Guidelines
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Use proper bundling for large features
- Consider lazy loading for non-critical components

### Security Requirements
- Validate all user input on both client and server
- Implement proper Firebase security rules
- Never expose sensitive data in client-side code
- Use proper authentication checks for protected operations
- Sanitize user-generated content before display

### Accessibility Standards
- Include proper ARIA labels and roles
- Ensure keyboard navigation works correctly
- Maintain proper color contrast ratios
- Add alt text for all images
- Use semantic HTML elements

### Documentation Requirements
- Update README.md for major new features
- Add inline comments for complex logic
- Document new data models and interfaces
- Include usage examples for new components
- Update this instruction file for new patterns

### Package Management Rules
- **NEVER delete or modify package-lock.json** - this file ensures consistent dependency versions
- Use `npm install` for adding new dependencies
- Preserve existing dependency versions unless explicitly updating
- Document any new dependencies in pull requests
