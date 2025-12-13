// src/hooks/useLogout.ts
import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { message } from "antd";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore"; // Import store

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clearAuth = useAuthStore.getState().clearAuth;

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      await authApi.logout();
    } catch (error) {
      console.warn("API logout thất bại (có thể do network/cookie hết hạn):", error);
    } finally {
      clearAuth();

      message.success("Đăng xuất thành công!");
      navigate({ to: "/auth/login" }); // hoặc "/login" tùy route của mày
      setLoading(false);
    }
  }, [navigate, clearAuth]);

  return { logout, loading };
};