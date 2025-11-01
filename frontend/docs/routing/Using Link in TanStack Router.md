# Using Link in TanStack Router

## Overview

The `Link` component is the primary way to navigate between routes in TanStack Router. It provides type-safe navigation and supports various advanced features like search parameter management, active state styling, and custom link components.

## Basic Usage

The `Link` component is imported from `@tanstack/react-router` and is used for declarative navigation:

```tsx
import { Link } from '@tanstack/react-router'

// Basic link
<Link to="/about">About</Link>

// Link to dynamic route with parameters
<Link to="/posts/$postId" params={{ postId: '123' }}>View Post</Link>

// Link with state
<Link to="/posts" state={{ from: 'home' }}>Posts</Link>
```

## Advanced Link Features

### Search Parameters

You can manage search parameters with the `search` prop to modify query parameters during navigation:

```tsx
// Replace all search parameters
<Link to="/products" search={{ category: 'electronics', page: 1 }}>
  Electronics
</Link>

// Preserve all current search parameters
<Link to="/products" search={true}>
  View Products (Keep Filters)
</Link>

// Update specific search parameters while preserving others
<Link 
  to="/somewhere/$somewhereId"
  params={{ somewhereId: 'baz' }}
  search={(prev) => ({ ...prev, foo: 'bar' })}
>
  Click me
</Link>
```

### Active State Styling

The Link component provides options to apply different styles based on whether the link is active (navigated to):

```tsx
// Apply active styles
<Link
  to="/blog/post/$postId"
  params={{ postId: 'my-first-blog-post' }}
  activeProps={{
    style: { fontWeight: 'bold' },
  }}
>
  Section 1
</Link>

// Exact path matching
<Link to="/" activeOptions={{ exact: true }}>
  Home
</Link>

// Pass isActive to children function for dynamic styling
<Link to="/blog/post">
  {({ isActive }) => (
    <>
      <span>My Blog Post</span>
      <icon className={isActive ? 'active' : 'inactive'} />
    </>
  )}
</Link>
```

## Type-Safe Link Options

TanStack Router provides the `linkOptions` function to create type-safe and reusable link configurations:

```tsx
import { linkOptions } from '@tanstack/react-router'

// Create type-safe link options
const dashboardLinkOptions = linkOptions({
  to: '/dashboard',
  search: { search: '' },
})

function DashboardComponent() {
  return <Link {...dashboardLinkOptions} />
}

// Use with an array of navigation links for navigation bars
const options = linkOptions([
  {
    to: '/dashboard',
    label: 'Summary',
    activeOptions: { exact: true },
  },
  {
    to: '/dashboard/invoices',
    label: 'Invoices',
  },
  {
    to: '/dashboard/users',
    label: 'Users',
  },
])

function DashboardComponent() {
  return (
    <>
      {/* Render navigation links */}
      {options.map((option) => (
        <Link
          {...option}
          key={option.to}
          activeProps={{ className: `font-bold` }}
          className="p-2"
        >
          {option.label}
        </Link>
      ))}
      <Outlet />
    </>
  )
}
```

The `linkOptions` function offers several benefits:
- Eager type checking for link configurations
- Better reusability across multiple navigation methods
- Consistent type safety when navigating with links, programmatic navigation, or redirects

## Custom Link Components

You can create custom link components that integrate with TanStack Router's functionality:

```tsx
import * as React from 'react'
import { createLink, LinkComponent } from '@tanstack/react-router'

// Basic custom link component
interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  // Add any additional props you want to pass to the anchor element
}

const BasicLinkComponent = React.forwardRef<HTMLAnchorElement, BasicLinkProps>(
  (props, ref) => {
    return (
      <a ref={ref} {...props} className={'block px-3 py-2 text-blue-700'} />
    )
  },
)

const CreatedLinkComponent = createLink(BasicLinkComponent)

export const CustomLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={'intent'} {...props} />
}
```

### Integrating with UI Libraries

TanStack Router works well with popular UI libraries like Material-UI, Chakra UI, and Mantine:

