import { useCallback, useMemo, useState } from 'react'
import type React from 'react'
import { Alert, Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, message, DatePicker } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig, TableProps, ColumnType, ColumnGroupType } from 'antd/es/table'
import type { GenericPageConfig } from './GenericPageConfig'
import { DropDownWithFilter } from '../../common/DropDownWithFilter'
import type { Dayjs } from 'dayjs'

const { RangePicker } = DatePicker

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
    pageErrorMessage?: string | null
    onClearPageError?: () => void
    formErrorMessage?: string | null
    onClearFormError?: () => void
    renderCustomActions?: (record: TData) => React.ReactNode
    renderCustomForm?: (props: {
        mode: 'create' | 'update'
        onSubmit: (values: TCreate | TUpdate) => Promise<void>
        onCancel: () => void
        loading: boolean
        errorMessage: string | null
        onClearError: () => void
        initialValues?: Partial<TCreate | TUpdate>
        record?: TData
    }) => React.ReactNode
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
    pageErrorMessage,
    onClearPageError,
    formErrorMessage,
    onClearFormError,
    renderCustomActions,
    renderCustomForm,
}: GenericPageProps<TData, TCreate, TUpdate>) {
    const [form] = Form.useForm()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingRecord, setEditingRecord] = useState<TData | null>(null)

    const handleDelete = useCallback(async (record: TData) => {
        if (!onDelete) return
        try {
            await onDelete(record)
            message.success('Xóa thành công')
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Không thể xóa'
            message.error(msg)
        }
    }, [onDelete])

    const handleEdit = useCallback((record: TData) => {
        setEditingRecord(record)
        onClearFormError?.()
        const initial =
            config.form.getUpdateInitialValues?.(record) ?? (record as unknown as Partial<TUpdate>)
        form.setFieldsValue(initial)
        setIsModalVisible(true)
    }, [config.form, form, onClearFormError])

    const actionColumn = useMemo<ColumnsType<TData>[number] | null>(() => {
        const actions: Array<'edit' | 'delete'> = []
        if (config.features?.enableEdit !== false && onUpdate) {
            actions.push('edit')
        }
        if (config.features?.enableDelete !== false && onDelete) {
            actions.push('delete')
        }

        const hasCustomActions = renderCustomActions !== undefined
        if (!actions.length && !hasCustomActions) return null

        return {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {renderCustomActions && renderCustomActions(record)}
                    {actions.includes('edit') && (
                        <Button size="small" onClick={() => handleEdit(record)}>
                            Edit
                        </Button>
                    )}
                    {actions.includes('delete') && (
                        <Popconfirm
                            title="Xác nhận xóa"
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
    }, [config.features?.enableDelete, config.features?.enableEdit, deleteLoading, onDelete, onUpdate, handleDelete, handleEdit, renderCustomActions])

    const columns: ColumnsType<TData> = useMemo(() => {
        const base = config.table.columns
        const merged = actionColumn ? [...base, actionColumn] : base
        if (!sortField || !sortOrder) return merged
        return merged.map((col) => {
            const hasDataIndex =
                (col as ColumnType<TData>).dataIndex !== undefined ||
                (col as ColumnGroupType<TData>).children !== undefined
            if (
                hasDataIndex &&
                'dataIndex' in col &&
                typeof col.dataIndex === 'string' &&
                (col.dataIndex === sortField || col.key === sortField)
            ) {
                return { ...col, sortOrder }
            }
            if (!('dataIndex' in col) && col.key === sortField) {
                return { ...col, sortOrder }
            }
            return col
        })
    }, [actionColumn, config.table.columns, sortField, sortOrder])

    const pagination: TablePaginationConfig = {
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
    }

    const handleTableChange: TableProps<TData>['onChange'] = (pg, _f, sorter) => {
        // Pagination
        if (onPageChange) {
            const nextPage = pg.current ?? page
            const nextSize = pg.pageSize ?? pageSize
            if (nextPage !== page || nextSize !== pageSize) {
                onPageChange(nextPage, nextSize)
            }
        }

        // Sorting
        const s = Array.isArray(sorter) ? sorter[0] : sorter
        if (s && s.order && s.field && typeof s.field === 'string') {
            onSortChange?.(s.field, s.order)
        }
    }

    const openCreateModal = () => {
        setEditingRecord(null)
        onClearFormError?.()
        const initial = config.form.getCreateInitialValues?.() ?? {}
        form.setFieldsValue(initial)
        setIsModalVisible(true)
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            
            if (editingRecord) {
                if (!onUpdate) {
                    console.warn('onUpdate is not provided')
                    return
                }
                const payload = config.form.mapUpdatePayload
                    ? config.form.mapUpdatePayload(values, editingRecord)
                    : values
                await onUpdate(editingRecord, payload)
                message.success(`${config.entity.displayName} đã được cập nhật`)
            } else {
                if (!onCreate) return
                const payload = config.form.mapCreatePayload
                    ? config.form.mapCreatePayload(values)
                    : values
                await onCreate(payload)
                message.success(`${config.entity.displayName} đã được tạo`)
            }
            form.resetFields()
            setIsModalVisible(false)
            setEditingRecord(null)
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'errorFields' in error) {
                // Validation errors - Ant Design will display them automatically
                // But we should still show a message to user
                const errorFields = (error as { errorFields?: Array<{ name: string[]; errors: string[] }> }).errorFields
                if (errorFields && errorFields.length > 0) {
                    const firstError = errorFields[0]?.errors?.[0]
                    if (firstError) {
                        message.error(firstError)
                    }
                }
                return
            }
            const msg = error instanceof Error ? error.message : 'Thao tác không thành công'
            message.error(msg)
        }
    }

    const closeModal = () => {
        setIsModalVisible(false)
        setEditingRecord(null)
        onClearFormError?.()
        form.resetFields()
    }

    const renderFormFields = useMemo(() => {
        const fields = editingRecord ? config.form.update : config.form.create
        return fields.map((field) => {
            const fieldName = field.name as string
            if (field.type === 'select') {
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={fieldName}
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
                        name={fieldName}
                        rules={field.rules}
                    >
                        <Input.Password placeholder={field.placeholder} />
                    </Form.Item>
                )
            }

            if (field.type === 'number') {
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={fieldName}
                        rules={field.rules}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder={field.placeholder}
                        />
                    </Form.Item>
                )
            }

            if (field.type === 'remote-select' && field.fetchOptions) {
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={fieldName}
                        rules={field.rules}
                    >
                        <DropDownWithFilter
                            placeholder={field.placeholder}
                            fetchOptions={field.fetchOptions}
                            queryKeyPrefix={field.queryKeyPrefix || field.name}
                            fetchOnEmpty={field.fetchOnEmpty}
                        />
                    </Form.Item>
                )
            }

            if (field.type === 'dateRange') {
                // Merge default validation with custom rules
                const dateRangeRules = [
                    {
                        required: true,
                        message: 'Vui lòng chọn khoảng thời gian',
                        validator: (_: any, value: [Dayjs, Dayjs] | null | undefined) => {
                            if (!value || !Array.isArray(value) || value.length !== 2 || !value[0] || !value[1]) {
                                return Promise.reject(new Error('Vui lòng chọn khoảng thời gian'))
                            }
                            return Promise.resolve()
                        },
                    },
                    ...(field.rules || []),
                ]
                
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={fieldName}
                        rules={dateRangeRules}
                    >
                        <RangePicker
                            style={{ width: '100%' }}
                            showTime
                            format="DD/MM/YYYY HH:mm"
                            placeholder={
                                field.placeholder
                                    ? (field.placeholder.split(',') as [string, string])
                                    : (['Ngày bắt đầu', 'Ngày kết thúc'] as [string, string])
                            }
                        />
                    </Form.Item>
                )
            }

            return (
                <Form.Item
                    key={field.name}
                    label={field.label}
                    name={fieldName}
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
            {pageErrorMessage && (
                <Alert
                    type="error"
                    showIcon
                    closable
                    message={pageErrorMessage}
                    onClose={onClearPageError}
                />
            )}

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

            {(() => {
                // Kiểm tra xem custom form có được render hay không
                let hasCustomForm = false
                let customFormContent: React.ReactNode = null

                if (renderCustomForm) {
                    customFormContent = renderCustomForm({
                        mode: editingRecord ? 'update' : 'create',
                        onSubmit: async (values: TCreate | TUpdate) => {
                            try {
                                if (editingRecord) {
                                    if (!onUpdate) return
                                    await onUpdate(editingRecord, values as TUpdate)
                                    message.success(`${config.entity.displayName} đã được cập nhật`)
                                } else {
                                    if (!onCreate) return
                                    await onCreate(values as TCreate)
                                    message.success(`${config.entity.displayName} đã được tạo`)
                                }
                                form.resetFields()
                                setIsModalVisible(false)
                                setEditingRecord(null)
                            } catch (error) {
                                const msg = error instanceof Error ? error.message : 'Thao tác không thành công'
                                message.error(msg)
                            }
                        },
                        onCancel: closeModal,
                        loading: editingRecord ? (updateLoading || false) : (createLoading || false),
                        errorMessage: formErrorMessage || null,
                        onClearError: onClearFormError || (() => {}),
                        initialValues: editingRecord
                            ? (config.form.getUpdateInitialValues?.(editingRecord) ?? (editingRecord as unknown as Partial<TUpdate>))
                            : (config.form.getCreateInitialValues?.() ?? {}),
                        record: editingRecord || undefined,
                    })
                    hasCustomForm = customFormContent !== null
                }

                return (
                    <Modal
                        title={
                            editingRecord
                                ? `Cập nhật ${config.entity.displayName}`
                                : `Thêm ${config.entity.displayName}`
                        }
                        open={isModalVisible}
                        onOk={hasCustomForm ? undefined : handleSubmit}
                        onCancel={closeModal}
                        confirmLoading={editingRecord ? updateLoading : createLoading}
                        destroyOnClose
                        forceRender
                        width={hasCustomForm ? 1200 : undefined}
                        footer={hasCustomForm ? null : undefined}
                    >
                        {hasCustomForm ? (
                            customFormContent
                        ) : (
                            <>
                                {formErrorMessage && (
                                    <Alert
                                        style={{ marginBottom: 16 }}
                                        type="error"
                                        showIcon
                                        closable
                                        message={formErrorMessage}
                                        onClose={onClearFormError}
                                    />
                                )}
                                <Form 
                                    form={form} 
                                    layout="vertical" 
                                    onFinish={(values) => {
                                        console.log('Form onFinish called', values)
                                        handleSubmit()
                                    }}
                                >
                                    {renderFormFields}
                                </Form>
                            </>
                        )}
                    </Modal>
                )
            })()}
        </Space>
    )
}

