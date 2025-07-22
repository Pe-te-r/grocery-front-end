// components/users/UserDetailsModalContext.tsx
import type { allUserQuery } from '@/util/types'
import { createContext, useContext, useState } from 'react'
import { UserDetailsModal } from './UserDetailsModal'

type UserDetailsModalContextType = {
  openModal: (userId: string, roleQuery: allUserQuery) => void
  closeModal: () => void
}

const UserDetailsModalContext = createContext<UserDetailsModalContextType>({
  openModal: () => {},
  closeModal: () => {},
})

export const UserDetailsModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [roleQuery, setRoleQuery] = useState<allUserQuery>({})

  const openModal = (id: string, query: allUserQuery) => {
    setUserId(id)
    setRoleQuery(query)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setUserId(null)
    setRoleQuery({})
  }

  return (
    <UserDetailsModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isOpen && userId && (
        <UserDetailsModal userId={userId} roleQuery={roleQuery} onClose={closeModal} />
      )}
    </UserDetailsModalContext.Provider>
  )
}

export const useUserDetailsModal = () => useContext(UserDetailsModalContext)