import { getRouteApi } from '@tanstack/react-router';
import { Button, Form, Modal, Table } from 'antd';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useState } from 'react';
import { ProductForm } from '../components/ProductForm';

const routeApi = getRouteApi('/admin/products');
pdfMake.vfs = pdfFonts.vfs;

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

    const exportPDF = () => {
        const docDefinition = {
            content: [
                { text: "Danh sách sản phẩm", style: "header" },
    
                {
                    table: {
                        headerRows: 1,
                        widths: ["auto", "*", "auto", "auto", "auto"],
                        body: [
                            ["ID", "Tên sản phẩm", "Barcode", "Giá", "ĐVT"],
                            ...products.map((p) => [
                                p.id,
                                p.productName,
                                p.barcode,
                                p.price,
                                p.unit,
                            ]),
                        ],
                    },
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 20],
                },
            },
        };
    
        pdfMake.createPdf(docDefinition).download("products.pdf");
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
            <div style={{ marginBottom: 16 ,  marginLeft: 12}}>
                <Button type="primary" onClick={showModal}>
                    Add Product
                </Button>

                <Button type="primary" onClick={exportPDF} style={{ marginLeft: 12 }}>
                    Export PDF 
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
