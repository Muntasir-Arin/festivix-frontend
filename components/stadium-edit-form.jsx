'use client'

import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const StadiumEditForm = ({ prices, ticketsRemaining, onPriceChange, onTicketsRemainingChange }) => {
  const zones = ['north', 'south', 'east', 'west']

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Edit Stadium Prices and Availability</h2>
      {zones.map((zone) => (
        <div key={zone} className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`price-${zone}`}>Price for {zone} stand</Label>
            <Input
              id={`price-${zone}`}
              type="number"
              value={prices[zone] || ''}
              onChange={(e) => onPriceChange(zone, Number(e.target.value))}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Label htmlFor={`tickets-${zone}`}>Available tickets for {zone} stand</Label>
            <Input
              id={`tickets-${zone}`}
              type="number"
              value={ticketsRemaining[zone] || ''}
              onChange={(e) => onTicketsRemainingChange(zone, Number(e.target.value))}
              min="0"
              step="1"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default StadiumEditForm

