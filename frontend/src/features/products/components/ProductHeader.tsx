import { FileExcelOutlined, FilePdfOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { exportTablePdf } from '../../../utils/exportPdf';
import { buildOptionMap, getIdFromOptionMap, importTableExcel } from '../../../utils/importExcel';
import type { CreateProductRequest, ProductEntity } from '../api';
import { fetchCategoryOptions, fetchSupplierOptions, productPageConfig } from '../config/productPageConfig';
import { useProductManagementPage } from '../hooks';

const { Title, Text } = Typography
const categoryMap = await buildOptionMap(fetchCategoryOptions);
const supplierMap = await buildOptionMap(fetchSupplierOptions);

interface ProductHeaderProps {
    products : ProductEntity[];

}

export const ProductHeader = ({ products }: ProductHeaderProps) => {
    const {createProduct} = useProductManagementPage();
    const [categoryMap, setCategoryMap] = useState<Map<string, number>>(new Map());
    const [supplierMap, setSupplierMap] = useState<Map<string, number>>(new Map());
    const [mapsLoaded, setMapsLoaded] = useState(false);

    // Lazy load category và supplier maps khi component mount
    useEffect(() => {
        let isMounted = true;

        const loadMaps = async () => {
            try {
                const [catMap, supMap] = await Promise.all([
                    buildOptionMap(fetchCategoryOptions),
                    buildOptionMap(fetchSupplierOptions)
                ]);
                
                if (isMounted) {
                    setCategoryMap(catMap);
                    setSupplierMap(supMap);
                    setMapsLoaded(true);
                }
            } catch (error) {
                // Ignore errors khi đang redirect hoặc không có quyền truy cập
                const err = error as Error & { isRedirecting?: boolean; skipLogging?: boolean };
                if (!err.isRedirecting && !err.skipLogging) {
                    console.error('Lỗi khi tải danh sách categories/suppliers:', error);
                }
            }
        };

        loadMaps();

        return () => {
            isMounted = false;
        };
    }, []);

    const exportPDF = () => {
        exportTablePdf(productPageConfig,products,"products");
    };
    const importExcel = async (file: File) => {
        if (!mapsLoaded) {
            throw new Error('Danh sách categories và suppliers chưa được tải. Vui lòng thử lại sau.');
        }

        await importTableExcel(file, payload => 
            createProduct.mutateAsync({
                ...(payload as CreateProductRequest),
                categoryId: getIdFromOptionMap(
                    categoryMap,
                    payload.category,
                    'Danh mục'
                ),
                supplierId: getIdFromOptionMap(
                    supplierMap,
                    payload.supplier,
                    'Nhà cung cấp'
                ),
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
                            disabled={!mapsLoaded}
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

