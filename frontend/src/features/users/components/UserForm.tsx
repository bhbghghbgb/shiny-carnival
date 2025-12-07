import { Form, Input, Select } from 'antd'
import type { UserNoPass } from '../types/entity'

import type { FormInstance } from 'antd/es/form'

interface UserFormProps {
    form: FormInstance
    isEdit?: boolean
    initialValues?: UserNoPass
}

const { Option } = Select

export const UserForm = ({
    form,
    isEdit = false,
    initialValues,
}: UserFormProps) => {
    return (
        <Form
            form={form}
            layout="vertical"
            name="user_form"
            initialValues={initialValues}
            preserve={false}
        >
            <Form.Item
                name="username"
                label="Username"
                rules={[
                    { required: true, message: 'Vui lòng nhập username!' },
                    { min: 3, message: 'Username phải có ít nhất 3 ký tự!' },
                ]}
            >
                <Input disabled={isEdit} />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[
                    { required: !isEdit, message: 'Vui lòng nhập password!' },
                    // Chỉ validate min length nếu password có giá trị (không phải empty)
                    {
                        validator(_, value) {
                            if (!value || value.length === 0) {
                                // Empty password trong edit mode là OK (không đổi password)
                                return Promise.resolve()
                            }
                            if (value.length < 6) {
                                return Promise.reject(new Error('Password phải có ít nhất 6 ký tự!'))
                            }
                            return Promise.resolve()
                        },
                    },
                ]}
            >
                <Input.Password
                    placeholder={
                        isEdit
                            ? 'Để trống nếu không muốn đổi mật khẩu'
                            : 'Nhập mật khẩu'
                    }
                />
            </Form.Item>

            <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                initialValue={undefined}
            >
                <Select placeholder="Chọn vai trò" allowClear>
                    <Option value={0}>Admin</Option>
                    <Option value={1}>Staff</Option>
                </Select>
            </Form.Item>
        </Form>
    )
}
