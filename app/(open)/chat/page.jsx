'use client'

import React, { useState } from 'react'
import { ChannelList } from '@/components/channel-list'
import { ChatWindow } from '@/components/chat-window'
import { MessageInput } from '@/components/message-input'

const initialChannels = [
  { id: 1, name: 'General', messages: [] },
  { id: 2, name: 'Random', messages: [] },
  { id: 3, name: 'Tech Talk', messages: [] },
]

export default function ChatPage() {
  const [channels, setChannels] = useState(initialChannels)
  const [activeChannel, setActiveChannel] = useState(channels[0])

  const handleSendMessage = (message) => {
    const updatedChannels = channels.map(channel => 
      channel.id === activeChannel.id 
        ? { ...channel, messages: [...channel.messages, { id: Date.now(), text: message, sender: 'You' }] }
        : channel
    )
    setChannels(updatedChannels)
    setActiveChannel(updatedChannels.find(channel => channel.id === activeChannel.id))
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ChannelList 
        channels={channels} 
        activeChannel={activeChannel} 
        onSelectChannel={setActiveChannel} 
      />
      <div className="flex flex-col flex-1">
        <ChatWindow channel={activeChannel} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}

