// frontend/src/components/common/GenericSearchFilter.tsx
import { Card, Row, Col, Space, Input, Button, Select } from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ClearOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons';
import type { GenericPageConfig } from '../../types/generic-page';

const { Search } = Input;

interface GenericSearchFilterProps {
    searchText: string;
    onSearchChange: (value: string) => void;
    onClearFilters: () => void;
    searchPlaceholder?: string;
    filterControls?: React.ReactNode;
    sortControls?: React.ReactNode;
}

export const GenericSearchFilter = ({
    searchText,
    onSearchChange,
    onClearFilters,
    searchPlaceholder = 'Tìm kiếm...',
    filterControls,
    sortControls,
}: GenericSearchFilterProps) => {
    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
                marginBottom: '24px',
            }}
        >
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <SearchOutlined style={{ color: '#1890ff' }} />
                            <span style={{ fontWeight: 500 }}>Tìm kiếm</span>
                        </div>
                        <Search
                            placeholder={searchPlaceholder}
                            value={searchText}
                            onChange={(e) => onSearchChange(e.target.value)}
                            allowClear
                            style={{ width: '100%' }}
                        />
                    </Space>
                </Col>

                {filterControls && (
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FilterOutlined style={{ color: '#1890ff' }} />
                                <span style={{ fontWeight: 500 }}>Bộ lọc</span>
                            </div>
                            {filterControls}
                        </Space>
                    </Col>
                )}

                {sortControls && (
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <SortAscendingOutlined style={{ color: '#1890ff' }} />
                                <span style={{ fontWeight: 500 }}>Sắp xếp</span>
                            </div>
                            {sortControls}
                        </Space>
                    </Col>
                )}

                <Col xs={24} sm={12} md={8} lg={6}>
                    <Space
                        direction="vertical"
                        style={{ width: '100%', height: '100%', justifyContent: 'flex-end' }}
                    >
                        <div style={{ visibility: 'hidden' }}>Actions</div>
                        <Button
                            icon={<ClearOutlined />}
                            onClick={onClearFilters}
                            style={{
                                borderRadius: '8px',
                                borderColor: '#ff4d4f',
                                color: '#ff4d4f',
                            }}
                        >
                            Xóa bộ lọc
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};