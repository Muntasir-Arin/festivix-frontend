'use client'

import React, { useRef, useEffect, useState } from 'react'

interface Seat {
  id: string
  row: string
  number: number
  price: number
  isAvailable: boolean
}

// Generate seats data
const generateSeats = (): Seat[] => {
  const seats: Seat[] = []
  
  // Stalls seats (A-H)
  const stallsRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  stallsRows.forEach((row) => {
    const seatsInRow = row === 'A' || row === 'H' ? 8 : 12
    for (let i = 1; i <= seatsInRow; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        price: 30,
        isAvailable: Math.random() > 0.5 // Randomly set availability
      })
    }
  })

  // Balcony seats (J-N)
  const balconyRows = ['J', 'K', 'L', 'M', 'N']
  balconyRows.forEach((row) => {
    const seatsInRow = 12
    for (let i = 1; i <= seatsInRow; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        price: 40,
        isAvailable: Math.random() > 0.5 // Randomly set availability
      })
    }
  })

  return seats
}

interface CinemaCanvasProps {
  onSeatSelect: (seats: Seat[]) => void
}

const CinemaCanvas: React.FC<CinemaCanvasProps> = ({ onSeatSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [seats] = useState<Seat[]>(generateSeats())
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const SEAT_SIZE = 30
  const SEAT_SPACING = 10
  const SCREEN_HEIGHT = 40
  const ROW_LABEL_WIDTH = 30

  const drawScreen = (ctx: CanvasRenderingContext2D) => {
    const screenWidth = 600 * scale
    const screenHeight = SCREEN_HEIGHT * scale
    const x = (ctx.canvas.width - screenWidth) / 2
    const y = 20 * scale

    // Screen border
    ctx.fillStyle = '#333'
    ctx.fillRect(x, y, screenWidth, screenHeight)

    // Screen text
    ctx.fillStyle = '#fff'
    ctx.font = `${16 * scale}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('SCREEN', ctx.canvas.width / 2, y + screenHeight / 2)
  }

  const drawSeat = (
    ctx: CanvasRenderingContext2D,
    seat: Seat,
    x: number,
    y: number
  ) => {
    const size = SEAT_SIZE * scale

    ctx.beginPath()
    ctx.roundRect(x, y, size, size, 5 * scale)

    // Set fill style based on seat state
    if (!seat.isAvailable) {
      ctx.fillStyle = '#e0e0e0' // Unavailable
    } else if (selectedSeats.includes(seat.id)) {
      ctx.fillStyle = '#FFD700' // Selected
    } else if (seat.id === hoveredSeat) {
      ctx.fillStyle = '#90EE90' // Hovered
    } else {
      ctx.fillStyle = '#fff' // Available
    }

    ctx.fill()
    ctx.strokeStyle = '#2E7D32'
    ctx.lineWidth = 2 * scale
    ctx.stroke()

    // Seat number
    ctx.fillStyle = '#000'
    ctx.font = `${12 * scale}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      seat.number.toString(),
      x + size / 2,
      y + size / 2
    )
  }

  const drawRowLabel = (
    ctx: CanvasRenderingContext2D,
    row: string,
    y: number
  ) => {
    ctx.fillStyle = '#000'
    ctx.font = `${14 * scale}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      row,
      ROW_LABEL_WIDTH * scale / 2,
      y + (SEAT_SIZE * scale) / 2
    )
    ctx.fillText(
      row,
      ctx.canvas.width - (ROW_LABEL_WIDTH * scale / 2),
      y + (SEAT_SIZE * scale) / 2
    )
  }

  const drawSeats = (ctx: CanvasRenderingContext2D) => {
    const startY = SCREEN_HEIGHT * scale + 60 * scale
    let currentY = startY

    // Draw stalls seats
    for (const row of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
      const rowSeats = seats.filter(seat => seat.row === row)
      const rowWidth = rowSeats.length * (SEAT_SIZE + SEAT_SPACING) * scale
      let startX = (ctx.canvas.width - rowWidth) / 2

      drawRowLabel(ctx, row, currentY)

      rowSeats.forEach(seat => {
        drawSeat(ctx, seat, startX, currentY)
        startX += (SEAT_SIZE + SEAT_SPACING) * scale
      })

      currentY += (SEAT_SIZE + SEAT_SPACING) * scale
    }

    // Add gap between stalls and balcony
    currentY += 40 * scale

    // Draw "BALCONY" text
    ctx.fillStyle = '#000'
    ctx.font = `bold ${18 * scale}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('BALCONY', ctx.canvas.width / 2, currentY - 20 * scale)

    // Draw balcony seats
    for (const row of ['J', 'K', 'L', 'M', 'N']) {
      const rowSeats = seats.filter(seat => seat.row === row)
      const rowWidth = rowSeats.length * (SEAT_SIZE + SEAT_SPACING) * scale
      let startX = (ctx.canvas.width - rowWidth) / 2

      drawRowLabel(ctx, row, currentY)

      rowSeats.forEach(seat => {
        drawSeat(ctx, seat, startX, currentY)
        startX += (SEAT_SIZE + SEAT_SPACING) * scale
      })

      currentY += (SEAT_SIZE + SEAT_SPACING) * scale
    }
  }

  const getSeatFromCoordinates = (x: number, y: number): Seat | null => {
    const startY = SCREEN_HEIGHT * scale + 60 * scale
    let currentY = startY

    // Check stalls seats
    for (const row of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
      const rowSeats = seats.filter(seat => seat.row === row)
      const rowWidth = rowSeats.length * (SEAT_SIZE + SEAT_SPACING) * scale
      let startX = (canvasRef.current!.width - rowWidth) / 2

      for (const seat of rowSeats) {
        if (
          x >= startX &&
          x <= startX + SEAT_SIZE * scale &&
          y >= currentY &&
          y <= currentY + SEAT_SIZE * scale
        ) {
          return seat
        }
        startX += (SEAT_SIZE + SEAT_SPACING) * scale
      }
      currentY += (SEAT_SIZE + SEAT_SPACING) * scale
    }

    // Skip gap between stalls and balcony
    currentY += 40 * scale

    // Check balcony seats
    for (const row of ['J', 'K', 'L', 'M', 'N']) {
      const rowSeats = seats.filter(seat => seat.row === row)
      const rowWidth = rowSeats.length * (SEAT_SIZE + SEAT_SPACING) * scale
      let startX = (canvasRef.current!.width - rowWidth) / 2

      for (const seat of rowSeats) {
        if (
          x >= startX &&
          x <= startX + SEAT_SIZE * scale &&
          y >= currentY &&
          y <= currentY + SEAT_SIZE * scale
        ) {
          return seat
        }
        startX += (SEAT_SIZE + SEAT_SPACING) * scale
      }
      currentY += (SEAT_SIZE + SEAT_SPACING) * scale
    }

    return null
  }

  const resizeCanvas = () => {
    if (canvasRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const newScale = Math.min(containerWidth / 800, 1)
      setScale(newScale)

      canvasRef.current.width = 800 * newScale
      canvasRef.current.height = 900 * newScale

      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        render(ctx)
      }
    }
  }

  const render = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    drawScreen(ctx)
    drawSeats(ctx)
  }

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [seats, hoveredSeat, selectedSeats])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const clickedSeat = getSeatFromCoordinates(x, y)
    
    if (clickedSeat && clickedSeat.isAvailable) {
      let newSelectedSeats: string[]
      if (selectedSeats.includes(clickedSeat.id)) {
        newSelectedSeats = selectedSeats.filter(id => id !== clickedSeat.id)
      } else if (selectedSeats.length < 5) {
        newSelectedSeats = [...selectedSeats, clickedSeat.id]
      } else {
        return // Don't allow more than 5 selections
      }
      setSelectedSeats(newSelectedSeats)
      onSeatSelect(seats.filter(seat => newSelectedSeats.includes(seat.id)))
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const hoveredSeat = getSeatFromCoordinates(x, y)
    setHoveredSeat(hoveredSeat?.id || null)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className="w-full h-auto border border-gray-300 rounded-md cursor-pointer"
      />
      <div className="absolute top-4 right-4 bg-white p-4 rounded-md shadow-md text-sm">
        <h3 className="font-semibold mb-2">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#2E7D32] bg-white" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#e0e0e0] border-2 border-[#2E7D32]" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#FFD700] border-2 border-[#2E7D32]" />
            <span>Selected</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CinemaCanvas

