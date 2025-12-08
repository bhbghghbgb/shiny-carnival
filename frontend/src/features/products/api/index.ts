/**
 * Products API
 * 
 * Export ProductApiService và instance
 */

export { ProductApiService, productApiService } from './ProductApiService';

// Re-export types
export type { ProductEntity } from '../types/entity';
export type { CreateProductRequest, UpdateProductRequest } from '../types/api';
