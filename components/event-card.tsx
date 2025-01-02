import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface EventCardProps {
  title: string
  date: string
  time: string
  venue: string
  imageUrl: string
  startingPrice: number
  category: string
}

export function EventCard({
  title,
  date,
  time,
  venue,
  imageUrl,
  startingPrice,
  category,
}: EventCardProps) {
  return (
    <Card className="overflow-hidden group cursor-pointer">
      <div className="relative aspect-[4/3]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 right-2  rounded-md px-2 py-1 text-sm font-medium">
          From ${startingPrice}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{`${date} • ${time}`}</p>
          <p>{venue}</p>
        </div>
      </CardContent>
    </Card>
  )
}

