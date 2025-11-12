import { z } from 'zod';
import { baseSearchSchema, type CrudModuleDefinition } from '../../../type/types';
import { InventoryListPage } from '../../../../../features/inventory/pages/InventoryListPage';
import { InventoryDetailPage } from '../../../../../features/inventory/pages/InventoryDetailPage';
import { InventoryCreatePage } from '../../../../../features/inventory/pages/InventoryCreatePage';
import { InventoryEditPage } from '../../../../../features/inventory/pages/InventoryEditPage';
import { inventory as mockInventory } from '../../../../../_mocks/inventory';

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

async function fetchInventoryList(search: InventoryListSearch): Promise<InventoryListData> {
  console.log('Fetching inventory with params:', search);
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    items: mockInventory,
    total: mockInventory.length,
    page: search.page,
    pageSize: search.pageSize,
  };
}

async function fetchInventoryById(id: string): Promise<Inventory> {
  console.log('Fetching inventory item with id:', id);
  const inventoryId = parseInt(id);
  const item = mockInventory.find(i => i.inventoryId === inventoryId);
  if (!item) {
    throw new Error(`Inventory item with id ${id} not found`);
  }
  return item;
}

// 2. Tạo "Bản thiết kế" cho module CRUD
// ----------------------------------------

export const inventoryModuleDefinition: CrudModuleDefinition<
  InventoryListData,      // Kiểu loader cho List
  Inventory,              // Kiểu loader cho Detail
  InventoryListSearch,    // Kiểu search cho List
  InventoryDetailParams,  // Kiểu params cho Detail
  { apiClient: any }      // Kiểu router context
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
    list: ({ search }) => fetchInventoryList(search),
    detail: ({ params }) => fetchInventoryById(params.id),
  },
  searchSchemas: {
    list: inventorySearchSchema,
  },
};

