"use client"

import { useState } from 'react'
import { NavBar } from "@/components/nav-bar"
import { Filters } from "@/components/filters"
import { EventCard } from "@/components/event-card"

const events = [

  {
    title: "FC Barcelona vs Leganés",
    date: "Sun, 15 Dec",
    time: "21:00",
    venue: "Estadio Olimpic De Montjuic Luis Companys",
    imageUrl: "/example-event.jpg",
    startingPrice: 45,
    category: "Sports"
  },
  {
    title: "FC Barcelona vs Club Atlético de Madrid",
    date: "Sat, 21 Dec",
    time: "21:00",
    venue: "Estadio Olimpic De Montjuic Luis Companys",
    imageUrl: "/example-event.jpg",
    startingPrice: 60,
    category: "Sports"
  },
  {
    title: "FC Barcelona vs Valencia CF",
    date: "Sun, 26 Jan",
    time: "15:00",
    venue: "Estadio Olimpic De Montjuic Luis Companys",
    imageUrl: "/example-event.jpg",
    startingPrice: 45,
    category: "Sports"
  },

  {
    title: "FC Barcelona vs RC Celta de Vigo",
    date: "Sun, 20 Apr",
    time: "15:00",
    venue: "Estadio Olimpic De Montjuic Luis Companys",
    imageUrl: "/example-event.jpg",
    startingPrice: 40,
    category: "Sports"
  },
]

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All Events")
  const [dateFilter, setDateFilter] = useState("All Dates")
  const [priceFilter, setPriceFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEvents = events.filter((event) => {
    // Category filter
    if (activeCategory !== "All Events" && event.category !== activeCategory) {
      return false
    }

    // Date filter (simplified for demonstration)
    if (dateFilter !== "All Dates") {
      // Implement more sophisticated date filtering logic here
      return false
    }

    // Price filter
    if (priceFilter !== "all") {
      const priceRanges = {
        "1": { min: 0, max: 40 },
        "2": { min: 41, max: 60 },
        "3": { min: 61, max: 70 },
        "4": { min: 71, max: Infinity }
      }
      const range = priceRanges[priceFilter as keyof typeof priceRanges]
      if (event.startingPrice < range.min || event.startingPrice > range.max) {
        return false
      }
    }

    // Search filter
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  return (
    <div className="container py-6">
      <NavBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <h1 className="text-2xl font-bold mb-6">Explore events near Barcelona</h1>
      <Filters
        onDateChange={setDateFilter}
        onPriceChange={setPriceFilter}
        onSearch={setSearchQuery}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEvents.map((event) => (
          <EventCard key={`${event.title}-${event.date}`} {...event} />
        ))}
      </div>
    </div>
  )
}

