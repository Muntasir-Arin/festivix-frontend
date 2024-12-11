"use client"

import { useState } from 'react'
import { MapPin, Calendar, DollarSign, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

const dateOptions = [
  "All Dates",
  "Today",
  "This weekend",
  "This Month",
  "Custom Dates",
]

const priceOptions = [
  { label: "All", value: "all" },
  { label: "$", value: "1" },
  { label: "$$", value: "2" },
  { label: "$$$", value: "3" },
  { label: "$$$$", value: "4" },
]

interface FiltersProps {
  onDateChange: (date: string) => void
  onPriceChange: (price: string) => void
  onSearch: (query: string) => void
}

export function Filters({ onDateChange, onPriceChange, onSearch }: FiltersProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchClick = () => {
    setShowSearch(!showSearch)
    if (showSearch) {
      onSearch(searchQuery)
    }
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-green-50">
              <MapPin className="mr-2 h-4 w-4" />
              Barcelona
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Barcelona</DropdownMenuItem>
            <DropdownMenuItem>Madrid</DropdownMenuItem>
            <DropdownMenuItem>Valencia</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              All Dates
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {dateOptions.map((option) => (
              <DropdownMenuItem key={option} onSelect={() => onDateChange(option)}>
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Price
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {priceOptions.map((option) => (
              <DropdownMenuItem key={option.value} onSelect={() => onPriceChange(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" onClick={handleSearchClick}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Country, State, City"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSearch(searchQuery)
              }
            }}
          />
        </div>
      )}
    </div>
  )
}

