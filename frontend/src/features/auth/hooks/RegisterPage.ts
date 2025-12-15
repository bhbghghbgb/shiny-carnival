/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { CreateUserRequest } from "../../users/types/api";
import type { UserRole } from "../../../config/api.config";

export const useRegisterForm = (
  onSubmit: (data: CreateUserRequest) => Promise<void>
) => {
  const [values, setValues] = useState<CreateUserRequest>({
    username: "",
    password: "",
    fullName: "",
    role: undefined as UserRole,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setValues((prev) => ({ ...prev, [name]: value ? Number(value) as UserRole : undefined }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (values.role === undefined) {
        throw new Error("Vui lòng chọn vai trò");
      }
      await onSubmit(values);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return { values, handleChange, handleSubmit, loading, error };
};
