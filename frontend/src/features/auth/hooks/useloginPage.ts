/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "@tanstack/react-router";
import { Form, message } from "antd";
import { useCallback, useState } from "react";
import { authApi } from "../api/authApi";
import type { LoginRequest } from "../types/api";
import { useAuthStore } from "../store/authStore";

/**
 * Hook xử lý logic trang đăng nhập
 */
export const useLoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (values: LoginRequest) => {
    setLoading(true);
    try {
      const res = await authApi.login(values);

      if (!res.isError && res.data) {
        // ✅ Lưu thông tin user vào store (không lưu token vì dùng httpOnly cookies)
        // Sử dụng getState() để tránh re-render và infinite loop
        useAuthStore.getState().setAuth({
          user: res.data.user,
        });

        message.success("Đăng nhập thành công!");
        navigate({ to: "/" }); // điều hướng về trang chủ
      } else {
        message.error(res.message || "Đăng nhập thất bại!");
      }
    } catch (error: any) {
      message.error(error.message || "Có lỗi xảy ra khi đăng nhập");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return {
    form,
    loading,
    handleSubmit,
  };
};