```tsx
// MUI Button as Link
import React from 'react';
import { createLink } from '@tanstack/react-router';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import type { LinkComponent } from '@tanstack/react-router';

interface MUIButtonLinkProps extends ButtonProps<'a'> {
  // Add any additional props you want to pass to the Button
}

const MUIButtonLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  MUIButtonLinkProps
>((props, ref) => <Button ref={ref} component="a" {...props} />);

const CreatedButtonLinkComponent = createLink(MUIButtonLinkComponent);

export const CustomButtonLink: LinkComponent<typeof MUIButtonLinkComponent> = (
  props,
) => {
  return <CreatedButtonLinkComponent preload={'intent'} {...props} />;
};
```

## Link Options Configuration

The Link component accepts various options for advanced behavior:

```tsx
<Link 
  to="/example"
  target="_blank"                    // Standard anchor target
  preload="intent"                   // Preload on hover (improves perceived performance)
  preloadDelay={500}                 // Delay for preload (in milliseconds)
  disabled={false}                   // Disable the link
  activeOptions={{ 
    exact: false,                    // Match exact path
    includeHash: false,              // Include hash in matching
    includeSearch: true              // Include search params in matching
  }}
>
  Link with options
</Link>
```

## Reusing Link Options

Link options created with `linkOptions` can be reused across different navigation methods:

```tsx
const dashboardLinkOptions = linkOptions({
  to: '/dashboard',
  search: { search: '' },
})

function DashboardComponent() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Used in programmatic navigation */}
      <button onClick={() => navigate(dashboardLinkOptions)} />
      
      {/* Used in Link component */}
      <Link {...dashboardLinkOptions} />
      
      {/* Can also be used in redirects */}
      {/* throw redirect(dashboardLinkOptions) */}
    </div>
  )
}
```

## Best Practices

### 1. Preserve Search Parameters When Needed

When navigating between routes that should share context, preserve existing search parameters:

```tsx
// ✅ Good: Preserve current search params and add new ones
<Link to="/products" search={(prev) => ({ ...prev, page: 1 })}>
  Reset to Page 1
</Link>

// ❌ Avoid: This will lose all other search params
<Link to="/products" search={{ page: 1 }}>
  Products Page 1
</Link>
```

### 2. Use Route-Specific Hooks

For better performance, use route-specific hooks instead of global ones:

```tsx
// Instead of global hooks
const navigate = useNavigate({ from: Route.fullPath })
const params = useParams({ from: Route.fullPath })

// Use route-specific hooks (more efficient)
const navigate = Route.useNavigate()
const params = Route.useParams()
```

### 3. Handle Optional Parameters

For routes with optional parameters, use the `{-` syntax in your route definition:

```tsx
// For a route with optional category: /posts/{-$category}
<Link 
  to="/posts/{-$category}"
  params={{ category: 'tech' }} // Include category
>
  Tech Posts
</Link>

<Link 
  to="/posts/{-$category}"
  params={{}} // Omit category (not undefined)
>
  All Posts
</Link>
```

### 4. Type Safety with Zod Validation

When using search parameter validation with Zod, you get full type safety in your links:

```tsx
// Route definition with Zod validation
import { z } from 'zod'

const postSearchSchema = z.object({
  showComments: z.boolean().optional().default(true),
  commentsFilter: z.enum(['newest', 'popular']).optional().default('newest'),
})

export const Route = createFileRoute('/posts/$postId')({
  validateSearch: postSearchSchema,
  component: PostComponent,
})

// Link with full type safety
<Link
  to="/posts/$postId"
  params={{ postId: '123' }}
  search={{ 
    showComments: true,
    commentsFilter: 'popular' 
  }}
>
  View Post
</Link>
```

## Migration from Other Routers

If migrating from other routers like React Router, the main change is updating import paths and props:

```tsx
// Before (React Router)
import { Link } from 'react-router-dom'
<Link to="/dashboard">Dashboard</Link>

// After (TanStack Router)
import { Link } from '@tanstack/react-router'
<Link to="/dashboard">Dashboard</Link>
```

## Conclusion

The Link component in TanStack Router provides a powerful and type-safe way to handle navigation in your React applications. With features like search parameter management, active state styling, type-safe link options, and custom component integration, it offers a comprehensive solution for all navigation needs in modern web applications.