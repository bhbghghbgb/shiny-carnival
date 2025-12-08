/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { CreateUserRequest } from "../../users/types/api";

export const useRegisterForm = (
  onSubmit: (data: CreateUserRequest) => Promise<void>
) => {
  const [values, setValues] = useState<CreateUserRequest>({
    username: "",
    password: "",
    fullName: "",
    role: "" as any, 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return { values, handleChange, handleSubmit, loading, error };
};
