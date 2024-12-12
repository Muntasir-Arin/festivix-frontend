'use client'

import React, { useState, useEffect } from 'react'
import StadiumCanvas from '@/components/stadium-canvas'
import StadiumEditForm from '@/components/stadium-edit-form'
import TicketFormStadium from '@/components/ticket-form-stadium'
import CinemaCanvas from '@/components/cinema-canvas'
import CinemaEditForm from '@/components/cinema-edit-form'
import TicketFormCinema from '@/components/ticket-form-cinema'
import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, BarChart, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function TicketSellingPage() {
  const [selectedZone, setSelectedZone] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [isAdmin, setIsAdmin] = useState(true)
  const [activeTab, setActiveTab] = useState('cinema')
  const [isEditMode, setIsEditMode] = useState(false)
  const [stadiumPrices, setStadiumPrices] = useState({
    north: 30,
    south: 30,
    east: 40,
    west: 40
  })
  const [stadiumTicketsRemaining, setStadiumTicketsRemaining] = useState({
    north: 100,
    south: 100,
    east: 50,
    west: 75
  })
  const [cinemaPrices, setCinemaPrices] = useState(
    Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`row${i + 1}`, 10 + i]))
  )

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/check-admin')
        const data = await response.json()
        setIsAdmin(data.admin)
      } catch (error) {
        console.error('Error checking admin status:', error)
      }
    }

    checkAdminStatus()
  }, [])

  const handleEditClick = () => {
    setIsEditMode(true)
  }

  const handleSaveClick = async () => {
    try {
      const response = await fetch('/api/update-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stadiumPrices,
          cinemaPrices,
          stadiumTicketsRemaining,
        }),
      })

      if (response.ok) {
        toast.success('Prices and availability updated successfully')
        setIsEditMode(false)
      } else {
        toast.error('Failed to update prices and availability')
      }
    } catch (error) {
      console.error('Error updating prices and availability:', error)
      toast.error('An error occurred while updating prices and availability')
    }
  }

  const handleStadiumPriceChange = (zone, price) => {
    setStadiumPrices(prev => ({ ...prev, [zone]: price }))
  }

  const handleStadiumTicketsRemainingChange = (zone, tickets) => {
    setStadiumTicketsRemaining(prev => ({ ...prev, [zone]: tickets }))
  }

  const handleCinemaPriceChange = (row, price) => {
    setCinemaPrices(prev => ({ ...prev, [row]: price }))
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ticket Sales</h1>
        {isAdmin && (
          <div className="space-x-2">
            {isEditMode ? (
              <Button variant="outline" onClick={handleSaveClick}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            ) : (
              <Button variant="outline" onClick={handleEditClick}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            <Button variant="outline">
              <BarChart className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </div>
        )}
      </div>

      {/* <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="stadium">Stadium</TabsTrigger>
          <TabsTrigger value="cinema">Cinema</TabsTrigger>
        </TabsList>
      </Tabs> */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-7 items-start">
        <div className="lg:sticky lg:top-10 lg:col-span-3">
          {activeTab === 'stadium' ? (
            <StadiumCanvas 
              onZoneSelect={setSelectedZone} 
              prices={stadiumPrices}
              ticketsRemaining={stadiumTicketsRemaining}
            />
          ) : (
            <CinemaCanvas 
              onSeatSelect={setSelectedSeats} 
              selectedSeats={selectedSeats}
              prices={cinemaPrices}
            />
          )}
        </div>
        <div className='lg:col-span-2'>
          {isEditMode ? (
            activeTab === 'stadium' ? (
              <StadiumEditForm 
                prices={stadiumPrices}
                ticketsRemaining={stadiumTicketsRemaining}
                onPriceChange={handleStadiumPriceChange}
                onTicketsRemainingChange={handleStadiumTicketsRemainingChange}
              />
            ) : (
              <CinemaEditForm 
                prices={cinemaPrices}
                onPriceChange={handleCinemaPriceChange}
              />
            )
          ) : (
            activeTab === 'stadium' ? (
              <TicketFormStadium selectedZone={selectedZone} />
            ) : (
              <TicketFormCinema selectedSeats={selectedSeats} />
            )
          )}
        </div>
      </div>
    </div>
  )
}

