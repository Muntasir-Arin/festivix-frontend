"use client";

import { useState, useEffect } from "react";
import { NavBar } from "@/components/nav-bar";
import { Filters } from "@/components/filters";
import { EventCard } from "@/components/event-card";
import Link from "next/link";


export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const [priceFilter, setPriceFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  interface Event {
    _id: string;
    name: string;
    date: string;
    time: string;
    location: string;
    imageUrl?: string;
    startingPrice: number;
    dynamicPricingEnabled: boolean;
    dynamicPriceAdjustment: number;
    category: string;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event/get-all`);
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        setEvents(data.events || []); // Ensure the response contains events
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    // Category filter
    if (activeCategory !== "All Events" && event.category !== activeCategory) {
      return false;
    }

    // Date filter (simplified for demonstration)
    if (dateFilter !== "All Dates") {
      // Implement more sophisticated date filtering logic here
      return false;
    }

    // Price filter
    if (priceFilter !== "all") {
      const priceRanges = {
        "1": { min: 0, max: 40 },
        "2": { min: 41, max: 60 },
        "3": { min: 61, max: 70 },
        "4": { min: 71, max: Infinity },
      };
      const range = priceRanges[priceFilter as keyof typeof priceRanges];
      if (event.startingPrice < range.min || event.startingPrice > range.max) {
        return false;
      }
    }

    // Search filter
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container py-6">
      <NavBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <h1 className="text-2xl font-bold mb-6">Explore events near you</h1>
      <Filters onDateChange={setDateFilter} onPriceChange={setPriceFilter} onSearch={setSearchQuery} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEvents.map((event) => (
          <Link href={`/events/${event._id}`} key={event._id}> 
          <EventCard
            key={`${event._id}`} // Assuming each event has a unique `_id` field
            title={event.name}
            date={new Date(event.date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}
            time={event.time}
            venue={event.location}
            imageUrl={event.imageUrl || "/default-event.jpg"} // Use a default image if none provided
            startingPrice={event.dynamicPricingEnabled ? event.dynamicPriceAdjustment : 50} // Example pricing logic
            category={event.category}
          />
      </Link>
        ))}
      </div>
    </div>
  );
}
