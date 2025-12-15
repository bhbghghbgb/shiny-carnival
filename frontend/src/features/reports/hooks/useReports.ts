import { useQuery } from '@tanstack/react-query';
import { reportApiService } from '../api/ReportApiService';
import type { RevenueReportDto, TopProductDto, TopCustomerDto } from '../types/entity';
import type { RevenueReportParams, SalesReportParams, TopItemsReportParams } from '../types/api';
import type { PagedList } from '../../../lib/api/types/api.types';

const ENTITY = 'reports';

/**
 * useRevenueReport - GET revenue report
 * 
 * @param params - RevenueReportParams
 * @returns Query result với data là RevenueReportDto
 */
export const useRevenueReport = (params: RevenueReportParams) => {
  return useQuery<RevenueReportDto>({
    queryKey: [ENTITY, 'revenue', params],
    queryFn: () => reportApiService.getRevenueReport(params),
    enabled: !!params.startDate && !!params.endDate,
  });
};

/**
 * useSalesReport - GET sales report
 * 
 * @param params - SalesReportParams
 * @returns Query result với data là unknown
 */
export const useSalesReport = (params: SalesReportParams) => {
  return useQuery<unknown>({
    queryKey: [ENTITY, 'sales', params],
    queryFn: () => reportApiService.getSalesReport(params),
    enabled: !!params.startDate && !!params.endDate,
  });
};

/**
 * useTopProducts - GET top products report
 * 
 * @param params - TopItemsReportParams
 * @returns Query result với data là PagedList<TopProductDto>
 */
export const useTopProducts = (params: TopItemsReportParams) => {
  return useQuery<PagedList<TopProductDto>>({
    queryKey: [ENTITY, 'top-products', params],
    queryFn: () => reportApiService.getTopProducts(params) as Promise<PagedList<TopProductDto>>,
    enabled: !!params.startDate && !!params.endDate,
  });
};

/**
 * useTopCustomers - GET top customers report
 * 
 * @param params - TopItemsReportParams
 * @returns Query result với data là PagedList<TopCustomerDto>
 */
export const useTopCustomers = (params: TopItemsReportParams) => {
  return useQuery<PagedList<TopCustomerDto>>({
    queryKey: [ENTITY, 'top-customers', params],
    queryFn: () => reportApiService.getTopCustomers(params) as Promise<PagedList<TopCustomerDto>>,
    enabled: !!params.startDate && !!params.endDate,
  });
};

/**
 * usePromotionReport - GET promotion report
 * 
 * @param params - Promotion report params
 * @returns Query result với data là unknown
 */
export const usePromotionReport = (params?: {
  startDate?: string;
  endDate?: string;
  promoId?: number;
  includeOrderDetails?: boolean;
}) => {
  return useQuery<unknown>({
    queryKey: [ENTITY, 'promotion', params],
    queryFn: () => reportApiService.getPromotionReport(params || {}),
  });
};

/**
 * useInventoryForecast - GET inventory forecast report
 * 
 * @param params - Inventory forecast params
 * @returns Query result với data là unknown
 */
export const useInventoryForecast = (params?: {
  productId?: number;
  categoryId?: number;
  lookbackMonths?: number;
  leadTimeDays?: number;
  safetyStockMultiplier?: number;
}) => {
  return useQuery<unknown>({
    queryKey: [ENTITY, 'inventory-forecast', params],
    queryFn: () => reportApiService.getInventoryForecast(params || {}),
  });
};

