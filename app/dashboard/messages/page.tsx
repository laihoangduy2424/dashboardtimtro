'use client'

import { useState } from 'react'
import { DataTable, Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { mockDashboardConversations, DashboardConversation } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye } from 'lucide-react'

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<DashboardConversation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewDetails = (conversation: DashboardConversation) => {
    setSelectedConversation(conversation)
    setIsModalOpen(true)
  }

  const columns: Column<DashboardConversation>[] = [
    {
      header: 'Mã hội thoại',
      accessor: 'id',
      sortable: true,
      className: 'w-24 font-semibold',
    },
    {
      header: 'Người gửi',
      accessor: 'sender',
      sortable: true,
    },
    {
      header: 'Người nhận',
      accessor: 'recipient',
      sortable: true,
    },
    {
      header: 'Tin nhắn gần nhất',
      accessor: 'latestMessage',
      className: 'max-w-xs truncate',
    },
    {
      header: 'Thời gian cập nhật nhất',
      accessor: 'lastUpdated',
      sortable: true,
    },
  ]

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Danh sách hội thoại</h1>
        <p className="text-sm text-muted-foreground">Tổng cộng {mockDashboardConversations.length} hội thoại</p>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <DataTable<DashboardConversation>
          data={mockDashboardConversations}
          columns={columns}
          searchPlaceholder="Tìm theo Mã hội thoại, người gửi, hoặc người nhận..."
          searchableFields={['id', 'sender', 'recipient']}
          actions={(row) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetails(row)}
              className="gap-2 text-primary hover:bg-primary/10"
            >
              <Eye size={16} />
              <span className="hidden sm:inline">Xem</span>
            </Button>
          )}
        />
      </div>

      {/* Detail Modal */}
      {selectedConversation && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết hội thoại</DialogTitle>
              <DialogDescription>Thông tin chi tiết về cuộc hội thoại #{selectedConversation.id}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mã hội thoại</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{selectedConversation.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Loại hội thoại</p>
                  <p className="mt-1 text-sm">
                    {selectedConversation.conversationType === 'landlord_to_tenant' && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        Chủ nhà ↔ Cư dân
                      </span>
                    )}
                    {selectedConversation.conversationType === 'user_to_chatbot' && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                        Người dùng ↔ Chatbot
                      </span>
                    )}
                    {selectedConversation.conversationType === 'tenant_to_tenant' && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Cư dân ↔ Cư dân
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Người gửi</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{selectedConversation.sender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Người nhận</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{selectedConversation.recipient}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Thời gian cập nhật</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{selectedConversation.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                  <p className="mt-1">
                    {selectedConversation.status === 'active' && (
                      <StatusBadge status="active" variant="success" />
                    )}
                    {selectedConversation.status === 'resolved' && (
                      <StatusBadge status="resolved" variant="info" />
                    )}
                    {selectedConversation.status === 'pending_response' && (
                      <StatusBadge status="pending_response" variant="warning" />
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Tin nhắn gần nhất</p>
                <p className="mt-1 rounded-lg bg-muted p-3 text-sm text-foreground">{selectedConversation.latestMessage}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
