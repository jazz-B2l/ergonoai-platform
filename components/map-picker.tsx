'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

export default function MapPicker({ lat, lng, onChange }: { lat: number; lng: number; onChange: (lat: number, lng: number) => void }) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return

    const L = require('leaflet')

    // Fix for default marker icons in Leaflet with Webpack/Turbopack
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    })

    const initialLat = lat || 36.752887
    const initialLng = lng || 3.042048

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 12)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map)

      marker.on('dragend', () => {
        const position = marker.getLatLng()
        onChange(position.lat, position.lng)
      })

      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng)
        onChange(e.latlng.lat, e.latlng.lng)
      })

      mapRef.current = map
      markerRef.current = marker
    } else {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng])
      }
      if (mapRef.current) {
        mapRef.current.setView([lat, lng])
      }
    }
  }, [lat, lng, onChange])

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 h-64 bg-slate-50">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  )
}
