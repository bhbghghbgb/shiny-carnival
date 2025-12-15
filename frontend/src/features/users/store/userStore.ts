import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { UserEntity } from '../types/entity'

// Types cho User Store
interface UserState {
    // State
    selectedUser: UserEntity | null

    // Actions
    setSelectedUser: (user: UserEntity | null) => void
    clearSelectedUser: () => void
}

export const useUserStore = create<UserState>()(
    devtools(
        (set) => ({
            // Initial state
            selectedUser: null,

            // Actions
            setSelectedUser: (user: UserEntity | null) => {
                set({ selectedUser: user })
            },

            clearSelectedUser: () => {
                set({ selectedUser: null })
            },
        }),
        {
            name: 'user-store',
        }
    )
)

// Selector hooks
export const useUserState = () =>
    useUserStore((state) => ({
        selectedUser: state.selectedUser,
    }))

export const useUserActions = () =>
    useUserStore((state) => ({
        setSelectedUser: state.setSelectedUser,
        clearSelectedUser: state.clearSelectedUser,
    }))
