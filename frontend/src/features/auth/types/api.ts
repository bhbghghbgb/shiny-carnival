// Types cho Authentication API
export interface LoginRequest {
    username?: string | null;  // Optional, nullable (theo backend spec)
    password?: string | null;  // Optional, nullable (theo backend spec)
}

// Định nghĩa interface cho login response
export interface LoginResponse {
    token: string;
    refreshToken: string;
    user: {
        id: number;
        username: string;
        fullName: string;
        role: number; // 0: Admin, 1: Staff
    };
}

export interface RefreshTokenRequest {
    accessToken: string;
    refreshToken: string;
}

export interface LogoutRequest {
    refreshToken: string;
}

export interface SetupAdminRequest {
    username: string;
    password: string;
    fullName: string;
    role: number; // 0: Admin, 1: Staff
}