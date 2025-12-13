import type { SupplierEntity } from './entity.ts';

export interface CreateSupplierRequest {
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
}

export interface UpdateSupplierRequest extends SupplierEntity { }
