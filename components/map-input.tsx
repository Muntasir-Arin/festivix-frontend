'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Skeleton } from "@/components/ui/skeleton"

const MapComponent = dynamic(() => import('./map-component'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-md">
      <Skeleton className="w-full h-full" />
    </div>
  )
})

interface MapInputProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapInput({ onLocationSelect }: MapInputProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] rounded-md">
        <Skeleton className="w-full h-full" />
      </div>
    )
  }

  return <MapComponent onLocationSelect={onLocationSelect} />
}

