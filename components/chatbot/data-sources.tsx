'use client'

import { useState } from 'react'
import { SamplePrompt } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Trash2, GripVertical } from 'lucide-react'

interface DataSourceItem {
  id: string
  title: string
  description: string
  category: string
  enabled: boolean
  priority: number
  tokenCount: number
}

interface DataSourcesProps {
  availableSources: SamplePrompt[]
  onSourcesChange?: (sources: DataSourceItem[]) => void
}

export default function DataSources({ availableSources, onSourcesChange }: DataSourcesProps) {
  const [dataSources, setDataSources] = useState<DataSourceItem[]>(
    availableSources
      .slice(0, 3)
      .map((source, index) => ({
        id: source.id,
        title: source.title,
        description: source.description,
        category: source.category,
        enabled: true,
        priority: index + 1,
        tokenCount: source.tokenCount,
      }))
  )

  const handleToggleSource = (id: string) => {
    const updated = dataSources.map((source) =>
      source.id === id ? { ...source, enabled: !source.enabled } : source
    )
    setDataSources(updated)
    onSourcesChange?.(updated)
  }

  const handleDeleteSource = (id: string) => {
    const updated = dataSources
      .filter((source) => source.id !== id)
      .map((source, index) => ({ ...source, priority: index + 1 }))
    setDataSources(updated)
    onSourcesChange?.(updated)
  }

  const handleAddSource = () => {
    // Find a source not already added
    const existingIds = new Set(dataSources.map((s) => s.id))
    const newSource = availableSources.find((s) => !existingIds.has(s.id))

    if (newSource) {
      const newItem: DataSourceItem = {
        id: newSource.id,
        title: newSource.title,
        description: newSource.description,
        category: newSource.category,
        enabled: true,
        priority: dataSources.length + 1,
        tokenCount: newSource.tokenCount,
      }
      const updated = [...dataSources, newItem]
      setDataSources(updated)
      onSourcesChange?.(updated)
    }
  }

  const canAddMore = dataSources.length < availableSources.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Quản lý Nguồn Dữ liệu</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Chọn và ưu tiên các nguồn dữ liệu cho chatbot
        </p>
      </div>

      <div className="space-y-3">
        {dataSources.map((source) => (
          <div
            key={source.id}
            className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex gap-4">
              {/* Toggle Switch */}
              <div className="flex-shrink-0 flex items-start pt-1">
                <button
                  onClick={() => handleToggleSource(source.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    source.enabled ? 'bg-green-500' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      source.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{source.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{source.description}</p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteSource(source.id)}
                    className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1"
                    title="Xóa nguồn dữ liệu"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Badge and Priority */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {source.category}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    Ưu tiên: {source.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {dataSources.length === 0 && (
          <div className="p-8 text-center rounded-lg border border-border border-dashed bg-muted/30">
            <p className="text-sm text-muted-foreground">Chưa có nguồn dữ liệu. Thêm nguồn để bắt đầu.</p>
          </div>
        )}
      </div>

      {canAddMore && (
        <Button
          onClick={handleAddSource}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 h-auto"
        >
          + Thêm Nguồn Dữ liệu
        </Button>
      )}
    </div>
  )
}
