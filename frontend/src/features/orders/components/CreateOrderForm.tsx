import { useState, useMemo, useEffect } from 'react'
import { Form, Input, InputNumber, Button, Space, Card, Table, Typography, Divider, message, Alert } from 'antd'
import { PlusOutlined, DeleteOutlined, QrcodeOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { DropDownWithFilter } from '../../../components/common/DropDownWithFilter'
import { customerApiService } from '../../customers/api/CustomerApiService'
import { productApiService } from '../../products/api/ProductApiService'
import { useOrderStore, type DraftOrderItem } from '../store/orderStore'
import { createQueryKeys } from '../../../lib/query/queryOptionsFactory'
import { QRCodeScanner } from './QRCodeScanner'
import { ProductPreviewModal } from './ProductPreviewModal'
import type { CustomerEntity } from '../../customers/types/entity'
import type { ProductEntity } from '../../products/types/entity'
import type { CreateOrderRequest } from '../types/api'
import type { DropDownWithFilterOption } from '../../../components/common/DropDownWithFilter'

const { Title, Text } = Typography

interface CreateOrderFormProps {
    onSubmit: (values: CreateOrderRequest) => Promise<void>
    onCancel: () => void
    loading?: boolean
    errorMessage?: string | null
    onClearError?: () => void
}

export function CreateOrderForm({
    onSubmit,
    onCancel,
    loading = false,
    errorMessage,
    onClearError,
}: CreateOrderFormProps) {
    const [form] = Form.useForm()
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
    const [quantity, setQuantity] = useState<number>(1)
    const [isScanning, setIsScanning] = useState(false)
    const [scannedProduct, setScannedProduct] = useState<ProductEntity | null>(null)
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
    const [isSearchingProduct, setIsSearchingProduct] = useState(false)
    const queryClient = useQueryClient()
    const productQueryKeys = createQueryKeys('products')

    // ✅ Chỉ subscribe vào orderItems để re-render khi items thay đổi
    // Không subscribe vào customerId và promoCode vì chúng được quản lý bởi Form
    const orderItems = useOrderStore((state) => state.draftOrder.orderItems)

    // Load draft từ localStorage khi component mount (chỉ một lần)
    useEffect(() => {
        const draftOrder = useOrderStore.getState().draftOrder
        const initialValues: any = {}
        if (draftOrder.customerId) {
            initialValues.customerId = draftOrder.customerId
        }
        if (draftOrder.promoCode) {
            initialValues.promoCode = draftOrder.promoCode
        }
        if (Object.keys(initialValues).length > 0) {
            form.setFieldsValue(initialValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Chỉ chạy một lần khi mount để load draft từ localStorage

    // Fetch products để lấy thông tin khi thêm vào order - sử dụng TanStack Query
    const fetchProductDetails = async (productId: number): Promise<ProductEntity | null> => {
        try {
            // Sử dụng queryClient.fetchQuery để đảm bảo data được cache và có thể reuse
            const product = await queryClient.fetchQuery<ProductEntity>({
                queryKey: productQueryKeys.detail(productId),
                queryFn: () => productApiService.getById(productId),
            })
            return product
        } catch (error) {
            console.error('Error fetching product:', error)
            return null
        }
    }

    const handleAddProduct = async () => {
        if (!selectedProduct) {
            message.warning('Vui lòng chọn sản phẩm')
            return
        }

        if (quantity < 1) {
            message.warning('Số lượng phải lớn hơn 0')
            return
        }

        // Kiểm tra sản phẩm đã tồn tại chưa (đọc từ store bằng getState())
        const currentDraftOrder = useOrderStore.getState().draftOrder
        const existingItem = currentDraftOrder.orderItems.find(item => item.productId === selectedProduct)
        if (existingItem) {
            message.warning('Sản phẩm đã có trong đơn hàng. Vui lòng xóa và thêm lại nếu muốn thay đổi số lượng.')
            return
        }

        // Fetch product details
        const product = await fetchProductDetails(selectedProduct)
        if (!product) {
            message.error('Không thể lấy thông tin sản phẩm')
            return
        }

        const newItem: DraftOrderItem = {
            productId: product.id,
            productName: product.productName,
            price: product.price,
            quantity: quantity,
            subtotal: product.price * quantity,
        }

        useOrderStore.getState().addDraftOrderItem(newItem)
        setSelectedProduct(null)
        setQuantity(1)
        form.setFieldsValue({ productId: undefined, quantity: 1 })
        message.success('Đã thêm sản phẩm vào đơn hàng')
    }

    const handleRemoveProduct = (productId: number) => {
        useOrderStore.getState().removeDraftOrderItem(productId)
        message.success('Đã xóa sản phẩm khỏi đơn hàng')
    }

    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity < 1) {
            message.warning('Số lượng phải lớn hơn 0')
            return
        }
        useOrderStore.getState().updateDraftOrderItemQuantity(productId, newQuantity)
    }

    // QR Scanner handlers
    const handleScanClick = () => {
        setIsScanning(true)
    }

    const handleScanSuccess = async (decodedText: string) => {
        try {
            setIsSearchingProduct(true)
            setIsScanning(false) // Pause scanner

            // Search product by barcode
            const products = await productApiService.searchByBarcode(decodedText)
            
            if (products.length === 0) {
                message.error('Không tìm thấy sản phẩm với mã vạch này')
                setIsSearchingProduct(false)
                setIsScanning(true) // Resume scanner
                return
            }

            // Use first matching product
            const product = products[0]
            setScannedProduct(product)
            setIsPreviewModalOpen(true)
            setIsSearchingProduct(false)
        } catch (error: any) {
            console.error('Error searching product by barcode:', error)
            message.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tìm kiếm sản phẩm')
            setIsSearchingProduct(false)
            setIsScanning(true) // Resume scanner on error
        }
    }

    const handleScanError = (error: string) => {
        // Most scan errors are expected (no QR found, etc.)
        // Only log meaningful errors
        if (error && !error.includes('No QR code found')) {
            console.warn('Scan error:', error)
        }
    }

    const handleCancelScan = () => {
        setIsScanning(false)
    }

    const handleConfirmProduct = () => {
        if (!scannedProduct) {
            return
        }

        // Check if product already exists in order
        const currentDraftOrder = useOrderStore.getState().draftOrder
        const existingItem = currentDraftOrder.orderItems.find(
            item => item.productId === scannedProduct.id
        )

        if (existingItem) {
            message.warning('Sản phẩm đã có trong đơn hàng. Vui lòng xóa và thêm lại nếu muốn thay đổi số lượng.')
            setIsPreviewModalOpen(false)
            setScannedProduct(null)
            return
        }

        // Add product to order with quantity = 1
        const newItem: DraftOrderItem = {
            productId: scannedProduct.id,
            productName: scannedProduct.productName,
            price: scannedProduct.price,
            quantity: 1,
            subtotal: scannedProduct.price * 1,
        }

        useOrderStore.getState().addDraftOrderItem(newItem)
        message.success('Đã thêm sản phẩm vào đơn hàng')
        
        // Close modal and reset state
        setIsPreviewModalOpen(false)
        setScannedProduct(null)
    }

    const handleCancelPreview = () => {
        setIsPreviewModalOpen(false)
        setScannedProduct(null)
        setIsScanning(true) // Resume scanner
    }

    const handleCancel = () => {
        // Reset form
        form.resetFields()
        // Reset store (clear draft order)
        useOrderStore.getState().clearDraftOrder()
        // Reset local state
        setSelectedProduct(null)
        setQuantity(1)
        setIsScanning(false)
        setScannedProduct(null)
        setIsPreviewModalOpen(false)
        // Call parent onCancel
        onCancel()
    }

    const totalAmount = useMemo(() => {
        return orderItems.reduce((sum, item) => sum + item.subtotal, 0)
    }, [orderItems])

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            const { customerId, promoCode } = values

            if (orderItems.length === 0) {
                message.warning('Vui lòng thêm ít nhất một sản phẩm vào đơn hàng')
                return
            }

            // Update draft customer và promo code trước khi submit
            useOrderStore.getState().setDraftCustomer(customerId as number)
            useOrderStore.getState().setDraftPromoCode(promoCode || null)

            const payload: CreateOrderRequest = {
                customerId: customerId as number,
                promoCode: promoCode || undefined,
                orderItems: orderItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            }

            await onSubmit(payload)
            // Clear draft order sau khi submit thành công
            form.resetFields()
            useOrderStore.getState().clearDraftOrder()
            setSelectedProduct(null)
            setQuantity(1)
        } catch (error) {
            if (error && typeof error === 'object' && 'errorFields' in error) {
                return
            }
            console.error('Form validation error:', error)
        }
    }

    // Sync customer và promo code với draft khi form value thay đổi (sử dụng Form's onValuesChange)
    // Sử dụng getState() để đọc giá trị hiện tại và so sánh, tránh subscribe gây re-render
    const handleFormValuesChange = (changedValues: any) => {
        const currentDraftOrder = useOrderStore.getState().draftOrder

        // Chỉ update store nếu giá trị thực sự thay đổi
        if ('customerId' in changedValues) {
            const customerId = changedValues.customerId || null
            // Chỉ update nếu giá trị khác với giá trị hiện tại trong store
            if (customerId !== currentDraftOrder.customerId) {
                useOrderStore.getState().setDraftCustomer(customerId)
            }
        }
        if ('promoCode' in changedValues) {
            const promoCode = changedValues.promoCode?.trim() || null
            // Chỉ update nếu giá trị khác với giá trị hiện tại trong store
            if (promoCode !== currentDraftOrder.promoCode) {
                useOrderStore.getState().setDraftPromoCode(promoCode)
            }
        }
    }

    const previewColumns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            align: 'right' as const,
            render: (value: number) => `${value?.toLocaleString()} đ`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center' as const,
            render: (value: number, record: DraftOrderItem) => (
                <InputNumber
                    min={1}
                    value={value}
                    onChange={(newValue) => handleUpdateQuantity(record.productId, newValue || 1)}
                    style={{ width: 80 }}
                />
            ),
        },
        {
            title: 'Thành tiền',
            dataIndex: 'subtotal',
            key: 'subtotal',
            align: 'right' as const,
            render: (value: number) => <strong>{value?.toLocaleString()} đ</strong>,
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center' as const,
            render: (_: any, record: DraftOrderItem) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveProduct(record.productId)}
                />
            ),
        },
    ]

    return (
        <div style={{ display: 'flex', gap: '24px', minHeight: '500px' }}>
            {/* Form bên trái */}
            <div style={{ flex: 1 }}>
                <Form 
                    form={form} 
                    layout="vertical" 
                    onFinish={handleSubmit}
                    onValuesChange={handleFormValuesChange}
                >
                    {errorMessage && (
                        <Alert
                            style={{ marginBottom: 16 }}
                            type="error"
                            showIcon
                            closable
                            message={errorMessage}
                            onClose={onClearError}
                        />
                    )}

                    <Form.Item
                        name="customerId"
                        label="Khách hàng"
                        rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
                    >
                        <DropDownWithFilter
                            placeholder="Chọn khách hàng"
                            fetchOptions={async (keyword: string): Promise<DropDownWithFilterOption[]> => {
                                // Sử dụng TanStack Query để fetch và cache data
                                const customerQueryKeys = createQueryKeys('customers')
                                const paged = await queryClient.fetchQuery({
                                    queryKey: [...customerQueryKeys.list(), { search: keyword, page: 1, pageSize: 20 }],
                                    queryFn: () => customerApiService.getPaginated({
                                        search: keyword || undefined,
                                        page: 1,
                                        pageSize: 20,
                                    }),
                                })
                                const items = paged.items ?? []
                                return items.map((c: CustomerEntity) => ({
                                    label: `${c.name ?? 'N/A'} - ${c.phone ?? 'N/A'}`,
                                    value: c.id,
                                }))
                            }}
                            queryKeyPrefix="customer-order-create"
                            fetchOnEmpty={true}
                        />
                    </Form.Item>

                    <Card title="Thêm sản phẩm" size="small" style={{ marginBottom: 16 }}>
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <Form.Item
                                name="productId"
                                label="Sản phẩm"
                                rules={[{ required: false }]}
                            >
                                <DropDownWithFilter
                                    placeholder="Chọn sản phẩm"
                                    value={selectedProduct}
                                    onChange={(value) => setSelectedProduct(value as number | null)}
                                    fetchOptions={async (keyword: string): Promise<DropDownWithFilterOption[]> => {
                                        // Sử dụng TanStack Query để fetch và cache data
                                        const paged = await queryClient.fetchQuery({
                                            queryKey: [...productQueryKeys.list(), { search: keyword, page: 1, pageSize: 20 }],
                                            queryFn: () => productApiService.getPaginated({
                                                search: keyword || undefined,
                                                page: 1,
                                                pageSize: 20,
                                            }),
                                        })
                                        const items = paged.items ?? []
                                        return items.map((p: ProductEntity) => ({
                                            label: `${p.productName ?? `#${p.id}`} - ${p.price?.toLocaleString()} đ`,
                                            value: p.id,
                                        }))
                                    }}
                                    queryKeyPrefix="product-order-create"
                                    fetchOnEmpty={true}
                                />
                            </Form.Item>

                            <Form.Item
                                name="quantity"
                                label="Số lượng"
                                initialValue={1}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số lượng' },
                                    { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0' },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: '100%' }}
                                    placeholder="Nhập số lượng"
                                    value={quantity}
                                    onChange={(value) => setQuantity(value || 1)}
                                />
                            </Form.Item>

                            <Space style={{ width: '100%' }} size="middle">
                                <Button
                                    type="dashed"
                                    icon={<PlusOutlined />}
                                    onClick={handleAddProduct}
                                    style={{ flex: 1 }}
                                >
                                    Thêm vào đơn hàng
                                </Button>
                                <Button
                                    type="default"
                                    icon={<QrcodeOutlined />}
                                    onClick={handleScanClick}
                                    style={{ flex: 1 }}
                                >
                                    Scan
                                </Button>
                            </Space>
                        </Space>
                    </Card>

                    <Form.Item
                        name="promoCode"
                        label="Mã khuyến mãi"
                    >
                        <Input placeholder="Nhập mã khuyến mãi (tùy chọn)" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Tạo đơn hàng
                            </Button>
                            <Button onClick={handleCancel}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>

            {/* Preview panel bên phải */}
            <div style={{ flex: 1 }}>
                <Card title="Thông tin đơn hàng" style={{ position: 'sticky', top: 0 }}>
                    {isScanning ? (
                        <QRCodeScanner
                            onScanSuccess={handleScanSuccess}
                            onScanError={handleScanError}
                            onClose={handleCancelScan}
                            visible={isScanning}
                        />
                    ) : orderItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            Chưa có sản phẩm nào trong đơn hàng
                        </div>
                    ) : (
                        <>
                            <Table<DraftOrderItem>
                                columns={previewColumns}
                                dataSource={orderItems}
                                rowKey="productId"
                                pagination={false}
                                size="small"
                                style={{ marginBottom: 16 }}
                            />

                            <Divider />

                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>Tổng tiền:</Text>
                                    <Text strong>{totalAmount.toLocaleString()} đ</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>Giảm giá:</Text>
                                    <Text type="success">-0 đ</Text>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Title level={5} style={{ margin: 0 }}>Thành tiền:</Title>
                                    <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
                                        {totalAmount.toLocaleString()} đ
                                    </Title>
                                </div>
                            </Space>
                        </>
                    )}
                </Card>
            </div>

            {/* Product Preview Modal */}
            <ProductPreviewModal
                product={scannedProduct}
                open={isPreviewModalOpen}
                onConfirm={handleConfirmProduct}
                onCancel={handleCancelPreview}
                loading={isSearchingProduct}
            />
        </div>
    )
}

