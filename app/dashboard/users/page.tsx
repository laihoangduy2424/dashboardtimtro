'use client'

import { useState } from 'react'
import { DataTable, Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { mockPublicUsers, PublicUser } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye, Lock, Trash2 } from 'lucide-react'

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<PublicUser | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all')

  const columns: Column<PublicUser>[] = [
    {
      header: 'ID',
      accessor: 'id',
      sortable: true,
      className: 'w-24',
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
      header: 'Điện thoại',
      accessor: 'phone',
    },
    {
      header: 'Tình trạng tài khoản',
      accessor: 'status',
      render: (value) => {
        const statusVariant = value === 'active' ? 'success' : 'error'
        return <StatusBadge status={value} variant={statusVariant} />
      },
      sortable: true,
    },
    {
      header: 'Lượt xem',
      accessor: 'views',
      render: (value) => value,
      sortable: true,
    },
    {
      header: 'Số liên hệ',
      accessor: 'contactCount',
      render: (value) => value,
      sortable: true,
    },
    {
      header: 'Ngày tham gia',
      accessor: 'joinedDate',
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
  ]

  const handleViewDetails = (user: PublicUser) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleSuspend = (user: PublicUser) => {
    console.log('Suspending user:', user.id)
    // TODO: Call API to suspend user
  }

  const handleDelete = (user: PublicUser) => {
    console.log('Deleting user:', user.id)
    // TODO: Call API to delete user
  }

  const getFilteredUsers = () => {
    if (filterStatus === 'all') {
      return mockPublicUsers
    }
    return mockPublicUsers.filter(u => u.status === filterStatus)
  }

  const filteredUsers = getFilteredUsers()

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Người dùng trang công khai</h1>
        <p className="mt-1 text-muted-foreground">Quản lý người dùng tìm phòng trên trang công khai</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
            filterStatus === 'all'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        >
          Tất cả ({mockPublicUsers.length})
        </button>
        <button
          onClick={() => setFilterStatus('active')}
          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
            filterStatus === 'active'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        >
          Hoạt động ({mockPublicUsers.filter(u => u.status === 'active').length})
        </button>
        <button
          onClick={() => setFilterStatus('suspended')}
          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
            filterStatus === 'suspended'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        >
          Khoá ({mockPublicUsers.filter(u => u.status === 'suspended').length})
        </button>
      </div>
      <div className="rounded-lg border border-border bg-card p-6">
        <DataTable<PublicUser>
          data={filteredUsers}
          columns={columns}
          searchPlaceholder="Tìm người dùng theo tên hoặc email..."
          searchableFields={['name', 'email', 'phone']}
          onRowClick={handleViewDetails}
          actions={(user) => (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewDetails(user)}
                className="text-muted-foreground hover:text-foreground"
                title="Xem chi tiết"
              >
                <Eye size={16} />
              </Button>
              {user.status === 'active' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSuspend(user)}
                    className="text-orange-600 hover:text-orange-700"
                    title="Khoá tài khoản"
                  >
                    <Lock size={16} />
                  </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(user)}
                className="text-red-600 hover:text-red-700"
                title="Xóa tài khoản"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          )}
        />
      </div>

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>Xem và quản lý tài khoản người dùng trang công khai</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Information */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Thông tin người dùng</h3>
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tên</p>
                    <p className="text-foreground">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-foreground">{selectedUser.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Điện thoại</p>
                    <p className="text-foreground">{selectedUser.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Tình trạng tài khoản</h3>
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                    <div className="mt-1">
                      <StatusBadge
                        status={selectedUser.status}
                        variant={selectedUser.status === 'active' ? 'success' : 'error'}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ngày tham gia</p>
                    <p className="text-foreground">{new Date(selectedUser.joinedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Hoạt động gần nhất</p>
                    <p className="text-foreground">{new Date(selectedUser.lastActive).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Activity Statistics */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Thống kê hoạt động</h3>
                <div className="grid gap-4 sm:grid-cols-2">
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

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                {selectedUser.status === 'active' && (
                  <Button
                    onClick={() => handleSuspend(selectedUser)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    <Lock size={16} className="mr-2" />
                    Khoá tài khoản
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(selectedUser)}
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 size={16} className="mr-2" />
                  Xóa tài khoản
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
