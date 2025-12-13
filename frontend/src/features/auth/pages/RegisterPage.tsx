import React from 'react';
import { userApiService } from '../../users/api';
import type { CreateUserRequest } from '../../users/types/api';
import RegisterForm from '../components/RegisterForm';
import { useNavigate } from '@tanstack/react-router';
import { ENDPOINTS } from '../../../app/routes/type/routes.endpoint';

export const RegisterPage: React.FC = () => {
  // const { setSelectedUser } = useUserActions();
  const navigate = useNavigate();

  const handleRegister = async (data: CreateUserRequest) => {
    // Gọi API tạo user (userApiService.create tự động unwrap ApiResponse)
    const user = await userApiService.create(data);
    // Lưu user vào store
    // setSelectedUser(user);
    // TODO: Có thể redirect hoặc show toast thành công
    console.log("Đăng ký thành công:", user);
    // Redirect to login page
    navigate({ to: ENDPOINTS.AUTH.LOGIN });
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