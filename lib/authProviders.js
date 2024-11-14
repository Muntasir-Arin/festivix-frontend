'use client'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
export function AuthProvider({ children }) {
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      Cookies.set('authToken', token, { expires: 10 }) 
    }
  }, [])
  return <>{children}</>
}