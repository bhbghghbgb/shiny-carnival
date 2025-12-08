import { Result } from 'antd';

interface ErrorComponentProps {
  error: Error;
}

export function ErrorComponent({ error }: ErrorComponentProps) {
  return (
    <div style={{ padding: '24px' }}>
      <Result
        status="error"
        title="Đã xảy ra lỗi"
        subTitle="Rất tiếc, đã có lỗi xảy ra trong quá trình tải dữ liệu. Vui lòng thử lại sau."
        extra={[
          // Có thể thêm nút "Thử lại" ở đây nếu cần
        ]}
      >
        {/* Hiển thị chi tiết lỗi để debug trong môi trường development */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ background: '#fff2f0', border: '1px solid #ffccc7', padding: '8px', marginTop: '16px' }}>
            <pre style={{ margin: 0 }}>{error.message}</pre>
          </div>
        )}
      </Result>
    </div>
  );
}

