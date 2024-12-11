import { createContext, useContext } from 'react'

const UserDataContext = createContext<any>(null)

export function useUserData() {
  const context = useContext(UserDataContext)
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider')
  }
  return context
}

export default UserDataContext

