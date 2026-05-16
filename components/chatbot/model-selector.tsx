'use client'

import { ChatbotModel } from '@/lib/mock-data'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Zap } from 'lucide-react'

interface ModelSelectorProps {
  models: ChatbotModel[]
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export default function ModelSelector({ models, selectedModel, onModelChange }: ModelSelectorProps) {
  const selected = models.find(m => m.id === selectedModel)

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={20} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Mô hình</h3>
      </div>
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {models.map(model => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground">{model.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selected && (
        <p className="text-xs text-muted-foreground mt-2">
          Context Window: {selected.contextWindow.toLocaleString()} tokens
        </p>
      )}
    </div>
  )
}
