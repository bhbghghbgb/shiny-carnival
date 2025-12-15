import type { CustomerEntity } from "./entity.ts";

export interface CreateCustomerRequest {
    name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
}

export interface UpdateCustomerRequest {
    name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
}
