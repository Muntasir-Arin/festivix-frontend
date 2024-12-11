'use client'

import React, { useState } from 'react'
import StadiumCanvas from '@/components/stadium-canvas'
import TicketFormStadium from '@/components/ticket-form-stadium'
import CinemaCanvas from '@/components/cinema-canvas'
import TicketFormCinema from '@/components/ticket-form-cinema'
interface Zone {
  id: string
  name: string
  price: number
  ticketsRemaining: number
  color: string
  hoverColor: string
  bookedColor: string
  path: (ctx: CanvasRenderingContext2D) => void
}
interface Seat {
    id: string
    row: string
    number: number
    price: number
    isAvailable: boolean
  }
export default function TicketSellingPage() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])


  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Stadium Ticket Sales</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-7 items-start">
        <div className="lg:sticky lg:top-10 lg:col-span-3">
          {/* <StadiumCanvas onZoneSelect={setSelectedZone} /> */}
          <CinemaCanvas onSeatSelect={setSelectedSeats} />

        </div>
        <div className='lg:col-span-2'>
          {/* <TicketFormStadium selectedZone={selectedZone} /> */}
          <TicketFormCinema selectedSeats={selectedSeats}/>
        </div>
      </div>
    </div>
  )
}

