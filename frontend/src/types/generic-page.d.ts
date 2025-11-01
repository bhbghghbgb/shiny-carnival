// frontend/src/types/generic-page.d.ts
import { ColumnType } from 'antd/es/table';
import { FormItemProps } from 'antd';

export interface ApiEndpoints<T> {
    getAll: (params: any) => Promise<ApiResponse<PaginatedData<T>>>;
    create: (data: Partial<T>) => Promise<ApiResponse<T>>;
    update: (id: number | string, data: Partial<T>) => Promise<ApiResponse<T>>;
    delete: (id: number | string) => Promise<ApiResponse<any>>;
}

export interface FormField extends FormItemProps {
    // Có thể thêm các thuộc tính tùy chỉnh nếu cần
    // Ví dụ: componentType: 'input' | 'select' | 'datepicker';
}

export interface StatisticsConfig {
    enabled: boolean;
    calculateFn?: (data: any[]) => any;
    statisticsItems?: {
        title: string;
        value: number;
        icon?: React.ReactNode;
        color?: string;
    }[];
}

export interface SearchConfig {
    enabled: boolean;
    placeholder?: string;
    onSearch?: (value: string) => void;
}

export interface FilterConfig {
    enabled: boolean;
    filters: {
        name: string;
        type: 'select' | 'input' | 'date' | 'range';
        options?: any[];
        placeholder?: string;
    }[];
    onFilter?: (filters: any) => void;
}

export interface FormConfig {
    layout?: 'horizontal' | 'vertical' | 'inline';
    labelCol?: { span: number };
    wrapperCol?: { span: number };
    initialValues?: any;
}

export interface CustomAction {
    name: string;
    icon?: React.ReactNode;
    onClick: (record: any) => void;
    visible?: (record: any) => boolean;
    disabled?: (record: any) => boolean;
    confirm?: {
        title: string;
        content: string;
    };
}

export interface GenericPageConfig<T> {
    // Cấu hình chung
    title: string;
    entityName: string;
    permissions?: string[];

    // Cấu hình hiển thị
    columns: any[];
    statisticsConfig?: StatisticsConfig;
    searchConfig?: SearchConfig;
    filterConfig?: FilterConfig;

    // Cấu hình form
    formFields: any[];
    formConfig?: FormConfig;

    // API endpoints
    apiEndpoints: {
        list: string;
        create: string;
        update: string;
        delete: string;
    };

    // Cấu hình hành động tùy chỉnh
    customActions?: CustomAction[];
    enableCreate?: boolean;
    enableUpdate?: boolean;
    enableDelete?: boolean;

    // Callback functions
    onRowClick?: (record: T) => void;
    onCreateSuccess?: (data: T) => void;
    onUpdateSuccess?: (data: T) => void;
    onDeleteSuccess?: (id: string) => void;

    // Cấu hình UI
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
    additionalControls?: React.ReactNode;
}