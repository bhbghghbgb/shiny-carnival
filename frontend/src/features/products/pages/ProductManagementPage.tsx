import {useState} from 'react';
import {Table, Button, Modal, Form, Input} from 'antd';
import {ProductForm} from '../components/ProductForm';
import {Route} from '../../../app/routes/products';

export function ProductManagementPage() {
    // Lấy dữ liệu và search params từ route context
    const { data: productsData } = Route.useLoaderData();
    const { page, pageSize, search } = Route.useSearch();
    const navigate = Route.useNavigate();


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                console.log('Form Values: ', values);
                // Logic để thêm sản phẩm
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

    const handleSearch = (value: string) => {
        navigate({
            search: (prev) => ({...prev, search: value || undefined, page: 1}),
        });
    };

    const columns = [
        {title: 'ID', dataIndex: 'id', key: 'id'},
        {title: 'Product Name', dataIndex: 'productName', key: 'productName'},
        {title: 'Barcode', dataIndex: 'barcode', key: 'barcode'},
        {title: 'Price', dataIndex: 'price', key: 'price'},
        {title: 'Unit', dataIndex: 'unit', key: 'unit'},
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
            <div style={{marginBottom: 16, display: 'flex', justifyContent: 'space-between'}}>
                <Button type="primary" onClick={showModal}>
                    Add Product
                </Button>
                <Input.Search
                    placeholder="Search products"
                    onSearch={handleSearch}
                    style={{width: 300}}
                    defaultValue={search}
                    allowClear
                />
            </div>
            <Table
                dataSource={productsData?.items}
                columns={columns}
                rowKey="id"
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: productsData?.totalCount,
                    onChange: (newPage, newPageSize) => {
                        navigate({
                            search: (prev) => ({...prev, page: newPage, pageSize: newPageSize}),
                        });
                    },
                }}
            />
            <Modal
                title="Add New Product"
                open={isModalVisible} // 'visible' is deprecated, use 'open'
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <ProductForm form={form}/>
            </Modal>
        </div>
    );
}
