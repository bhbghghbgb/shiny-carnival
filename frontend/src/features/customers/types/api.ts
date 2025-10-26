import type {CustomerEntity} from "./entity.ts";

export interface CreateCustomerRequest {
    name: string;
    phone: string;
    email: string;
    address: string;
}

export type UpdateCustomerRequest = CustomerEntity
