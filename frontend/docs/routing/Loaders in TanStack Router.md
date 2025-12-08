# Loaders in TanStack Router

## Overview

Loaders in TanStack Router are functions that run before a component renders, allowing you to fetch data, validate user permissions, or perform any necessary setup before displaying the route. They provide type-safe data loading with built-in caching and error handling.

## Basic Loader Usage

A loader is defined within the `createFileRoute` configuration and returns data that becomes available to the route's component:

```tsx
// routes/posts.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts')({
  loader: () => fetchPosts(),
  component: PostsComponent,
})

function PostsComponent() {
  const posts = Route.useLoaderData() // Type-safe access to loaded data
  return (
    <div>
      {posts.map(post => <div key={post.id}>{post.title}</div>)}
  </div>
  )
}
```

## Dynamic Route Loaders with Parameters

Loaders can access route parameters to fetch specific data:

```tsx
// routes/posts/$postId.tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: ({ params: { postId } }) => fetchPostById(postId),
  component: PostComponent,
})

function PostComponent() {
  const { postId } = Route.useParams() // Type-safe parameter access
  const post = Route.useLoaderData() // Type-safe loaded data
  return <div>{post.title}</div>
}
```

## Search Parameter Integration with Loaders

You can validate search parameters and use them as loader dependencies:

```tsx
import { z } from 'zod'

const postsSearchSchema = z.object({
  offset: z.number().int().nonnegative().catch(0),
  limit: z.number().int().positive().catch(10),
  category: z.string().optional(),
})

export const Route = createFileRoute('/posts')({
  validateSearch: postsSearchSchema,
  loaderDeps: ({ search: { offset, limit, category } }) => ({ 
    offset, 
    limit, 
    category 
  }),
  loader: async ({ deps: { offset, limit, category } }) => 
    fetchPosts({ offset, limit, category }),
})
```

The `loaderDeps` function extracts specific values from search parameters and makes them available to the loader, ensuring that the loader re-runs when these dependencies change.

## Handling Optional Parameters

For routes with optional parameters, handle `undefined` values gracefully:

```tsx
export const Route = createFileRoute('/posts/{-$category}')({
  loader: async ({ params }) => {
    // params.category might be undefined
    return fetchPosts({ category: params.category || 'all' })
  },
})
```

## Integration with TanStack Query

For advanced data loading and caching, you can integrate with TanStack Query:

```tsx
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

const postsQuery = queryOptions({
  queryKey: ['posts'],
  queryFn: () => fetch('/api/posts').then((r) => r.json()),
})

export const Route = createFileRoute('/posts')({
  // Ensure the data is in the cache before render
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: PostsPage,
})

function PostsPage() {
  // Prefer suspense for best SSR + streaming behavior
  const { data } = useSuspenseQuery(postsQuery)
  return <div>{data.map((post: any) => post.title).join(', ')}</div>
}
```

## Deferred Data Loading

For performance optimization, you can defer slow-loading data:

```tsx
import { createFileRoute, defer } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  loader: async () => {
    // Fetch some slower data, but do not await it
    const slowDataPromise = fetchSlowData()

    // Fetch and await some data that resolves quickly
    const fastData = await fetchFastData()

    return {
      fastData,
      deferredSlowData: slowDataPromise,
    }
  },
  component: PostPage,
})

function PostPage() {
  const { fastData, deferredSlowData: slowPromise } = Route.useLoaderData()
  
  return (
    <div>
      <div>Fast data: {JSON.stringify(fastData)}</div>
      <Suspense fallback={<div>Loading slow data...</div>}>
        <SlowDataComponent promise={slowPromise} />
      </Suspense>
    </div>
  )
}
```

## Loading States and Pending Components

You can show loading indicators using the `pendingComponent` option:

```tsx
export const Route = createFileRoute('/posts')({
  loader: async () => {
    const posts = await fetchPosts()
    return { posts }
  },
  pendingComponent: () => <div>Loading posts...</div>,
  component: PostsComponent,
})
```

## Server-Safe Operations

Loaders run on both client and server, so avoid server-specific operations directly in the loader:

