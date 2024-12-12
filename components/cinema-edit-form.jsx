'use client'

import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const CinemaEditForm = ({ prices, onPriceChange }) => {
  const rows = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Edit Cinema Prices</h2>
      {rows.map((row) => (
        <div key={row} className="grid grid-cols-2 gap-4">
          <Label htmlFor={`price-row${row}`}>Price for Row {row}</Label>
          <Input
            id={`price-row${row}`}
            type="number"
            value={prices[`row${row}`] || ''}
            onChange={(e) => onPriceChange(`row${row}`, Number(e.target.value))}
            min="0"
            step="0.01"
          />
        </div>
      ))}
    </div>
  )
}

export default CinemaEditForm

