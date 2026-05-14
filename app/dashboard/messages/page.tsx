'use client'

import { useState } from 'react'
import { DataTable, Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { mockConversations, Conversation } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye, MessageCircle } from 'lucide-react'

type ConversationType = 'all' | 'landlord_resident' | 'user_chatbot' | 'guest_listing_owner'
type ConversationStatus = 'all' | 'active' | 'pending_response' | 'handled' | 'locked' | 'violation'

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterType, setFilterType] = useState<ConversationType>('all')
  const [filterStatus, setFilterStatus] = useState<ConversationStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const columns: Column<Conversation>[] = [
    {
      header: 'Mã hội thoại',
      accessor: 'id',
      sortable: true,
      className: 'w-28 font-mono text-sm',
    },
    {
      header: 'Loại hội thoại',
      accessor: 'type',
      render: (value) => {
        const labels: Record<string, { label: string; color: string }> = {
          'landlord_resident': { label: 'Chủ nhà ↔ Cư dân', color: 'bg-blue-100 text-blue-800' },
          'user_chatbot': { label: 'Người dùng ↔ Chatbot', color: 'bg-purple-100 text-purple-800' },
          'guest_listing_owner': { label: 'Khách ↔ Người đăng tin', color: 'bg-green-100 text-green-800' },
        }
        const item = labels[value as string] || { label: value, color: 'bg-gray-100 text-gray-800' }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.color}`}>
            {item.label}
          </span>
        )
      },
      sortable: true,
    },
    {
      header: 'Người gửi',
      accessor: 'senderName',
      sortable: true,
    },
    {
      header: 'Người nhận',
      accessor: 'receiverName',
      sortable: true,
    },
    {
      header: 'Tin nhắn gần nhất',
      accessor: 'lastMessage',
      render: (value) => (
        <span className="text-sm text-foreground line-clamp-2">
          {typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value}
        </span>
      ),
      className: 'max-w-xs',
    },
    {
      header: 'Thời gian cập nhật',
      accessor: 'lastMessageTime',
      render: (value) => {
        const date = new Date(value as string)
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      },
      sortable: true,
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (value) => {
        const variants: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
          'active': 'success',
          'pending_response': 'warning',
          'handled': 'info',
          'locked': 'error',
          'violation': 'error',
        }
        const labels: Record<string, string> = {
          'active': 'Đang hoạt động',
          'pending_response': 'Chờ phản hồi',
          'handled': 'Đã xử lý',
          'locked': 'Đã khóa',
          'violation': 'Vi phạm',
        }
        return (
          <StatusBadge 
            status={labels[value as string] || value as string} 
            variant={variants[value as string] || 'default'}
          />
        )
      },
      sortable: true,
    },
  ]

  const getFilteredConversations = () => {
    let result = mockConversations

    if (filterType !== 'all') {
      result = result.filter(c => c.type === filterType)
    }

    if (filterStatus !== 'all') {
      result = result.filter(c => c.status === filterStatus)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(c => 
        c.id.toLowerCase().includes(query) ||
        c.senderName.toLowerCase().includes(query) ||
        c.receiverName.toLowerCase().includes(query) ||
        c.lastMessage.toLowerCase().includes(query)
      )
    }

    return result
  }

  const filteredConversations = getFilteredConversations()

  const handleViewDetails = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Danh sách hội thoại</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tổng cộng {mockConversations.length} hội thoại</p>
      </div>

      {/* Filters */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        {/* Search and Main Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-3">
          {/* Search Input */}
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground">Tìm kiếm</label>
            <input
              type="text"
              placeholder="Tìm theo nội dung, người dùng, mã hội thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Type Filter */}
          <div className="min-w-max">
            <label className="text-sm font-medium text-foreground">Loại hội thoại</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ConversationType)}
              className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">Tất cả</option>
              <option value="landlord_resident">Chủ nhà ↔ Cư dân</option>
              <option value="user_chatbot">Người dùng ↔ Chatbot</option>
              <option value="guest_listing_owner">Khách ↔ Người đăng tin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="min-w-max">
            <label className="text-sm font-medium text-foreground">Trạng thái</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ConversationStatus)}
              className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="pending_response">Chờ phản hồi</option>
              <option value="handled">Đã xử lý</option>
              <option value="locked">Đã khóa</option>
              <option value="violation">Vi phạm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border border-border bg-card p-6">
        <DataTable<Conversation>
          data={filteredConversations}
          columns={columns}
          onRowClick={handleViewDetails}
        />
      </div>

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết hội thoại</DialogTitle>
            <DialogDescription>Xem thông tin chi tiết và quản lý hội thoại</DialogDescription>
          </DialogHeader>

          {selectedConversation && (
            <div className="space-y-6">
              {/* Conversation Info */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Thông tin hội thoại</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mã hội thoại</p>
                    <p className="mt-1 font-mono text-sm text-foreground">{selectedConversation.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Loại hội thoại</p>
                    <p className="mt-1 text-foreground">
                      {selectedConversation.type === 'landlord_resident'
                        ? 'Chủ nhà ↔ Cư dân'
                        : selectedConversation.type === 'user_chatbot'
                          ? 'Người dùng ↔ Chatbot'
                          : 'Khách ↔ Người đăng tin'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Người tham gia</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-muted-foreground">Người gửi</p>
                    <p className="mt-2 font-semibold text-foreground">{selectedConversation.senderName}</p>
                    <p className="text-xs text-muted-foreground">{selectedConversation.senderId}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-muted-foreground">Người nhận</p>
                    <p className="mt-2 font-semibold text-foreground">{selectedConversation.receiverName}</p>
                    <p className="text-xs text-muted-foreground">{selectedConversation.receiverId}</p>
                  </div>
                </div>
              </div>

              {/* Message Stats */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Thông tin tin nhắn</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-muted-foreground">Tổng tin nhắn</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{selectedConversation.messageCount}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-muted-foreground">Tin nhắn chưa đọc</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{selectedConversation.unreadCount}</p>
                  </div>
                </div>
              </div>

              {/* Status and Dates */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Trạng thái</h3>
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trạng thái hiện tại</p>
                    <div className="mt-1">
                      <StatusBadge
                        status={selectedConversation.status === 'active' 
                          ? 'Đang hoạt động'
                          : selectedConversation.status === 'pending_response'
                            ? 'Chờ phản hồi'
                            : selectedConversation.status === 'handled'
                              ? 'Đã xử lý'
                              : selectedConversation.status === 'locked'
                                ? 'Đã khóa'
                                : 'Vi phạm'}
                        variant={selectedConversation.status === 'active' 
                          ? 'success'
                          : selectedConversation.status === 'pending_response'
                            ? 'warning'
                            : selectedConversation.status === 'handled'
                              ? 'info'
                              : 'error'}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                      <p className="mt-1 text-foreground">{new Date(selectedConversation.createdDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                      <p className="mt-1 text-foreground">{new Date(selectedConversation.lastMessageTime).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Message Preview */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Tin nhắn gần nhất</h3>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm italic text-foreground">"{selectedConversation.lastMessage}"</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(selectedConversation.lastMessageTime).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
