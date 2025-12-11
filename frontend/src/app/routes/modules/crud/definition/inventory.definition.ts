import { z } from 'zod';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { baseSearchSchema, type CrudModuleDefinition, type LoaderContext } from '../../../type/types';
import { InventoryListPage } from '../../../../../features/inventory/pages/InventoryListPage';
import { InventoryDetailPage } from '../../../../../features/inventory/pages/InventoryDetailPage';
import { InventoryCreatePage } from '../../../../../features/inventory/pages/InventoryCreatePage';
import { InventoryEditPage } from '../../../../../features/inventory/pages/InventoryEditPage';
import { inventory as mockInventory } from '../../../../../_mocks/inventory';
import { createQueryKeys } from '../../../../../lib/query/queryOptionsFactory';

// 1. Định nghĩa Types và API
// --------------------------

type Inventory = (typeof mockInventory)[number];

interface InventoryListData {
  items: (typeof mockInventory);
  total: number;
  page: number;
  pageSize: number;
}

const inventorySearchSchema = baseSearchSchema.extend({
  // warehouseId: z.string().optional(),
  // productId: z.string().optional(),
  // minQuantity: z.number().optional(),
  // maxQuantity: z.number().optional(),
});

export type InventoryListSearch = z.infer<typeof inventorySearchSchema>;
export type InventoryDetailParams = { id: string };

async function fetchInventoryList(ctx: LoaderContext<Record<string, never>, InventoryListSearch, { queryClient: QueryClient }>): Promise<InventoryListData> {
  const { search, context } = ctx;
  const queryKeys = createQueryKeys('inventory');
  const queryOpts = queryOptions<InventoryListData>({
    queryKey: [...queryKeys.lists(), 'mock', search],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        items: mockInventory,
        total: mockInventory.length,
        page: search.page,
        pageSize: search.pageSize,
      };
    },
  });

  return context.queryClient.ensureQueryData(queryOpts);
}

async function fetchInventoryById(ctx: LoaderContext<InventoryDetailParams, InventoryListSearch, { queryClient: QueryClient }>): Promise<Inventory> {
  const { params, context } = ctx;
  const queryKeys = createQueryKeys('inventory');
  const queryOpts = queryOptions<Inventory>({
    queryKey: [...queryKeys.details(), params.id],
    queryFn: async () => {
      const inventoryId = parseInt(params.id);
      const item = mockInventory.find(i => i.inventoryId === inventoryId);
      if (!item) {
        throw new Error(`Inventory item with id ${params.id} not found`);
      }
      return item;
    },
  });

  return context.queryClient.ensureQueryData(queryOpts);
}

// 2. Tạo "Bản thiết kế" cho module CRUD
// ----------------------------------------

export const inventoryModuleDefinition: CrudModuleDefinition<
  InventoryListData,      // Kiểu loader cho List
  Inventory,              // Kiểu loader cho Detail
  InventoryListSearch,    // Kiểu search cho List
  InventoryDetailParams,  // Kiểu params cho Detail
  { queryClient: QueryClient }      // Kiểu router context
> = {
  entityName: 'kho hàng',
  basePath: 'inventory',
  components: {
    list: InventoryListPage,
    detail: InventoryDetailPage,
    create: InventoryCreatePage,
    edit: InventoryEditPage,
  },
  loaders: {
    list: (ctx) => fetchInventoryList(ctx),
    detail: (ctx) => fetchInventoryById(ctx),
  },
  searchSchemas: {
    list: inventorySearchSchema,
  },
};

