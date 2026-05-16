'use client'

import { Conversation } from '@/lib/mock-data'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatHistoryProps {
  conversations: Conversation[]
  currentConversationId: string
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onNewConversation: () => void
}

export default function ChatHistory({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
}: ChatHistoryProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">Lịch sử</h2>
      </div>

      <Button
        onClick={onNewConversation}
        className="w-full mb-4 gap-2"
        variant="outline"
      >
        <Plus size={18} />
        <span>Cuộc hội thoại mới</span>
      </Button>

      <div className="flex-1 overflow-y-auto space-y-2">
        {conversations.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">Không có cuộc hội thoại</p>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.id}
              className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                currentConversationId === conv.id
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-muted border border-transparent'
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{conv.title}</p>
                  <p className="text-xs text-muted-foreground">{conv.createdDate}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteConversation(conv.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
