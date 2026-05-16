'use client'

import { TokenInfo } from '@/lib/mock-data'
import { BarChart3, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface TokenManagementProps {
  tokenInfo: TokenInfo
}

export default function TokenManagement({ tokenInfo }: TokenManagementProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleClearTokens = () => {
    setShowDeleteConfirm(false)
    // Mock clear tokens action
  }

  const tokensRemaining = tokenInfo.limit - tokenInfo.totalUsed
  const costEstimate = (tokenInfo.totalUsed / 1000000) * tokenInfo.costPerMillion

  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={20} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Quản lý Token</h3>
      </div>

      {/* Token Usage Stats */}
      <div className="space-y-4 flex-1">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">Sử dụng</span>
            <span className="text-xs text-muted-foreground">
              {tokenInfo.totalUsed.toLocaleString()} / {tokenInfo.limit.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${tokenInfo.percentageUsed}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {tokenInfo.percentageUsed.toFixed(3)}% sử dụng
          </p>
        </div>

        {/* Token Statistics */}
        <div className="bg-muted rounded-lg p-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Tokens còn lại</span>
            <span className="text-sm font-medium text-foreground">
              {tokensRemaining.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Chi phí ước tính</span>
            <span className="text-sm font-medium text-foreground">
              ${costEstimate.toFixed(4)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Giá (/ 1M tokens)</span>
            <span className="text-sm font-medium text-foreground">
              ${tokenInfo.costPerMillion}
            </span>
          </div>
        </div>

        {/* Alert if usage is high */}
        {tokenInfo.percentageUsed > 80 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex gap-2">
            <AlertCircle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-xs text-destructive">
              <p className="font-medium">Cảnh báo sử dụng cao</p>
              <p className="text-destructive/80 mt-0.5">Bạn đã sử dụng hơn 80% giới hạn token</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-border space-y-2 mt-auto">
        {!showDeleteConfirm ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 size={16} />
            Xóa lịch sử token
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-foreground font-medium">Bạn chắc chắn chứ?</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleClearTokens}
                variant="destructive"
                className="flex-1"
              >
                Xác nhận
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
