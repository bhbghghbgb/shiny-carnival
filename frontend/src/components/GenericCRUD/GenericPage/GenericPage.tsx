import { useMemo, useState } from 'react'
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table'
import type { SorterResult } from 'antd/es/table/interface'
import type { GenericPageConfig } from './GenericPageConfig'

type Order = 'ascend' | 'descend' | undefined

export interface GenericPageProps<TData, TCreate, TUpdate> {
    config: GenericPageConfig<TData, TCreate, TUpdate>
    data: TData[]
    total?: number
    loading?: boolean
    page?: number
    pageSize?: number
    onPageChange?: (page: number, pageSize: number) => void
    onSortChange?: (field: string, order: Exclude<Order, undefined>) => void
    sortField?: string
    sortOrder?: Exclude<Order, undefined>
    headerSlot?: React.ReactNode
    renderHeader?: (helpers: { openCreate: () => void }) => React.ReactNode
    statisticsSlot?: React.ReactNode
    filtersSlot?: React.ReactNode
    extraToolbar?: React.ReactNode
    onCreate?: (values: TCreate) => Promise<void> | void
    onUpdate?: (record: TData, values: TUpdate) => Promise<void> | void
    onDelete?: (record: TData) => Promise<void> | void
    createLoading?: boolean
    updateLoading?: boolean
    deleteLoading?: boolean
}

export function GenericPage<TData extends { id?: string | number }, TCreate, TUpdate>({
    config,
    data,
    total,
    loading,
    page = 1,
    pageSize = 10,
    onPageChange,
    onSortChange,
    headerSlot,
    renderHeader,
    statisticsSlot,
    filtersSlot,
    extraToolbar,
    sortField,
    sortOrder,
    onCreate,
    onUpdate,
    onDelete,
    createLoading,
    updateLoading,
    deleteLoading,
}: GenericPageProps<TData, TCreate, TUpdate>) {
    const [form] = Form.useForm()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingRecord, setEditingRecord] = useState<TData | null>(null)

    const actionColumn = useMemo<ColumnsType<TData>[number]>(() => {
        const actions = []
        if (config.features?.enableEdit !== false && onUpdate) {
            actions.push('edit')
        }
        if (config.features?.enableDelete !== false && onDelete) {
            actions.push('delete')
        }

        if (!actions.length) return undefined

        return {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {actions.includes('edit') && (
                        <Button size="small" onClick={() => handleEdit(record)}>
                            Edit
                        </Button>
                    )}
                    {actions.includes('delete') && (
                        <Popconfirm
                            title="Xóa người dùng?"
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={() => handleDelete(record)}
                        >
                            <Button size="small" danger loading={deleteLoading}>
                                Delete
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        }
    }, [config.features?.enableDelete, config.features?.enableEdit, deleteLoading, onDelete, onUpdate])

    const columns: ColumnsType<TData> = useMemo(() => {
        const base = config.table.columns
        const merged = actionColumn ? [...base, actionColumn] : base
        if (!sortField || !sortOrder) return merged
        return merged.map((col) => {
            const isMatch =
                (typeof col.dataIndex === 'string' && col.dataIndex === sortField) ||
                col.key === sortField
            return isMatch ? { ...col, sortOrder } : col
        })
    }, [actionColumn, config.table.columns, sortField, sortOrder])

    const pagination: TablePaginationConfig = {
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        onChange: (current, size) => onPageChange?.(current, size ?? pageSize),
    }

    const handleTableChange: TableProps<TData>['onChange'] = (_p, _f, sorter) => {
        const s = Array.isArray(sorter) ? sorter[0] : sorter
        if (s && s.order && s.field && typeof s.field === 'string') {
            onSortChange?.(s.field, s.order)
        }
    }

    const openCreateModal = () => {
        setEditingRecord(null)
        const initial = config.form.getCreateInitialValues?.() ?? {}
        form.setFieldsValue(initial)
        setIsModalVisible(true)
    }

    const handleEdit = (record: TData) => {
        setEditingRecord(record)
        const initial =
            config.form.getUpdateInitialValues?.(record) ?? (record as unknown as Partial<TUpdate>)
        form.setFieldsValue(initial)
        setIsModalVisible(true)
    }

    const handleDelete = async (record: TData) => {
        if (!onDelete) return
        try {
            await onDelete(record)
            message.success('Xóa thành công')
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Không thể xóa'
            message.error(msg)
        }
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            if (editingRecord) {
                if (!onUpdate) return
                const payload = config.form.mapUpdatePayload
                    ? config.form.mapUpdatePayload(values, editingRecord)
                    : values
                await onUpdate(editingRecord, payload)
                message.success(`${config.entity.displayName} đã được cập nhật`)
            } else {
                if (!onCreate) return
                await onCreate(values)
                message.success(`${config.entity.displayName} đã được tạo`)
            }
            form.resetFields()
            setIsModalVisible(false)
            setEditingRecord(null)
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'errorFields' in error) {
                return
            }
            const msg = error instanceof Error ? error.message : 'Thao tác không thành công'
            message.error(msg)
        }
    }

    const closeModal = () => {
        setIsModalVisible(false)
        setEditingRecord(null)
        form.resetFields()
    }

    const renderFormFields = useMemo(() => {
        const fields = editingRecord ? config.form.update : config.form.create
        return fields.map((field) => {
            if (field.type === 'select') {
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        rules={field.rules}
                    >
                        <Select
                            placeholder={field.placeholder}
                            options={field.options}
                            allowClear
                        />
                    </Form.Item>
                )
            }

            if (field.type === 'password') {
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        rules={field.rules}
                    >
                        <Input.Password placeholder={field.placeholder} />
                    </Form.Item>
                )
            }

            return (
                <Form.Item
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    rules={field.rules}
                >
                    <Input placeholder={field.placeholder} />
                </Form.Item>
            )
        })
    }, [config.form.create, config.form.update, editingRecord])

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {renderHeader ? renderHeader({ openCreate: openCreateModal }) : headerSlot}
            {statisticsSlot}
            {filtersSlot}

            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space>
                    {config.features?.enableCreate !== false && onCreate && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openCreateModal}
                        >
                            Thêm {config.entity.displayName}
                        </Button>
                    )}
                    {extraToolbar}
                </Space>
            </Space>

            <Table<TData>
                rowKey={config.table.rowKey}
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
            />

            <Modal
                title={
                    editingRecord
                        ? `Cập nhật ${config.entity.displayName}`
                        : `Thêm ${config.entity.displayName}`
                }
                open={isModalVisible}
                onOk={handleSubmit}
                onCancel={closeModal}
                confirmLoading={editingRecord ? updateLoading : createLoading}
                destroyOnClose
                forceRender
            >
                <Form form={form} layout="vertical">
                    {renderFormFields}
                </Form>
            </Modal>
        </Space>
    )
}

