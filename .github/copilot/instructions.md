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
