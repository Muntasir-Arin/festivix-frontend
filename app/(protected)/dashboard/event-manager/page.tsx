"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { format } from 'date-fns'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, PlusCircle, BarChart, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Event {
  _id: string
  id: string
  name: string
  date: string
  time: string
}

export default function EventDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event/user`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEvents(response.data.events)
    } catch (err) {
      setError('Failed to fetch events. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateEvent = () => {
    router.push('/manage/create-event')
  }

  const handleAnalyze = (eventId: string) => {
    router.push(`/events/${eventId}/analyze`)
  }

  const handleEdit = (eventId: string) => {
    router.push(`/events/${eventId}/edit`)
  }

  const handleDelete = async (eventId: string) => {
    try {
      const token = localStorage.getItem('authToken')
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event/delete/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Event deleted successfully')
      fetchEvents()
    } catch (err) {
      toast.error('Failed to delete event. Please try again.')
      console.error('Error deleting event:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
        <div className="flex flex-1 h-screen">
        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
  
      <div className="container mx-auto py-8">
        <div className="flex justify-center mt-9">
          <Button onClick={handleCreateEvent}>
            <PlusCircle className=" h-4 w-4" /> Create Event
          </Button>
        </div>
        
      </div>
      </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 h-screen">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">

    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Events</h1>
        <Button onClick={handleCreateEvent}>
          <PlusCircle className=" h-4 w-4" /> Create Event
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event._id} className="flex flex-col">
            <CardContent className="flex-grow p-6">
              <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
              <p className="text-gray-600">
                {format(new Date(`${event.date}`), 'PPP')}
              </p>
              <p className="text-gray-600">
              
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0">
              <Button variant="outline" size="sm" onClick={() => handleAnalyze(event._id)}>
                <BarChart className=" h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(event._id)}>
                <Pencil className=" h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className=" h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the event
                      and remove all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(event._id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
    </div>
    </div>
  )
}

