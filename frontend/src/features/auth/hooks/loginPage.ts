/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "@tanstack/react-router";
import { Form, message } from "antd";
import { useCallback, useState } from "react";
import { authApi } from "../api/authApi";
import type { LoginRequest } from "../types/api";

/**
 * Hook xử lý logic trang đăng nhập
 */
export const useLoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const { setAuth } = useAuthActions();

  
  const handleSubmit = useCallback(async (values: LoginRequest) => {
    setLoading(true);
    try {
      const res = await authApi.login(values);

      if (!res.isError && res.data) {
        // // ✅ Gọi action Zustand (không tạo loop)
        // setAuth({
        //   user: res.data.user,
        //   token: res.data.token,
        // });

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
  },   [navigate]);
  // [setAuth, navigate]);

  return {
    form,
    loading,
    handleSubmit,
  };
};
