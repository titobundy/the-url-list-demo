# Best Practices Guide for Astro + React + Tailwind + Nanostores Application

## Tech Stack Overview
- Astro: Main framework for static site generation and routing
- React: Component library for interactive UI elements
- Tailwind CSS: Utility-first styling
- Nanostores: State management
- Vite: Build tool and development server

## Project Structure
```
src/
├── components/      # Shared components (both Astro and React)
│   ├── astro/      # Astro-specific components
│   └── react/      # React components
├── layouts/        # Page layouts and templates
├── pages/          # Route-based components
├── stores/         # Nanostore definitions
├── styles/         # Global styles and Tailwind config
├── utils/          # Shared utility functions
└── types/          # TypeScript type definitions
```

## Component Architecture

### Astro Components
- Use `.astro` files for static or minimally interactive components
- Leverage Astro's partial hydration with `client:*` directives
- Keep static content in Astro components for better performance
- Example:
  ```astro
  ---
  // Use TypeScript for props
  interface Props {
    title: string;
  }
  const { title } = Astro.props;
  ---
  <h1>{title}</h1>
  ```

### React Components
- Use for interactive UI elements that require client-side JavaScript
- Keep components focused and small
- Use TypeScript for prop definitions
- Example naming: `UserProfile.tsx`, `CartButton.tsx`

## State Management with Nanostores

1. **Store Organization**
   - Create atomic stores for different domains
   - Keep stores in `src/stores/` directory
   - Use TypeScript for store value types
   ```typescript
   // src/stores/userStore.ts
   import { atom } from 'nanostores';
   interface User {
     id: string;
     name: string;
   }
   export const userStore = atom<User | null>(null);
   ```

2. **Store Usage**
   - Import stores only where needed
   - Use computed stores for derived state
   - Prefer multiple small stores over large stores

## Styling Best Practices

1. **Tailwind Usage**
   - Use Tailwind's built-in responsive classes
   - Create component-specific styles in the component file
   - Maintain a consistent color palette in `tailwind.config.js`
   ```js
   theme: {
     extend: {
       colors: {
         primary: {...},
         secondary: {...}
       }
     }
   }
   ```

2. **CSS Organization**
   - Use `@apply` only for complex, reusable patterns
   - Maintain global styles in `src/styles/global.css`
   - Use CSS modules for React components when needed

## Performance Optimization

1. **Astro Islands**
   - Use appropriate client directives:
     - `client:load` for above-the-fold interactive components
     - `client:visible` for below-the-fold components
     - `client:idle` for non-critical components

2. **Code Splitting**
   - Use dynamic imports for large React components
   - Leverage Astro's automatic code splitting
   - Split Nanostores into domain-specific modules

## Type Safety

1. **TypeScript Configuration**
   ```typescript
   // tsconfig.json best practices
   {
     "compilerOptions": {
       "strict": true,
       "allowJs": false,
       "isolatedModules": true
     }
   }
   ```

2. **Type Definitions**
   - Define interfaces for all props
   - Use type inference where possible
   - Create shared types in `src/types/`

## Integration Patterns

1. **Astro-React Integration**
   - Use Astro components for page structure
   - Use React for interactive widgets
   - Pass data from Astro to React components properly:
   ```astro
   ---
   import ReactComponent from '../components/react/ReactComponent';
   const data = await fetchData();
   ---
   <ReactComponent client:load data={data} />
   ```

2. **State Management**
   - Use Nanostores for cross-component state
   - Use local state for component-specific state
   - Share stores between Astro and React components

## Development Workflow

1. **Development Commands**
   ```bash
   npm run dev      # Start development server
   npm run build    # Build for production
   npm run preview  # Preview production build
   ```

2. **Code Quality**
   - Use ESLint with recommended React and TypeScript rules
   - Implement Prettier for consistent formatting
   - Run type checking before commits

## Testing Strategy
1. **Component Testing**
   - Test React components with Vitest
   - Test Astro components with Playwright
   - Write unit tests for store logic

2. **E2E Testing**
   - Use Playwright for end-to-end tests
   - Test critical user paths
   - Verify SSR functionality

## Documentation

1. **Component Documentation**
   - Document props with TypeScript interfaces
   - Add JSDoc comments for complex functions
   - Include usage examples

2. **Store Documentation**
   - Document store purpose and shape
   - Include subscription patterns
   - Document computed store dependencies

## Security Considerations
- Implement proper CSP headers in Astro config
- Sanitize user input
- Use environment variables for sensitive data
- Keep dependencies updated

## SEO and Metadata
- Use Astro's built-in SEO features
- Implement proper meta tags
- Use semantic HTML
- Optimize for Core Web Vitals

## Error Handling
- Implement error boundaries in React components
- Use type-safe error handling
- Provide fallback UI for failed loads
- Log errors appropriately

Remember:
- Favor simplicity over complexity
- Keep abstractions minimal
- Maintain consistent patterns
- Document architectural decisions

Review and update these practices as the project evolves and new features become available in the tech stack.