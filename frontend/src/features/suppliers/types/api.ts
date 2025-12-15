import type { SupplierEntity } from './entity.ts';

export interface CreateSupplierRequest {
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
}

export type UpdateSupplierRequest = Omit<SupplierEntity, 'id'>;
