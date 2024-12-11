import { Ticket, ClubIcon as Football, Music, Theater, PartyPopper } from 'lucide-react'
import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: "All Events",
    href: "/",
    icon: <Ticket className="w-4 h-4" />,
  },
  {
    label: "Sports",
    href: "/sports",
    icon: <Football className="w-4 h-4" />,
  },
  {
    label: "Concerts",
    href: "/concerts",
    icon: <Music className="w-4 h-4" />,
  },
  {
    label: "Theater",
    href: "/theater",
    icon: <Theater className="w-4 h-4" />,
  },
  {
    label: "Festivals",
    href: "/festivals",
    icon: <PartyPopper className="w-4 h-4" />,
  },
]

interface NavBarProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function NavBar({ activeCategory, onCategoryChange }: NavBarProps) {
  return (
    <nav className="flex space-x-6 border-b mb-6">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={(e) => {
            e.preventDefault()
            onCategoryChange(item.label)
          }}
          className={cn(
            "flex items-center gap-2 px-2 py-4 text-sm hover:text-primary transition-colors",
            activeCategory === item.label
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

