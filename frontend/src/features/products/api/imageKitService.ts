import { upload } from '@imagekit/javascript';
import axiosClient from '../../../lib/api/axios';
import type { ApiResponse } from '../../../lib/api/types/api.types';

export interface ImageKitAuthParams {
  signature: string;
  token: string;
  expire: number;
  publicKey: string;
}

// Backend trả về PascalCase, frontend cần map sang camelCase
interface ImageKitAuthResponseFromBackend {
  signature: string;
  token: string;
  expire: number;
  publicKey: string;
}

export interface ImageKitUploadResponse {
  fileId: string;
  url: string;
  name: string;
}

/**
 * Lấy authentication parameters từ backend để upload ảnh lên ImageKit
 */
export async function getImageKitAuth(): Promise<ImageKitAuthParams> {
  try {
    let response: ApiResponse<ImageKitAuthResponseFromBackend>;
    
    try {
      // Axios interceptor đã trả về response.data (là ApiResponse), không phải toàn bộ AxiosResponse
      // Backend trả về PascalCase, nhưng JSON serializer đã convert sang camelCase
      const rawResponse = await axiosClient.post('/api/admin/imagekit/auth');
      response = rawResponse as unknown as ApiResponse<ImageKitAuthResponseFromBackend>;
    } catch (axiosError) {
      throw new Error(
        axiosError instanceof Error
          ? `Network error: ${axiosError.message}`
          : 'Network error: Failed to request ImageKit auth'
      );
    }

    // Check if response exists
    if (!response) {
      throw new Error('ImageKit auth response is missing');
    }

    // Check for error
    if (response.isError === true) {
      const errorMsg = response.message || 'Failed to get ImageKit auth parameters';
      throw new Error(errorMsg);
    }

    // Check if data exists
    if (!response.data) {
      throw new Error('ImageKit auth response data is missing');
    }

    // Backend trả về camelCase (do JSON serializer config), map sang interface
    const backendData = response.data;
    
    // Validate required fields - check both null/undefined and empty string
    // Handle case where values might be strings or numbers
    const signature = String(backendData.signature || '').trim();
    const token = String(backendData.token || '').trim();
    const expire = Number(backendData.expire);
    const publicKey = String(backendData.publicKey || '').trim();

    const hasSignature = signature !== '';
    const hasToken = token !== '';
    const hasExpire = !isNaN(expire) && expire > 0;
    const hasPublicKey = publicKey !== '';

    if (!hasSignature || !hasToken || !hasExpire || !hasPublicKey) {
      throw new Error('ImageKit auth parameters are incomplete');
    }

    const authParams: ImageKitAuthParams = {
      signature,
      token,
      expire,
      publicKey,
    };

    return authParams;
  } catch (error) {
    // Re-throw với message rõ ràng hơn
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error(
      `Failed to get ImageKit auth parameters: ${String(error)}`
    );
  }
}

/**
 * Upload ảnh lên ImageKit
 * @param file - File object từ input
 * @param fileName - Tên file (optional, mặc định dùng file.name)
 * @param onProgress - Callback để track upload progress (optional)
 * @returns Promise với fileId và URL của ảnh đã upload
 */
export async function uploadImageToImageKit(
  file: File,
  fileName?: string,
  onProgress?: (progress: number) => void
): Promise<ImageKitUploadResponse> {
  try {
    // Lấy auth params từ backend
    const authParams = await getImageKitAuth();

    // Upload file sử dụng ImageKit JavaScript SDK
    // ImageKit expect expire là Unix timestamp (seconds) dưới dạng number
    const result = await upload({
      file: file,
      fileName: fileName || file.name,
      token: authParams.token,
      signature: authParams.signature,
      expire: Number(authParams.expire), // Đảm bảo là number
      publicKey: authParams.publicKey,
      useUniqueFileName: true,
      folder: '/products', // Folder trong ImageKit để tổ chức ảnh
      onProgress: (event) => {
        if (onProgress && event.total) {
          const progressPercent = (event.loaded / event.total) * 100;
          onProgress(progressPercent);
        }
      },
    });

    if (!result.fileId || !result.url) {
      throw new Error('Upload failed: Missing fileId or url in response');
    }

    return {
      fileId: result.fileId,
      url: result.url,
      name: result.name || file.name,
    };
  } catch (error) {
    console.error('Error uploading image to ImageKit:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to upload image: ${error.message}`
        : 'Failed to upload image'
    );
  }
}

