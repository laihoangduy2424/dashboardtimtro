'use client'

import { useState } from 'react'
import { DataTable, Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { mockPublicUsers, PublicUser } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FilterButton } from '@/components/filter-button'
import { Lock } from 'lucide-react'

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<PublicUser | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all')

  const handleViewDetails = (user: PublicUser) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleSuspend = (user: PublicUser) => {
    console.log('Suspending user:', user.id)
    // TODO: Call API to suspend user
  }

  const handleActivate = (user: PublicUser) => {
    console.log('Activating user:', user.id)
    // TODO: Call API to activate user
  }

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
      header: 'Loại tài khoản',
      accessor: 'accountType',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value === 'landlord' ? 'Chủ nhà' : 'Cư dân'}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Quyền đăng bài',
      accessor: 'postingPermission',
      render: (value) => {
        const labels: Record<string, string> = {
          'room_rental': 'Phòng trọ',
          'shared_room': 'Ở ghép',
          'both': 'Cả hai',
        }
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {labels[value]}
          </span>
        )
      },
      sortable: true,
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
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
  ]

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
        <FilterButton
          label="Tất cả"
          count={mockPublicUsers.length}
          isActive={filterStatus === 'all'}
          onClick={() => setFilterStatus('all')}
        />
        <FilterButton
          label="Hoạt động"
          count={mockPublicUsers.filter(u => u.status === 'active').length}
          isActive={filterStatus === 'active'}
          onClick={() => setFilterStatus('active')}
        />
        <FilterButton
          label="Khoá"
          count={mockPublicUsers.filter(u => u.status === 'suspended').length}
          isActive={filterStatus === 'suspended'}
          onClick={() => setFilterStatus('suspended')}
        />
      </div>
      <div className="rounded-lg border border-border bg-card p-6">
        <DataTable<PublicUser>
          data={filteredUsers}
          columns={columns}
          searchPlaceholder="Tìm người dùng theo tên hoặc email..."
          searchableFields={['name', 'email', 'phone']}
          onRowClick={handleViewDetails}
        />
      </div>

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết tài khoản người dùng</DialogTitle>
            <DialogDescription>Xem thông tin tài khoản và quyền đăng bài</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Information */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Thông tin tài khoản</h3>
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

              {/* Account Type & Permissions */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Loại tài khoản & Quyền</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Loại tài khoản</p>
                    <p className="mt-1 font-semibold text-foreground">
                      {selectedUser.accountType === 'landlord' ? 'Chủ nhà' : 'Cư dân'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Có thể đăng bài</p>
                    <p className="mt-1 font-semibold text-foreground">
                      {selectedUser.canPostListing ? 'Có' : 'Không'}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Quyền đăng bài</p>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {selectedUser.postingPermission === 'room_rental'
                          ? 'Phòng trọ'
                          : selectedUser.postingPermission === 'shared_room'
                            ? 'Ở ghép'
                            : 'Cả hai'}
                      </span>
                    </div>
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
                    <p className="text-foreground">{new Date(selectedUser.joinedDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Hoạt động gần nhất</p>
                    <p className="text-foreground">{new Date(selectedUser.lastActive).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border">
                {selectedUser.status === 'active' && (
                  <Button
                    onClick={() => handleSuspend(selectedUser)}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Lock size={16} className="mr-2" />
                    Khóa tài khoản
                  </Button>
                )}
                {selectedUser.status === 'suspended' && (
                  <Button
                    onClick={() => handleActivate(selectedUser)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Mở khóa tài khoản
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
