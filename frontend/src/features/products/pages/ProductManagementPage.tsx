import { useState } from 'react';
import { Table, Button, Modal, Form } from 'antd';
import { ProductForm } from '../components/ProductForm';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/admin/products');

export function ProductManagementPage() {
    const { products } = routeApi.useLoaderData();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const params = routeApi.useParams();

    console.log('Products:', products);
    console.log('Route params:', params);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                console.log('Form Values: ', values);
                // Here you would typically call a service to add the product
                form.resetFields();
                setIsModalVisible(false);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
        { title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        { title: 'Unit', dataIndex: 'unit', key: 'unit' },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <span>
           <Button type="link">Edit</Button>
           <Button type="link" danger>Delete</Button>
         </span>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={showModal}>
                    Add Product
                </Button>
            </div>
            <Table dataSource={products} columns={columns} rowKey="id" />
            <Modal
                title="Add New Product"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <ProductForm form={form} />
            </Modal>
        </div>
    );
}
