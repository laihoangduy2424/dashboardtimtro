'use client'

import { useState } from 'react'
import { DataTable, Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { mockPublicUsers, PublicUser } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye } from 'lucide-react'

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<PublicUser | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const columns: Column<PublicUser>[] = [
    {
      header: 'ID',
      accessor: 'id',
      sortable: true,
      className: 'w-24 font-semibold',
    },
    {
      header: 'Tên',
      accessor: 'name',
      sortable: true,
    },
    {
      header: 'Email',
      accessor: 'email',
      sortable: true,
    },
    {
      header: 'Loại tài khoản',
      accessor: 'userType',
      render: (value) => {
        if (value === 'landlord') return <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">Chủ nhà</span>
        if (value === 'tenant') return <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">Cư dân</span>
        return <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">Khách</span>
      },
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (value) => {
        const statusVariant = value === 'active' ? 'success' : 'error'
        return <StatusBadge status={value} variant={statusVariant} />
      },
      sortable: true,
    },
    {
      header: 'Ngày tham gia',
      accessor: 'joinedDate',
      render: (value) => new Date(value).toLocaleDateString('vi-VN'),
      sortable: true,
    },
  ]

  const handleViewDetails = (user: PublicUser) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Danh sách người dùng</h1>
        <p className="text-sm text-muted-foreground">Tổng cộng {mockPublicUsers.length} người dùng</p>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <DataTable<PublicUser>
          data={mockPublicUsers}
          columns={columns}
          searchPlaceholder="Tìm người dùng theo ID, tên hoặc email..."
          searchableFields={['id', 'name', 'email']}
          actions={(user) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetails(user)}
              className="gap-2 text-primary hover:bg-primary/10"
            >
              <Eye size={16} />
              <span className="hidden sm:inline">Xem</span>
            </Button>
          )}
        />
      </div>

      {/* Detail Modal */}
      {selectedUser && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết người dùng</DialogTitle>
              <DialogDescription>Thông tin chi tiết về người dùng #{selectedUser.id}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tên</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{selectedUser.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{selectedUser.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Điện thoại</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{selectedUser.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Loại tài khoản</p>
                  <p className="mt-1">
                    {selectedUser.userType === 'landlord' && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        Chủ nhà
                      </span>
                    )}
                    {selectedUser.userType === 'tenant' && (
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                        Cư dân
                      </span>
                    )}
                    {selectedUser.userType === 'customer' && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        Khách
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                  <p className="mt-1">
                    <StatusBadge
                      status={selectedUser.status}
                      variant={selectedUser.status === 'active' ? 'success' : 'error'}
                    />
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ngày tham gia</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {new Date(selectedUser.joinedDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hoạt động gần nhất</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {new Date(selectedUser.lastActive).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái tài khoản</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {selectedUser.status === 'active' ? 'Hoạt động' : 'Bị khoá'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm font-medium text-muted-foreground">Lượt xem phòng</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{selectedUser.views}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm font-medium text-muted-foreground">Số liên hệ đã thực hiện</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{selectedUser.contactCount}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
