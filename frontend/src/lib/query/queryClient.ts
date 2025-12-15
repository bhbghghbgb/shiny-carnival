import { QueryClient } from '@tanstack/react-query';

/**
 * QueryClient instance với cấu hình mặc định
 * 
 * Cấu hình:
 * - staleTime: 5 phút - data được coi là fresh trong 5 phút
 * - gcTime: 10 phút - data được giữ trong cache 10 phút sau khi không còn component nào sử dụng
 * - retry: 1 lần - retry 1 lần khi query fail
 * - refetchOnWindowFocus: false - không tự động refetch khi window focus
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 phút
      gcTime: 10 * 60 * 1000, // 10 phút (trước đây là cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      // Thêm logging chi tiết cho errors
      onError: (error, query) => {
        console.error('❌ [TanStack Query] Query Error:', {
          queryKey: query.queryKey,
          error: error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : undefined,
          errorDetails: error,
        });
      },
    },
    mutations: {
      retry: 0, // Không retry mutations
      // Thêm logging chi tiết cho mutation errors
      onError: (error, variables, context, mutation) => {
        console.error('❌ [TanStack Query] Mutation Error:', {
          mutationKey: mutation.mutationKey,
          variables: variables,
          context: context,
          error: error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : undefined,
          errorDetails: error,
        });
      },
    },
  },
});

