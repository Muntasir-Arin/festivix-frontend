'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { User } from 'lucide-react'

export default function ProfilePage() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setUserData(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch user data')
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="md:shrink-0">
            {userData?.profilePicture ? (
              <img
                className="h-48 w-full object-cover md:h-full md:w-48"
                src={`${userData.profilePicture}?s=500`}
                alt={userData?.name}
              />
            ) : (
              <div className="h-48 w-full md:h-full md:w-48 bg-gray-300 flex items-center justify-center">
                <User className="h-24 w-24 text-gray-500" />
              </div>
            )}
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">User Profile</div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">{userData?.username}</h1>
            <p className="mt-2 text-slate-500">{userData?.email}</p>
            <p className="mt-2 text-slate-500">Role: {userData?.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}