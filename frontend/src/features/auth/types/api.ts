// Types cho Authentication API
export interface LoginRequest {
    username: string;
    password: string;
}

// Định nghĩa interface cho login response
export interface LoginResponse {
    token: string;
    user: {
        id: number;
        username: string;
        fullName: string;
        role: number; // 0: Admin, 1: Staff
    };
}

export interface RefreshTokenRequest {
    refreshToken: string;
}