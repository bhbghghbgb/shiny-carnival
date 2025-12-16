import { Modal, Descriptions, Tag, Space, Typography, Divider, Image } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { productApiService } from '../api/ProductApiService'
import type { ProductDetailsDto } from '../types/entity'
import { createQueryKeys } from '../../../lib/query/queryOptionsFactory'

const { Title, Text } = Typography

interface ProductDetailModalProps {
    productId: number | null
    open: boolean
    onClose: () => void
}

export function ProductDetailModal({ productId, open, onClose }: ProductDetailModalProps) {
    // Sử dụng query key pattern giống với createQueryKeys để đảm bảo invalidate đúng
    const queryKeys = createQueryKeys('products')
    
    const { data: productDetails, isLoading } = useQuery<ProductDetailsDto>({
        queryKey: queryKeys.detail(productId!),
        queryFn: () => productApiService.getProductDetails(productId!),
        enabled: open && productId !== null,
    })

    const getInventoryStatus = (quantity: number) => {
        if (quantity === 0) {
            return { color: 'red', text: 'Hết hàng' }
        }
        if (quantity < 10) {
            return { color: 'orange', text: 'Sắp hết' }
        }
        return { color: 'green', text: 'Còn hàng' }
    }

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>Chi tiết sản phẩm #{productId}</Title>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            destroyOnClose
        >
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
            ) : productDetails ? (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Product Image Preview */}
                    {(() => {
                        if (productDetails.imageUrl) {
                            return (
                                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                    <Image
                                        src={productDetails.imageUrl}
                                        alt={productDetails.productName}
                                        style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain' }}
                                        preview={{
                                            mask: 'Xem ảnh',
                                        }}
                                    />
                                </div>
                            );
                        }

                        // Hiển thị placeholder nếu không có ảnh
                        return (
                            <div style={{ textAlign: 'center', marginBottom: '16px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
                                <Text type="secondary">Chưa có hình ảnh</Text>
                            </div>
                        );
                    })()}

                    {/* Thông tin sản phẩm */}
                    <Descriptions title="Thông tin sản phẩm" bordered column={2}>
                        <Descriptions.Item label="Mã sản phẩm">
                            <Text strong>#{productDetails.id}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên sản phẩm">
                            <Text strong>{productDetails.productName}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Mã vạch">
                            <Text code>{productDetails.barcode}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Đơn vị tính">
                            {productDetails.unit}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giá bán">
                            <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                                {productDetails.price?.toLocaleString('vi-VN')} đ
                            </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {productDetails.createdAt
                                ? new Date(productDetails.createdAt).toLocaleString('vi-VN')
                                : '--'}
                        </Descriptions.Item>
                    </Descriptions>

                    {/* Thông tin danh mục và nhà cung cấp */}
                    <Descriptions title="Phân loại" bordered column={2}>
                        <Descriptions.Item label="Danh mục">
                            {productDetails.categoryName || `ID: ${productDetails.categoryId}`}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nhà cung cấp">
                            {productDetails.supplierName || `ID: ${productDetails.supplierId}`}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    {/* Thông tin tồn kho */}
                    <Descriptions title="Thông tin tồn kho" bordered column={1}>
                        <Descriptions.Item label="Số lượng tồn kho">
                            <Space>
                                <Text strong style={{ fontSize: '18px' }}>
                                    {productDetails.inventoryQuantity?.toLocaleString('vi-VN')} {productDetails.unit}
                                </Text>
                                <Tag color={getInventoryStatus(productDetails.inventoryQuantity || 0).color}>
                                    {getInventoryStatus(productDetails.inventoryQuantity || 0).text}
                                </Tag>
                            </Space>
                        </Descriptions.Item>
                    </Descriptions>
                </Space>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    Không tìm thấy thông tin sản phẩm
                </div>
            )}
        </Modal>
    )
}



