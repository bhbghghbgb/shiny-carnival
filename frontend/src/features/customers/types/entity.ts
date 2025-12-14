// Types cho Customer API
export interface CustomerEntity {
    id: number;
    name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    createdAt?: string;
}

// Customer Details DTO - từ backend CustomerResponseDto
export interface CustomerDetailsDto {
    id: number;
    name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    totalOrders: number;
    totalSpent: number;
    createdAt: string;
}