```tsx
// ❌ This runs on both client and server - potentially exposing secrets
export const Route = createFileRoute('/users')({
  loader: () => {
    const secret = process.env.SECRET // This will be available to the client!
    return fetch(`/api/users?key=${secret}`)
  }
})

// ✅ Use server functions for server-only operations
import { createServerFn } from '@tanstack/start'

const getUsersSecurely = createServerFn().handler(() => {
  const secret = process.env.SECRET // Server-only
  return fetch(`/api/users?key=${secret}`)
})

export const Route = createFileRoute('/users')({
  loader: () => getUsersSecurely(), // Isomorphic call to server function
})
```

## Loader Context and Abort Controller

Loaders receive a context object with useful utilities like `abortController`:

```tsx
export const Route = createFileRoute('/posts')({
  loader: ({ abortController, context: { queryClient } }) =>
    fetchPosts({
      // Use abortController.signal to cancel requests when route changes
      signal: abortController.signal,
    }),
})
```

## Working with Dynamic Routes and Links

When using loaders with dynamic routes and links, the combination provides a great user experience:

```tsx
// Route definition with loader
export const Route = createFileRoute('/products/$productId')({
  loader: async ({ params: { productId } }) => {
    const product = await fetchProduct(productId)
    return { product }
  },
  component: ProductComponent,
})

function ProductComponent() {
  const { product } = Route.useLoaderData()
  const { productId } = Route.useParams()
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      
      {/* Link to another dynamic route */}
      <Link to="/products/$productId" params={{ productId: 'another-id' }}>
        View Another Product
      </Link>
      
      {/* The new route will automatically trigger its own loader */}
    </div>
  )
}

// Index page with links to dynamic routes
function ProductsIndex() {
  const products = useProductsQuery()
  
  return (
    <div>
      {products.map(product => (
        <Link 
          key={product.id} 
          to="/products/$productId" 
          params={{ productId: product.id }}
          search={(prev) => ({ ...prev, category: 'electronics' })}
        >
          {product.name}
        </Link>
      ))}
    </div>
  )
}
```

## Type Safety Benefits

TanStack Router provides excellent type safety with loaders:

```tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    // params.postId is automatically typed as string
    const post = await fetchPost(params.postId)
    return { post } // Return type is inferred
  },
  component: PostComponent,
})

function PostComponent() {
  // post is automatically typed based on loader return
  const { post } = Route.useLoaderData()
  // postId is automatically typed as string
  const { postId } = Route.useParams()
}
```

## Error Handling

Loaders support error handling through thrown errors:

```tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params: { postId } }) => {
    const post = await fetchPostById(postId)
    
    if (!post) {
      throw new Error('Post not found')
    }
    
    return post
  },
})
```

## Testing Loaders

Loaders can be tested using testing libraries:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithFileRoutes } from '../test/file-route-utils'

describe('Route Loaders', () => {
  it('should load data for route with loader', async () => {
    const mockFetchPost = vi.fn().mockResolvedValue({
      id: '123',
      title: 'Test Post',
      content: 'Test content',
    })

    vi.mock('../api/posts', () => ({
      fetchPost: mockFetchPost,
    }))

    renderWithFileRoutes(<div />, {
      initialLocation: '/posts/123',
    })

    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument()
    })

    expect(mockFetchPost).toHaveBeenCalledWith('123')
  })
})
```

## Performance Considerations

1. **Code Splitting**: You can split loaders into separate chunks for performance:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      codeSplittingOptions: {
        defaultBehavior: [
          ['loader'], // The loader will be in its own chunk
          ['component'],
        ]
      }
    })
  ]
})
```

2. **Avoid Complex Type Inference**: For performance with large data structures:

```tsx
// Optimize TypeScript performance by deferring complex type inference
export const Route = createFileRoute('/posts/$postId/deep')({
  loader: async ({ context: { queryClient }, params: { postId } }) => {
    await queryClient.ensureQueryData(postQueryOptions(postId))
  },
  component: PostDeepComponent,
})
```

## Summary

Loaders in TanStack Router provide a powerful and type-safe way to load data before rendering components. They integrate seamlessly with:

- Dynamic routes and parameters
- Search parameter validation
- TanStack Query for advanced caching
- Server-side rendering
- Error handling
- Performance optimization

The combination of loaders with dynamic routing and links creates a smooth user experience while maintaining type safety and good performance.