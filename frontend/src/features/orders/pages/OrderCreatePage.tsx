import {
    Card,
    Form,
    Input,
    Button,
    Space,
    Typography,
    Row,
    Col,
    Table,
    InputNumber,
    Select,
    message,
} from 'antd'
import {
    ArrowLeftOutlined,
    PlusOutlined,
    DeleteOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ENDPOINTS } from '../../../app/routes/type/endpoint'
// import { getRouteApi } from '@tanstack/react-router'
import { products as mockProducts } from '../../../_mocks/products'
import { customers as mockCustomers } from '../../../_mocks/customers'
import { orders as mockOrders, addMockOrder } from '../../../_mocks/orders'
import { emitOrdersChanged } from '../utils/orderEvents'

const { Title } = Typography
// const routeApi = getRouteApi('/admin/orders/create')

interface OrderItem {
    key: string
    productId: number
    productName: string
    price: number
    quantity: number
    subtotal: number
}

export const OrderCreatePage = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
    const [quantity, setQuantity] = useState(1)

    // Use mock data (for development)
    const products = mockProducts
    const customers = mockCustomers

    // TODO: Uncomment below to use API data from route loader
    // const { products, customers } = routeApi.useLoaderData()

    const handleAddItem = () => {
        if (!selectedProduct) {
            message.warning('Vui lòng chọn sản phẩm!')
            return
        }

        const product = products.find((p) => p.id === selectedProduct)
        if (!product) return

        const existingItem = orderItems.find(
            (item) => item.productId === selectedProduct
        )

        if (existingItem) {
            // Update quantity if product already exists
            setOrderItems(
                orderItems.map((item) =>
                    item.productId === selectedProduct
                        ? {
                              ...item,
                              quantity: item.quantity + quantity,
                              subtotal: (item.quantity + quantity) * item.price,
                          }
                        : item
                )
            )
        } else {
            // Add new item
            const newItem: OrderItem = {
                key: `${Date.now()}`,
                productId: product.id,
                productName: product.productName,
                price: product.price,
                quantity: quantity,
                subtotal: product.price * quantity,
            }
            setOrderItems([...orderItems, newItem])
        }

        setSelectedProduct(null)
        setQuantity(1)
        message.success('Đã thêm sản phẩm vào đơn hàng!')
    }

    const handleRemoveItem = (key: string) => {
        setOrderItems(orderItems.filter((item) => item.key !== key))
        message.success('Đã xóa sản phẩm khỏi đơn hàng!')
    }

    const handleQuantityChange = (key: string, newQuantity: number) => {
        setOrderItems(
            orderItems.map((item) =>
                item.key === key
                    ? {
                          ...item,
                          quantity: newQuantity,
                          subtotal: newQuantity * item.price,
                      }
                    : item
            )
        )
    }

    const calculateTotal = () => {
        return orderItems.reduce((sum, item) => sum + item.subtotal, 0)
    }

    const handleSubmit = async (values: any) => {
        if (orderItems.length === 0) {
            message.warning('Vui lòng thêm ít nhất một sản phẩm vào đơn hàng!')
            return
        }

        try {
            // Development: mutate mock orders in-memory
            const items = orderItems.map((item, idx) => ({
                orderItemId:
                    idx +
                    1 +
                    mockOrders.reduce(
                        (m, o) =>
                            Math.max(
                                m,
                                ...(o.orderItems?.map(
                                    (i: any) => i.orderItemId
                                ) || [0])
                            ),
                        0
                    ),
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.subtotal,
            }))

            const totalAmount = items.reduce((s, i) => s + i.subtotal, 0)

            addMockOrder({
                customerId: values.customerId,
                userId: 1,
                promoId: values.promoCode ? 1 : null,
                totalAmount,
                orderItems: items,
            })

            emitOrdersChanged()
            message.success('Tạo đơn hàng thành công!')
            navigate({ to: ENDPOINTS.ADMIN.ORDERS.LIST })
        } catch (error) {
            message.error('Không thể tạo đơn hàng!')
            console.error('Create order error:', error)
        }
    }

    const handleBack = () => {
        navigate({ to: ENDPOINTS.ADMIN.ORDERS.LIST })
    }

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity: number, record: OrderItem) => (
                <InputNumber
                    min={1}
                    value={quantity}
                    onChange={(value) =>
                        handleQuantityChange(record.key, value || 1)
                    }
                    style={{ width: '80px' }}
                />
            ),
        },
        {
            title: 'Thành tiền',
            dataIndex: 'subtotal',
            key: 'subtotal',
            render: (subtotal: number) =>
                `${subtotal.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: OrderItem) => (
                <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record.key)}
                >
                    Xóa
                </Button>
            ),
        },
    ]

    return (
        <div
            style={{
                padding: '24px',
                background: '#f5f5f5',
                minHeight: '100vh',
            }}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Space>
                                <Button
                                    icon={<ArrowLeftOutlined />}
                                    onClick={handleBack}
                                    style={{ borderRadius: '8px' }}
                                >
                                    Quay lại
                                </Button>
                                <Title
                                    level={2}
                                    style={{ margin: 0, color: '#1890ff' }}
                                >
                                    <ShoppingCartOutlined
                                        style={{ marginRight: '8px' }}
                                    />
                                    Tạo đơn hàng mới
                                </Title>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Order Form */}
                <Card
                    title="Thông tin đơn hàng"
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="customerId"
                                    label="Khách hàng"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Vui lòng chọn khách hàng!',
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn khách hàng"
                                        showSearch
                                        optionFilterProp="children"
                                    >
                                        {customers.map((customer) => (
                                            <Select.Option
                                                key={customer.id}
                                                value={customer.id}
                                            >
                                                {customer.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="promoCode"
                                    label="Mã khuyến mãi"
                                >
                                    <Input placeholder="Nhập mã khuyến mãi (nếu có)" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                {/* Add Products */}
                <Card
                    title="Thêm sản phẩm"
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Row gutter={16} align="bottom">
                        <Col span={12}>
                            <Space.Compact style={{ width: '100%' }}>
                                <Select
                                    placeholder="Chọn sản phẩm"
                                    value={selectedProduct}
                                    onChange={setSelectedProduct}
                                    style={{ width: '70%' }}
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {products.map((product) => (
                                        <Select.Option
                                            key={product.id}
                                            value={product.id}
                                        >
                                            {product.productName} -{' '}
                                            {product.price.toLocaleString(
                                                'vi-VN'
                                            )}{' '}
                                            ₫
                                        </Select.Option>
                                    ))}
                                </Select>
                                <InputNumber
                                    min={1}
                                    value={quantity}
                                    onChange={(value) =>
                                        setQuantity(value || 1)
                                    }
                                    placeholder="Số lượng"
                                    style={{ width: '30%' }}
                                />
                            </Space.Compact>
                        </Col>
                        <Col span={4}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddItem}
                                block
                                style={{ borderRadius: '8px' }}
                            >
                                Thêm
                            </Button>
                        </Col>
                    </Row>
                </Card>

                {/* Order Items Table */}
                <Card
                    title={`Chi tiết sản phẩm (${orderItems.length} sản phẩm)`}
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                    extra={
                        <Title
                            level={4}
                            style={{ margin: 0, color: '#52c41a' }}
                        >
                            Tổng: {calculateTotal().toLocaleString('vi-VN')} ₫
                        </Title>
                    }
                >
                    <Table
                        dataSource={orderItems}
                        columns={columns}
                        pagination={false}
                        locale={{ emptyText: 'Chưa có sản phẩm nào' }}
                    />
                </Card>

                {/* Actions */}
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Row justify="end" gutter={16}>
                        <Col>
                            <Button
                                onClick={handleBack}
                                size="large"
                                style={{ borderRadius: '8px' }}
                            >
                                Hủy
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => form.submit()}
                                style={{ borderRadius: '8px' }}
                            >
                                Tạo đơn hàng
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </Space>
        </div>
    )
}
