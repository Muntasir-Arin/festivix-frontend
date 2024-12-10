'use client'

import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number) => void
}

function MapEvents({ onLocationSelect }: MapComponentProps) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function MapContent({ position, marker, onLocationSelect }: { 
  position: [number, number], 
  marker: [number, number] | null,
  onLocationSelect: (lat: number, lng: number) => void
}) {
  const map = useMap()

  useEffect(() => {
    map.setView(position, map.getZoom())
    map.invalidateSize()
  }, [map, position])

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {marker && <Marker position={marker} />}
      <MapEvents onLocationSelect={onLocationSelect} />
    </>
  )
}

export default function MapComponent({ onLocationSelect }: MapComponentProps) {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09])
  const [marker, setMarker] = useState<[number, number] | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude])
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`)
        }
      )
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off()
        mapRef.current.remove()
      }
    }
  }, [])

  const handleLocationSelect = (lat: number, lng: number) => {
    setMarker([lat, lng])
    onLocationSelect(lat, lng)
  }

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      scrollWheelZoom={false} 
      style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}
      ref={mapRef}
      key={position.join(',')}
    >
      <MapContent position={position} marker={marker} onLocationSelect={handleLocationSelect} />
    </MapContainer>
  )
}

