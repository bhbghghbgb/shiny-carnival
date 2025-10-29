import { users } from '../../../_mocks/users'
// Mock, sau khi có API của BE sẽ gọi tới axios instance
// Simulate API call
const getUsers = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(users)
        }, 500) // Simulate network delay
    })
}

export const userService = {
    getUsers,
}
