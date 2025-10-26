import { Button, Input } from 'antd'

interface UserPageHeaderProps {
    onAddUser: () => void
    onSearch: (value: string) => void
    searchValue?: string
}

export const UserPageHeader = ({
    onAddUser,
    onSearch,
    searchValue,
}: UserPageHeaderProps) => {
    return (
        <div
            style={{
                marginBottom: 16,
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            <Button type="primary" onClick={onAddUser}>
                Add User
            </Button>
            <Input.Search
                placeholder="Search users"
                onSearch={onSearch}
                style={{ width: 300 }}
                defaultValue={searchValue}
                allowClear
            />
        </div>
    )
}
