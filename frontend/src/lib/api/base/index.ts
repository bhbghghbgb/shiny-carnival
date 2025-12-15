/**
 * Base API Infrastructure
 * 
 * Export tất cả base utilities và classes để dễ import
 */

export { BaseApiService } from './BaseApiService';
export type { ApiConfig, QueryParams } from './BaseApiService';
export type { ApiServiceInterface } from './ApiServiceInterface';
export { unwrapResponse, handleApiError } from './apiResponseAdapter';

