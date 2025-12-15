export interface SupplierEntity {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
}

export interface SupplierDetailsDto extends SupplierEntity {
  productCount: number;
}
