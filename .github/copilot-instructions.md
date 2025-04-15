# Best Practices Guide Application

## Tech Stack Overview
- Astro
- Preact
- Nanostores
- Tailwind CSS
- Postgres

# Vite / React / Tailwind / Nanostores / Astro Best Practices
This guide outlines **best practices** for building a **Vite / React / Tailwind / Nanostores / Astro** application. The goal is **readability and maintainability**, minimizing abstraction to keep the codebase clear.

## 🗂️ Project Structure
Keep a **flat and predictable** folder structure:

```
src/
  /components/    # Reusable UI components (buttons, inputs, cards, etc.)
  /pages/        # Page components (mapped to routes)
  /stores/       # Nanostores for state management
  /hooks/        # Custom React hooks (if needed)
  /utils/        # Simple utility functions (date formatting, API requests, etc.)
  /assets/       # Static assets (images, icons, etc.)
  /styles/       # Tailwind config and global CSS files (if any)
  main.tsx      # Entry point
  app.tsx       # Root component
  routes.tsx    # Centralized route definitions
```

📌 **Rules**:
- **Flat is better than nested.**
- **No generic 'helpers' folder.**
- **Keep components close to where they are used.**

## ❄ React Component Best Practices

### ✅ When to Create a New Component

Create a new component when:
1. **If the JSX exceeds ~30 lines**
   - Long components are harder to maintain and understand
   - Breaking down large components improves readability and reusability

2. **If the UI is used more than once**
   - Reusable components reduce code duplication
   - Makes the codebase more maintainable

3. **If it has a clear single responsibility**
   - Following the Single Responsibility Principle
   - Each component should do one thing and do it well

### Example: Component Extraction

❌ **BAD: Bloated Component**
```tsx
export function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Click Me</button>
      <table>...</table>
    </div>
  );
}
```

✅ **GOOD: Extracted Components**
```tsx
export function Dashboard() {
  return (
    <div className="p-4">
      <Title>Dashboard</Title>
      <ActionButton>Click Me</ActionButton>
      <DataTable />
    </div>
  );
}

// Components are broken down into smaller, focused pieces
const Title = ({ children }) => (
  <h1 className="text-2xl font-bold">{children}</h1>
);

const ActionButton = ({ children }) => (
  <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
    {children}
  </button>
);

const DataTable = () => (
  <table>...</table>
);
```

## Component Creation Guidelines

### When to Create a New Component
- Create a new component when:
  - UI element will be reused in multiple places
  - A section of UI exceeds 100 lines of code
  - A section has its own distinct responsibility or purpose
  - Logic for a section becomes complex (more than 3 state variables or hooks)
  - Component has a specific interaction pattern (dropdown, modal, etc.)

### When NOT to Create a New Component
- Avoid creating components that are:
  - Used only once and very simple (under 50 lines)
  - Too granular (e.g., a single styled button with no special behavior)
  - Breaking a component only for the sake of smaller files

### Component Types
- **Astro Components** (`.astro`): Use for:
  - Layout components
  - Static content
  - Components that don't need client-side interactivity
  
- **React Components** (`.jsx`/`.tsx`): Use for:
  - Interactive UI elements
  - Components that need to maintain state
  - Sections requiring event handlers and user interactions

## Nanostores Best Practices

### Store Organization
- Create a separate store file for each domain/feature
- Export actions and getters, not the raw store
- Group related stores in directories by feature

### Keep Stores Simple
- Focus each store on a single responsibility
- Use atomic stores for primitive values when possible
- Use `map` stores for related data structures
- Create computed values with `computed` for derived state
- Separate UI state from domain data

### Store Actions Pattern
```javascript
// userStore.js
import { atom, map } from 'nanostores';

// Create the store
export const userStore = map({
  user: null,
  isLoading: false,
  error: null
});

// Export actions, not the raw store
export function setUser(userData) {
  userStore.setKey('user', userData);
}

export function clearUser() {
  userStore.setKey('user', null);
}

export async function fetchUser(id) {
  userStore.setKey('isLoading', true);
  userStore.setKey('error', null);
  
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    userStore.setKey('user', data);
  } catch (error) {
    userStore.setKey('error', error.message);
  } finally {
    userStore.setKey('isLoading', false);
  }
}
```

## Markup and Tailwind CSS Guidelines

### Keep Markup Simple
- Aim for a maximum nesting depth of 3-4 levels
- Avoid excessive conditional rendering that creates multiple levels of nesting
- Use sensible defaults for CSS with minimal override complexity
- Leverage Astro's slot system for flexible component composition

### Tailwind Best Practices
- Use Tailwind's utility classes directly in HTML/JSX for most styling
- Extract reusable patterns to components rather than creating custom classes
- For complex components, consider grouping Tailwind classes with template literals
- Utilize Tailwind's `@apply` directive sparingly and only for highly reused patterns
- Create consistent spacing, color and typography systems through Tailwind configuration

### Component Composition Example
```jsx
// Bad: Overly nested and complex
<div className="p-4 border rounded-lg shadow-md">
  <div className="flex flex-col space-y-4">
    <div className="bg-gray-100 p-3 rounded">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        {isEditable && (
          <div className="flex space-x-2">
            <button className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
            <button className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

// Good: Flatter, component-based approach
<Card>
  <CardHeader>
    <h3 className="text-lg font-bold">{title}</h3>
    {isEditable && <ActionButtons actions={['edit', 'delete']} />}
  </CardHeader>
</Card>
```

## Astro and React Integration

### Astro Components Best Practices
- Use Astro for static or mostly-static pages and layouts
- Pass data to React components as props
- Take advantage of Astro's built-in data fetching for SEO-critical content
- Add client directives only where needed:
  - `client:load` - Hydrate component immediately on page load
  - `client:idle` - Hydrate once the browser is idle
  - `client:visible` - Hydrate once the component is visible in viewport
  - `client:only` - Only renders on client-side, never SSR

### React with Nanostores in Astro
- Use `@nanostores/react` for React components to access stores
- Import `useStore` hook to subscribe components to store changes
- Keep React components focused on UI rendering
- Move business logic and data fetching to store actions

```jsx
// React component with nanostores
import { useStore } from '@nanostores/react';
import { todoStore, addTodo, toggleTodo } from '../stores/todoStore';

function TodoList() {
  const todos = useStore(todoStore);
  const [newTodo, setNewTodo] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo('');
    }
  };
  
  return (
    // Component JSX
  );
}
```

## Code Elegance Guidelines

### Simplicity Principles
- Functions should generally be under 20 lines
- Components should generally be under 150 lines
- Aim for component props to be under 7 items
- Use destructuring for cleaner component interfaces
- Group related state items in meaningful objects
- Follow the principle of least knowledge (components only know what they need)

### Performance Considerations
- Implement lazy loading for heavier React components with `client:only` when needed
- Use Island Architecture to minimize JavaScript sent to the client
- Leverage Astro's static generation for content that doesn't change frequently
- Build component-specific stores to avoid unnecessary re-renders

### Code Organization
- Default export for the main component in a file
- Named exports for utility functions
- Group related hooks at the top of a component
- Keep event handlers inside the component, but separate from the JSX
