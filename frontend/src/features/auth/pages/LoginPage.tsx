import { Card } from "antd";
import React from 'react';
import LoginForm from "../components/LoginForm";

export const LoginPage: React.FC = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-gray-500 text-sm">Đăng nhập vào tài khoản của bạn</h1>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-gray-500 mt-6">
          Chưa có tài khoản?{" "}
          <a href="/auth/register" className="text-indigo-600 hover:underline">
            Đăng ký
          </a>
        </p>
      </Card>
    </div>
  );
};
