// Types cho Customer API
export interface CustomerEntity {
    id: number;
    name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    createdAt?: string;
}