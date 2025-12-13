import { FileExcelOutlined, FilePdfOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { exportTablePdf } from '../../../utils/exportPdf';
import { importTableExcel } from '../../../utils/importExcel';
import type { CreateProductRequest, ProductEntity } from '../api';
import { productPageConfig } from '../config/productPageConfig';
import { useProductManagementPage } from '../hooks';

const { Title, Text } = Typography

interface ProductHeaderProps {
    products : ProductEntity[];

}

export const ProductHeader = ({ products }: ProductHeaderProps) => {
    const {createProduct} = useProductManagementPage()

    const exportPDF = () => {
        exportTablePdf(productPageConfig,products,"products");
    };
    const importExcel = async (file: File) => {
        await importTableExcel(file, payload => 
            createProduct.mutateAsync({
                ...(payload as CreateProductRequest),
            })
        );
    };

    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
            }}
        >
            <Row justify="space-between" align="middle">
                <Col>
                    <Space direction="vertical" size="small">
                        <Title
                            level={2}
                            style={{ margin: 0, color: '#1890ff' }}
                        >
                            <ShoppingOutlined style={{ marginRight: '8px' }} />
                            Quản lý sản phẩm
                        </Title>
                        <Text type="secondary">
                            Quản lý thông tin sản phẩm, giá cả và tồn kho trong
                            hệ thống
                        </Text>
                    </Space>
                </Col>
                <Col>
                    <Space>
                    <input
                            id="importExcelInput"
                            type="file"
                            accept=".xlsx, .xls"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) importExcel(file);
                            }}
                        />
                    <Button
                            type="primary"
                            size="large"
                            icon={<FileExcelOutlined />}
                            onClick={() => document.getElementById("importExcelInput")?.click()}
                            style={{
                                borderRadius: '8px',
                                height: '40px',
                                paddingLeft: '20px',
                                paddingRight: '20px',
                                background: '#4caf50',
                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                            }}
                        >
                            Import Excel
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            icon={<FilePdfOutlined />}
                            onClick={exportPDF}
                            style={{
                                borderRadius: '8px',
                                height: '40px',
                                paddingLeft: '20px',
                                paddingRight: '20px',
                                background: '#d9534f',
                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                            }}
                        >
                            Export PDF
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    )
}

