'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from 'date-fns'

interface User {
  _id: string
  username: string
  email: string
}

interface CheckedBy {
  _id: string
  username: string
}

interface Application {
  _id: string
  user: User
  applicationDate: string
  applicationReason: string
  applicationStatus: 'Pending' | 'Approved' | 'Declined'
  checkedBy: CheckedBy | null
  checkDate: string | null
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applymanager/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setApplications(response.data.applications)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error("Failed to fetch applications. Please try again.")
      setLoading(false)
    }
  }

  const handleApplicationAction = async (applicationId: string, action: 'Approved' | 'Declined') => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applymanager/review`,
        { 
          applicationId, // Pass applicationId as applicationId
          status: action  // Pass action as status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 200) {
        setApplications(applications.map(app => 
          app._id === applicationId 
            ? { ...app, applicationStatus: action }
            : app
        ));
        toast.success(`Application ${action} successfully.`);
      } else {
        throw new Error('Failed to update application');
      }
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      toast.error(`Failed to ${action} application. Please try again.`);
    }
  };
  

  const getStatusBadge = (status: Application['applicationStatus']) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline">Pending</Badge>
      case 'Approved':
        return <Badge variant="default">Approved</Badge>
      case 'Declined':
        return <Badge variant="destructive">Declined</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Applications</h1>
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-4 w-[200px] mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-[100px] mr-2" />
              <Skeleton className="h-10 w-[100px]" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-1 h-screen ">
    <div className="overflow-y-auto p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
  
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Applications</h1>
      <div className="space-y-6">
        {applications.map((application) => (
          <Card key={application._id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl">{application.user.username}</CardTitle>
              <CardDescription>{application.user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">{application.applicationReason}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Applied {formatDistanceToNow(new Date(application.applicationDate), { addSuffix: true })}
                </span>
                {getStatusBadge(application.applicationStatus)}
              </div>
              {application.checkedBy && (
                <p className="text-sm text-muted-foreground mt-2">
                  Checked by {application.checkedBy.username} {formatDistanceToNow(new Date(application.checkDate!), { addSuffix: true })}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              {application.applicationStatus === 'Pending' && (
                <>
                  <Button 
                    onClick={() => handleApplicationAction(application._id, 'Approved')}
                    className="mr-2"
                  >
                    Approve
                  </Button>
                  <Button 
                    onClick={() => handleApplicationAction(application._id, 'Declined')}
                    variant="outline"
                  >
                    Decline
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
    </div>
    </div>
  )
}

