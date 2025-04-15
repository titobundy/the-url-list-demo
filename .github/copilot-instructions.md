# Best Practices Guide Application

## Tech Stack Overview
- Astro
- Preact
- Nanostores
- Tailwind CSS
- Postgres

# Vite / React / Tailwind / Nanostores / Astro Best Practices
This guide outlines **best practices** for building a **Vite / React / Tailwind / Nanostores / Astro** application. The goal is **readability and maintainability**, minimizing abstraction to keep the codebase clear.

## Project Structure
Keep a **flat and predictable** folder structure:

```
src/
├── components/    # Reusable UI components (buttons, inputs, cards, etc.)
├── pages/        # Page components (mapped to routes)
├── stores/       # Nanostores for state management
├── hooks/        # Custom React hooks (if needed)
├── utils/        # Simple utility functions (date formatting, API requests, etc.)
├── assets/       # Static assets (images, icons, etc.)
├── styles/       # Tailwind config and global CSS files (if any)
├── main.tsx      # Entry point
├── app.tsx       # Root component
└── routes.tsx    # Centralized route definitions
```

Rules:
- **Flat is better than nested.**
- **No generic 'helpers' folder.**
- **Keep components close to where they are used.**

## React Component Best Practices

### When to Create a New Component

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

### Best Practices for Components

1. **Keep Components Pure**
   - Avoid side effects in render
   - Make components predictable

2. **Use TypeScript for Props**
   ```tsx
   interface TitleProps {
     children: React.ReactNode;
     className?: string;
   }

   const Title = ({ children, className }: TitleProps) => (
     <h1 className={clsx("text-2xl font-bold", className)}>
       {children}
     </h1>
   );
   ```

3. **Proper Props Naming**
   - Use clear, descriptive prop names
   - Follow consistent naming conventions

4. **Component Organization**
   - Keep related components together
   - Use index files for exports
   - Follow the flat folder structure

5. **Performance Considerations**
   - Use memo() for expensive computations
   - Avoid unnecessary re-renders
   - Lazy load when appropriate

Remember:
- Components should be easy to understand
- Follow consistent patterns
- Keep the code DRY (Don't Repeat Yourself)
- Prioritize readability over cleverness