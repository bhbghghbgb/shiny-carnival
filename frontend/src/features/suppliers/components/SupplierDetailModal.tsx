import { Modal, Descriptions, Table, Space, Typography, Divider } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { supplierApiService } from '../api/SupplierApiService'
import { productApiService } from '../../products/api/ProductApiService'
import { productColumns } from '../../products/config/productPageConfig'
import type { SupplierDetailsDto } from '../types/entity'
import type { ProductEntity } from '../../products/types/entity'
import type { PagedList } from '../../../lib/api/types/api.types'
import { createQueryKeys } from '../../../lib/query/queryOptionsFactory'

const { Title, Text } = Typography

interface SupplierDetailModalProps {
    supplierId: number | null
    open: boolean
    onClose: () => void
}

export function SupplierDetailModal({ supplierId, open, onClose }: SupplierDetailModalProps) {
    const supplierQueryKeys = createQueryKeys('suppliers')
    const productQueryKeys = createQueryKeys('products')

    // Fetch supplier details
    const { data: supplierDetails, isLoading: isLoadingSupplier } = useQuery<SupplierDetailsDto>({
        queryKey: supplierQueryKeys.detail(supplierId!),
        queryFn: () => supplierApiService.getSupplierDetails(supplierId!),
        enabled: open && supplierId !== null,
    })

    // Fetch products của supplier
    const { data: productsData, isLoading: isLoadingProducts } = useQuery<PagedList<ProductEntity>>({
        queryKey: [...productQueryKeys.list(), 'supplier', supplierId],
        queryFn: () => productApiService.getProductsBySupplier(supplierId!, {
            page: 1,
            pageSize: 100, // Lấy tất cả products của supplier (có thể paginate sau nếu cần)
        }),
        enabled: open && supplierId !== null,
    })

    const products = productsData?.items || []
    const isLoading = isLoadingSupplier || isLoadingProducts

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>Chi tiết nhà cung cấp #{supplierId}</Title>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={1000}
            destroyOnClose
        >
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
            ) : supplierDetails ? (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Thông tin nhà cung cấp */}
                    <Descriptions title="Thông tin nhà cung cấp" bordered column={2}>
                        <Descriptions.Item label="Mã nhà cung cấp">
                            <Text strong>#{supplierDetails.id}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên nhà cung cấp">
                            <Text strong>{supplierDetails.name}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {supplierDetails.phone || '--'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {supplierDetails.email || '--'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ" span={2}>
                            {supplierDetails.address || '--'}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    {/* Thống kê */}
                    <Descriptions title="Thống kê" bordered column={1}>
                        <Descriptions.Item label="Tổng số sản phẩm">
                            <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                                {supplierDetails.productCount}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    {/* Danh sách sản phẩm */}
                    <div>
                        <Title level={5}>Danh sách sản phẩm</Title>
                        {products.length > 0 ? (
                            <Table<ProductEntity>
                                columns={productColumns}
                                dataSource={products}
                                rowKey="id"
                                pagination={{
                                    pageSize: 10,
                                    showSizeChanger: true,
                                    showTotal: (total) => `Tổng ${total} sản phẩm`,
                                }}
                                size="small"
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                Nhà cung cấp chưa có sản phẩm nào
                            </div>
                        )}
                    </div>
                </Space>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    Không tìm thấy thông tin nhà cung cấp
                </div>
            )}
        </Modal>
    )
}

