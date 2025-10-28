import type { SupplierEntity } from './entity.ts';

export interface CreateSupplierRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface UpdateSupplierRequest extends SupplierEntity {}
