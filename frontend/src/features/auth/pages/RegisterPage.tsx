import React from 'react';
import { useCreateUser } from '../../users/hooks/useUsers';
import type { CreateUserRequest } from '../../users/types/api';
import RegisterForm from '../components/RegisterForm';
import { useNavigate } from '@tanstack/react-router';
import { ENDPOINTS } from '../../../app/routes/type/routes.endpoint';

export const RegisterPage: React.FC = () => {
  // const { setSelectedUser } = useUserActions();
  const navigate = useNavigate();

  const createUser = useCreateUser({
    onSuccess: (user) => {
      // Lưu user vào store
      // setSelectedUser(user);
      // TODO: Có thể redirect hoặc show toast thành công
      console.log("Đăng ký thành công:", user);
    },
    onError: (error) => {
      console.error("Đăng ký thất bại:", error);
    },
  });

  const handleRegister = async (data: CreateUserRequest) => {
    // Sử dụng TanStack Query mutation thay vì gọi API trực tiếp
    await createUser.mutateAsync(data);
  };

  const roles = [
    { label: "Quản trị viên", value: "0" },
    { label: "Nhân viên", value: "1" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <RegisterForm onSubmit={handleRegister} roles={roles} />
    </div>
  );
};

export default RegisterPage;