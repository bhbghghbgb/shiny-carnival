/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { CreateUserRequest } from "../../users/types/api";
import { useRegisterForm } from "../hooks/RegisterPage";

interface RegisterFormProps {
  onSubmit: (data: CreateUserRequest) => Promise<void>;
  roles: { label: string; value: string }[];
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, roles }) => {
  const { values, handleChange, handleSubmit, loading, error } =
    useRegisterForm(onSubmit);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto bg-white p-10 rounded-3xl shadow-xl space-y-6 border border-gray-100"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">
        🧾 Đăng ký tài khoản mới
      </h2>

      {/* Họ và tên */}
      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700">
          Họ và tên
        </label>
        <input
          type="text"
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          required
          className="w-full h-12 border border-gray-300 rounded-xl px-4 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          placeholder="Nhập họ tên"
        />
      </div>

      {/* Username */}
      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700">
          Tên đăng nhập
        </label>
        <input
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
          required
          className="w-full h-12 border border-gray-300 rounded-xl px-4 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          placeholder="Nhập tên đăng nhập"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700">
          Mật khẩu
        </label>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          required
          className="w-full h-12 border border-gray-300 rounded-xl px-4 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          placeholder="Nhập mật khẩu"
        />
      </div>

      {/* Role */}
      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700">
          Vai trò
        </label>
        <select
          name="role"
          value={values.role}
          onChange={(e) =>
            handleChange({
              ...e,
              target: { ...e.target, value: Number(e.target.value) },
            } as any)
          }
          required
          className="w-full h-12 border border-gray-300 rounded-xl px-4 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition bg-white"
        >
          <option value="">-- Chọn vai trò --</option>
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-red-500 text-center text-sm font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
      >
        {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </button>
    </form>
  );
};

export default RegisterForm;
