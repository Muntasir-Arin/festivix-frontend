import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChannelList({ channels, activeChannel, onSelectChannel }) {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Channels</h2>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        {channels.map(channel => (
          <Button
            key={channel.id}
            variant={channel.id === activeChannel.id ? "secondary" : "ghost"}
            className="w-full justify-start mb-2"
            onClick={() => onSelectChannel(channel)}
          >
            # {channel.name}
          </Button>
        ))}
      </ScrollArea>
    </div>
  )
}

