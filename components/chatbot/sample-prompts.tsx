'use client'

import { SamplePrompt } from '@/lib/mock-data'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SamplePromptsProps {
  prompts: SamplePrompt[]
}

export default function SamplePrompts({ prompts }: SamplePromptsProps) {
  const [expanded, setExpanded] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (title: string) => {
    navigator.clipboard.writeText(title)
    setCopiedId(title)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full mb-3"
      >
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Mẫu Prompt</h3>
        </div>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {expanded && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {prompts.map(prompt => (
            <div
              key={prompt.id}
              className="flex items-start justify-between gap-2 p-2 rounded-md hover:bg-muted transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{prompt.title}</p>
                <p className="text-xs text-muted-foreground truncate">{prompt.description}</p>
                <span className="inline-block text-xs bg-muted text-muted-foreground px-2 py-1 rounded mt-1">
                  {prompt.category}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(prompt.title)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                title="Copy"
              >
                <Copy size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
