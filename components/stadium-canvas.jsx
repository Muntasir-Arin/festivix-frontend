'use client'

import React, { useRef, useEffect, useState } from 'react'

const zones = [
  {
    id: 'north',
    name: 'North Stand',
    price: 30,
    ticketsRemaining: 100,
    color: '#90EE90',
    hoverColor: '#98FB98',
    bookedColor: '#D3D3D3',
    path: (ctx, scale) => {
      ctx.rect(100 * scale, 50 * scale, 600 * scale, 100 * scale)
    }
  },
  {
    id: 'south',
    name: 'South Stand',
    price: 30,
    ticketsRemaining: 100,
    color: '#90EE90',
    hoverColor: '#98FB98',
    bookedColor: '#D3D3D3',
    path: (ctx, scale) => {
      ctx.rect(100 * scale, 550 * scale, 600 * scale, 100 * scale)
    }
  },
  {
    id: 'east',
    name: 'East Stand',
    price: 40,
    ticketsRemaining: 50,
    color: '#87CEFA',
    hoverColor: '#B0E2FF',
    bookedColor: '#D3D3D3',
    path: (ctx, scale) => {
      ctx.rect(700 * scale, 150 * scale, 100 * scale, 400 * scale)
    }
  },
  {
    id: 'west',
    name: 'West Stand',
    price: 40,
    ticketsRemaining: 75,
    color: '#87CEFA',
    hoverColor: '#B0E2FF',
    bookedColor: '#D3D3D3',
    path: (ctx, scale) => {
      ctx.rect(0, 150 * scale, 100 * scale, 400 * scale)
    }
  }
]

const StadiumCanvas = ({ onZoneSelect, prices, ticketsRemaining }) => {
  console.log(prices, ticketsRemaining)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [selectedZone, setSelectedZone] = useState(null)
  const [hoveredZone, setHoveredZone] = useState(null)
  const [scale, setScale] = useState(1)

  const drawZone = (ctx, zone, isSelected, isHovered) => {
    ctx.beginPath()
    zone.path(ctx, scale)
    ctx.fillStyle = ticketsRemaining[zone.id] === 0 
      ? zone.bookedColor 
      : isHovered ? zone.hoverColor : zone.color
    ctx.fill()
    
    if (isSelected && ticketsRemaining[zone.id] > 0) {
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 3 * scale
      ctx.stroke()
    }

    ctx.fillStyle = '#000000'
    ctx.font = `bold ${16 * scale}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    let textX, textY
    switch (zone.id) {
      case 'north':
        textX = 400 * scale
        textY = 100 * scale
        break
      case 'south':
        textX = 400 * scale
        textY = 600 * scale
        break
      case 'east':
        textX = 750 * scale
        textY = 350 * scale
        ctx.save()
        ctx.translate(textX, textY)
        ctx.rotate(Math.PI / 2)
        ctx.translate(-textX, -textY)
        break
      case 'west':
        textX = 50 * scale
        textY = 350 * scale
        ctx.save()
        ctx.translate(textX, textY)
        ctx.rotate(-Math.PI / 2)
        ctx.translate(-textX, -textY)
        break
    }

    const price = prices[zone.id] || zone.price
    ctx.fillText(`${zone.name} - $${price}`, textX, textY)
    ctx.font = `${14 * scale}px Arial`
    ctx.fillText(`Tickets left: ${ticketsRemaining[zone.id]}`, textX, textY + 20 * scale)
    
    if (zone.id === 'east' || zone.id === 'west') {
      ctx.restore()
    }
  }

  const drawField = (ctx) => {
    // Draw field
    ctx.fillStyle = '#2E7D32'
    ctx.fillRect(100 * scale, 150 * scale, 600 * scale, 400 * scale)

    // Draw field lines
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2 * scale
    
    // Outline
    ctx.strokeRect(110 * scale, 160 * scale, 580 * scale, 380 * scale)

    // Center line
    ctx.beginPath()
    ctx.moveTo(400 * scale, 160 * scale)
    ctx.lineTo(400 * scale, 540 * scale)
    ctx.stroke()

    // Center circle
    ctx.beginPath()
    ctx.arc(400 * scale, 350 * scale, 50 * scale, 0, 2 * Math.PI)
    ctx.stroke()

    // Penalty areas
    ctx.strokeRect(110 * scale, 260 * scale, 100 * scale, 180 * scale)
    ctx.strokeRect(590 * scale, 260 * scale, 100 * scale, 180 * scale)

    // Goals
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(100 * scale, 320 * scale, 10 * scale, 60 * scale)
    ctx.fillRect(690 * scale, 320 * scale, 10 * scale, 60 * scale)
  }

  const resizeCanvas = () => {
    if (canvasRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const newScale = containerWidth / 800
      setScale(newScale)

      canvasRef.current.width = 800 * newScale
      canvasRef.current.height = 700 * newScale

      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.scale(newScale, newScale)
        render(ctx)
      }
    }
  }

  const render = (ctx) => {
    ctx.clearRect(0, 0, 800, 700)

    // Draw all zones
    zones.forEach(zone => {
      drawZone(
        ctx,
        zone,
        zone.id === selectedZone,
        zone.id === hoveredZone
      )
    })

    // Draw the field
    drawField(ctx)
  }

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [selectedZone, hoveredZone, prices, ticketsRemaining])

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / scale
    const y = (event.clientY - rect.top) / scale

    zones.forEach(zone => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.beginPath()
      zone.path(ctx, 1)

      if (ctx.isPointInPath(x, y) && ticketsRemaining[zone.id] > 0) {
        setSelectedZone(zone.id)
        onZoneSelect(zone)
      }
    })
  }

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / scale
    const y = (event.clientY - rect.top) / scale

    let found = false
    zones.forEach(zone => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.beginPath()
      zone.path(ctx, 1)

      if (ctx.isPointInPath(x, y)) {
        setHoveredZone(zone.id)
        found = true
      }
    })

    if (!found) {
      setHoveredZone(null)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className="w-full h-auto border rounded-md cursor-pointer"
      />
      <div className="absolute top-4 right-4 bg-background border p-4 rounded-md shadow-md text-sm">
        <h3 className="font-semibold mb-2">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#90EE90]" />
            <span>North/South</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#87CEFA]" />
            <span>East/West</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#D3D3D3]" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#FFD700]" />
            <span>Selected</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StadiumCanvas

