'use client'
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react'; 
import { Icon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
// import L from 'leaflet';


// Fix for default marker icon
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: '/leaflet/marker-icon-2x.png',
//   iconUrl: '/leaflet/marker-icon.png',
//   shadowUrl: '/leaflet/marker-shadow.png',
// });

interface MapInputProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

function MapEvents({ onLocationSelect }: MapInputProps) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapInput({ onLocationSelect }: MapInputProps) {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);
  const [marker, setMarker] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
    );
  }, []);

  const handleLocationSelect = (lat: number, lng: number) => {
    setMarker([lat, lng]);
    onLocationSelect(lat, lng);
  };

  const customLucideIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(renderToStaticMarkup(<MapPin size={30} color="black" />)), 
    iconSize: [30, 30], 
    iconAnchor: [15, 30], 
    popupAnchor: [0, -30],
  });

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {marker && <Marker position={marker} icon={customLucideIcon} />}
      <MapEvents onLocationSelect={handleLocationSelect} />
    </MapContainer>
  );
}

