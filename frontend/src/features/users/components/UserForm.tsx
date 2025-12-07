import { Form, Input, Select } from 'antd'
import type { UserNoPass } from '../types/entity'

interface UserFormProps {
    form: any
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
                    { min: 6, message: 'Password phải có ít nhất 6 ký tự!' },
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
