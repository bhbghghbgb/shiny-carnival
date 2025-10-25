// Types cho Authentication API
export interface LoginRequest {
    username: string;
    password: string;
}


export interface RefreshTokenRequest {
    refreshToken: string;
}