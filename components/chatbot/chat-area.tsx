'use client'

import { Conversation } from '@/lib/mock-data'
import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatAreaProps {
  conversation: Conversation
}

export default function ChatArea({ conversation }: ChatAreaProps) {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setInputValue('')
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col h-full overflow-hidden">
      {/* Conversation Title */}
      <div className="mb-4 pb-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">{conversation.title}</h2>
        <p className="text-xs text-muted-foreground">Model: {conversation.model}</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {conversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-sm text-muted-foreground">Bắt đầu một cuộc hội thoại mới</p>
              <p className="text-xs text-muted-foreground mt-1">Gửi một tin nhắn để bắt đầu</p>
            </div>
          </div>
        ) : (
          conversation.messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted text-foreground rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                {msg.tokens && (
                  <p className="text-xs opacity-70 mt-1">{msg.tokens} tokens</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn của bạn..."
          rows={3}
          disabled={isLoading}
          className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground resize-none disabled:opacity-50"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          size="sm"
          className="h-auto"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  )
}
