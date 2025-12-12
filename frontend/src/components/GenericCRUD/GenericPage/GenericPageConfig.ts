import type { ColumnsType } from 'antd/es/table'
import type { Rule } from 'antd/es/form'
import type { DropDownWithFilterOption } from '../../common/DropDownWithFilter'

export type GenericFieldType = 'text' | 'password' | 'select' | 'number' | 'remote-select'

export interface GenericSelectOption {
    label: string
    value: string | number | boolean
}

export interface GenericFormField<TValues> {
    name: keyof TValues & string
    label: string
    type: GenericFieldType
    rules?: Rule[]
    placeholder?: string
    options?: GenericSelectOption[]
    // Remote select
    fetchOptions?: (keyword: string) => Promise<DropDownWithFilterOption[]>
    queryKeyPrefix?: string
    fetchOnEmpty?: boolean
}

export interface GenericPageConfig<TData, TCreate, TUpdate> {
    entity: {
        name: string
        displayName: string
        displayNamePlural: string
    }
    table: {
        columns: ColumnsType<TData>
        rowKey: string
    }
    form: {
        create: GenericFormField<TCreate>[]
        update: GenericFormField<TUpdate>[]
        getCreateInitialValues?: () => Partial<TCreate>
        getUpdateInitialValues?: (record: TData) => Partial<TUpdate>
        mapCreatePayload?: (values: any) => TCreate
        mapUpdatePayload?: (values: TUpdate, record: TData) => TUpdate
    }
    features?: {
        enableCreate?: boolean
        enableEdit?: boolean
        enableDelete?: boolean
    }
}

