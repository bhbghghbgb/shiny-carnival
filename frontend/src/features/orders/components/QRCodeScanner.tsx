import { useEffect, useRef } from 'react';
import { Button, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  onClose: () => void;
  visible: boolean;
}

export function QRCodeScanner({
  onScanSuccess,
  onScanError,
  onClose,
  visible,
}: QRCodeScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const containerId = 'qr-reader-container';

  useEffect(() => {
    if (!visible) {
      // Cleanup scanner when not visible
      if (scannerRef.current) {
        try {
          scannerRef.current.clear().catch((error) => {
            console.error('Error clearing scanner:', error);
          });
        } catch (error) {
          console.error('Error clearing scanner:', error);
        }
        scannerRef.current = null;
      }
      return;
    }

    // Initialize scanner when visible
    const config = {
      fps: 10,
      qrbox: { width: 300, height: 300 },
      aspectRatio: 1.0,
      supportedScanTypes: [],
    };

    const scanner = new Html5QrcodeScanner(
      containerId,
      config,
      false // verbose = false
    );

    scannerRef.current = scanner;

    const handleScanSuccess = (decodedText: string) => {
      // Stop scanner when scan succeeds
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error('Error clearing scanner after success:', error);
        });
      }
      onScanSuccess(decodedText);
    };

    const handleScanFailure = (errorMessage: string) => {
      // Ignore most scan failures (they happen frequently during scanning)
      // Only log if it's a meaningful error
      if (errorMessage && !errorMessage.includes('No QR code found')) {
        console.warn('Scan error:', errorMessage);
        if (onScanError) {
          onScanError(errorMessage);
        }
      }
    };

    scanner.render(handleScanSuccess, handleScanFailure);

    // Cleanup function
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear().catch((error) => {
            console.error('Error clearing scanner in cleanup:', error);
          });
        } catch (error) {
          console.error('Error clearing scanner in cleanup:', error);
        }
        scannerRef.current = null;
      }
    };
  }, [visible, onScanSuccess, onScanError]);

  if (!visible) {
    return null;
  }

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div
          id={containerId}
          style={{
            width: '100%',
            minHeight: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
        <Button
          type="default"
          icon={<CloseOutlined />}
          onClick={onClose}
          block
        >
          Đóng Scanner
        </Button>
      </Space>
    </div>
  );
}

