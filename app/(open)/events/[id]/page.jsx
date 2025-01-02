'use client'

import React, { useState, useEffect } from 'react'
import StadiumCanvas from '@/components/stadium-canvas'
import StadiumEditForm from '@/components/stadium-edit-form'
import TicketFormStadium from '@/components/ticket-form-stadium'
import { Button } from "@/components/ui/button"
import { Edit, BarChart, Save } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'

export default function TicketSellingPage({ params }) { 
  const unwrappedParams = React.use(params)
  
  const [selectedZone, setSelectedZone] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [response, setResponse] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [stadiumPrices, setStadiumPrices] = useState(null)
  const [stadiumTicketsRemaining, setStadiumTicketsRemaining] = useState(null)
  useEffect(() => {
    const fetchStadiumData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event/get-stadium-data/${unwrappedParams.id}`);
        if (!response.ok) throw new Error('Failed to fetch stadium data');
        
        const data = await response.json();
        setResponse(data);
  
        const { stadium, event } = data;
  
        if (stadium && stadium.prices && stadium.ticketsRemaining) {
          setStadiumPrices({
            north: stadium.prices.north || 0,
            south: stadium.prices.south || 0,
            east: stadium.prices.east || 0,
            west: stadium.prices.west || 0,
          });
          setStadiumTicketsRemaining({
            north: stadium.ticketsRemaining.north || 0,
            south: stadium.ticketsRemaining.south || 0,
            east: stadium.ticketsRemaining.east || 0,
            west: stadium.ticketsRemaining.west || 0,
          });
        } else {
          throw new Error('Incomplete data received from the API');
        }
  
        // Pass event data to checkAdminStatus
        await checkAdminStatus(event);
      } catch (error) {
        console.error('Error fetching stadium data:', error);
      }
    };
  
    const checkAdminStatus = async (event) => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          console.log(response.data);
          if (response.data._id === event.manager) {
            console.log('User is admin');
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
  
    fetchStadiumData();
  }, [unwrappedParams.id]);
  

  const handleEditClick = () => {
    setIsEditMode(true)
  }

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event/update-prices/${unwrappedParams.id}`, {
        method: 'PUT', // Use PUT for updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          northPrice: stadiumPrices.north,
          southPrice: stadiumPrices.south,
          eastPrice: stadiumPrices.east,
          westPrice: stadiumPrices.west,
          northRemaining: stadiumTicketsRemaining.north,
          southRemaining: stadiumTicketsRemaining.south,
          eastRemaining: stadiumTicketsRemaining.east,
          westRemaining: stadiumTicketsRemaining.west,
        }),
      });
  
      if (response.ok) {
        toast.success('Prices and availability updated successfully');
        setIsEditMode(false);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to update prices and availability: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating prices and availability:', error);
      toast.error('An error occurred while updating prices and availability');
    }
  };
  

  const handleStadiumPriceChange = (zone, price) => {
    setStadiumPrices(prev => ({ ...prev, [zone]: price }))
  }

  const handleStadiumTicketsRemainingChange = (zone, tickets) => {
    setStadiumTicketsRemaining(prev => ({ ...prev, [zone]: tickets }))
  }

  if (stadiumPrices === null || stadiumTicketsRemaining === null) {
    return <div>Loading...</div>
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-7 items-start">
        <div className="lg:sticky lg:top-10 lg:col-span-3">
          <StadiumCanvas 
            onZoneSelect={setSelectedZone} 
            prices={stadiumPrices}
            ticketsRemaining={stadiumTicketsRemaining}
          />
        </div>
        <div className='lg:col-span-2'>
          {isEditMode ? (
            <StadiumEditForm 
              prices={stadiumPrices}
              ticketsRemaining={stadiumTicketsRemaining}
              onPriceChange={handleStadiumPriceChange}
              onTicketsRemainingChange={handleStadiumTicketsRemainingChange}
            />
          ) : (
            <TicketFormStadium selectedZone={selectedZone} />
          )}
        </div>
      </div>
    </div>
  )
}
