import React from 'react';
import { userApi } from '../../users/api';
import type { CreateUserRequest } from '../../users/types/api';
import RegisterForm from '../components/RegisterForm';

export const RegisterPage: React.FC = () => {
  // const { setSelectedUser } = useUserActions();

  const handleRegister = async (data: CreateUserRequest) => {
    // Gọi API tạo user
    const response = await userApi.createUser(data);
    if (response.isError) throw new Error(response.message);
    // Lưu user vào store
    // setSelectedUser(response.data);
    // TODO: Có thể redirect hoặc show toast thành công
    console.log("Đăng ký thành công:", response.data);
  };

  const roles = [
    { label: "Quản trị viên", value: "1" },
    { label: "Nhân viên", value: "2" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <RegisterForm onSubmit={handleRegister} roles={roles} />
    </div>
  );
};

export default RegisterPage;