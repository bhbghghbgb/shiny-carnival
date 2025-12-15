import { HomeOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Button, Result } from 'antd';
import { ENDPOINTS } from '../../../app/routes/type/routes.endpoint';

/**
 * Unauthorized Page
 * Hiển thị khi user không có quyền truy cập route
 */
export function UnauthorizedPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate({ to: ENDPOINTS.HOME });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        icon={<LockOutlined style={{ color: '#ff4d4f' }} />}
        extra={[
          <Button
            type="primary"
            key="home"
            icon={<HomeOutlined />}
            onClick={handleGoHome}
          >
            Về trang chủ
          </Button>,
          <Button
            key="back"
            onClick={() => window.history.back()}
          >
            Quay lại
          </Button>,
        ]}
      />
    </div>
  );
}

