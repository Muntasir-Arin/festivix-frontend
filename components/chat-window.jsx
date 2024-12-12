import React, { useEffect, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ChatWindow({ channel }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [channel.messages])

  return (
    <div className="flex-1 bg-white p-4">
      <h2 className="text-2xl font-bold mb-4">#{channel.name}</h2>
      <ScrollArea className="h-[calc(100vh-12rem)]" ref={scrollRef}>
        {channel.messages.map(message => (
          <div key={message.id} className="flex items-start mb-4">
            <Avatar className="mr-2">
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.sender}`} />
              <AvatarFallback>{message.sender[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{message.sender}</p>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

