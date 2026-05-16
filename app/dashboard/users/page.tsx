'use client'

import { useState } from 'react'
import { DataTable, Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { mockPublicUsers, PublicUser } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Eye, Lock, LockOpen, X } from 'lucide-react'

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<PublicUser | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userAccountStatus, setUserAccountStatus] = useState<{ [key: string]: 'active' | 'locked' }>({})
  const [passwordChange, setPasswordChange] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false)
  const [filterUserType, setFilterUserType] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

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

  // Apply filters
  const filteredUsers = mockPublicUsers.filter(user => {
    const matchesUserType = !filterUserType || user.userType === filterUserType
    const userStatus = userAccountStatus[user.id] ?? user.status
    const matchesStatus = !filterStatus || userStatus === filterStatus
    return matchesUserType && matchesStatus
  })

  const handleViewDetails = (user: PublicUser) => {
    setSelectedUser(user)
    setIsModalOpen(true)
    setPasswordChangeSuccess(false)
    setPasswordChange({ oldPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleChangePassword = () => {
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!')
      return
    }
    if (passwordChange.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!')
      return
    }
    setPasswordChangeSuccess(true)
    setPasswordChange({ oldPassword: '', newPassword: '', confirmPassword: '' })
    setTimeout(() => setPasswordChangeSuccess(false), 3000)
  }

  const handleToggleLock = () => {
    if (!selectedUser) return
    const currentStatus = userAccountStatus[selectedUser.id] || selectedUser.status
    setUserAccountStatus({
      ...userAccountStatus,
      [selectedUser.id]: currentStatus === 'active' ? 'locked' : 'active',
    })
  }

  const getCurrentAccountStatus = (): 'active' | 'locked' => {
    if (!selectedUser) return 'active'
    return userAccountStatus[selectedUser.id] ?? (selectedUser.status === 'active' ? 'active' : 'locked')
  }

  const clearFilters = () => {
    setFilterUserType(null)
    setFilterStatus(null)
  }

  const hasActiveFilters = filterUserType || filterStatus

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Danh sách người dùng</h1>
        <p className="text-sm text-muted-foreground">Tổng cộng {filteredUsers.length} người dùng</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Bộ lọc</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <X size={14} />
                Xoá lọc
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Loại tài khoản</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterUserType(null)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filterUserType === null
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterUserType('landlord')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filterUserType === 'landlord'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  Chủ nhà
                </button>
                <button
                  onClick={() => setFilterUserType('tenant')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filterUserType === 'tenant'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  Cư dân
                </button>
                <button
                  onClick={() => setFilterUserType('customer')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filterUserType === 'customer'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  Khách
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Trạng thái hoạt động</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus(null)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filterStatus === null
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filterStatus === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  Hoạt động
                </button>
                <button
                  onClick={() => setFilterStatus('locked')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filterStatus === 'locked'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  Khoá
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <DataTable<PublicUser>
          data={filteredUsers}
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

      {selectedUser && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết người dùng</DialogTitle>
              <DialogDescription>Quản lý thông tin và cài đặt tài khoản cho người dùng #{selectedUser.id}</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Xem thông tin</TabsTrigger>
                <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
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
                    <p className="text-sm font-medium text-muted-foreground">Trạng thái tài khoản</p>
                    <p className="mt-1">
                      <StatusBadge
                        status={getCurrentAccountStatus() === 'active' ? 'active' : 'inactive'}
                        variant={getCurrentAccountStatus() === 'active' ? 'success' : 'error'}
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
                    <p className="text-sm font-medium text-muted-foreground">Trạng thái hiện tại</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {getCurrentAccountStatus() === 'active' ? 'Hoạt động' : 'Bị khoá'}
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

                <div className="pt-4">
                  <Button
                    onClick={handleToggleLock}
                    className="w-full gap-2"
                    variant={getCurrentAccountStatus() === 'active' ? 'destructive' : 'default'}
                  >
                    {getCurrentAccountStatus() === 'active' ? (
                      <>
                        <Lock size={16} />
                        Khóa tài khoản
                      </>
                    ) : (
                      <>
                        <LockOpen size={16} />
                        Mở khóa tài khoản
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="password" className="space-y-4">
                {passwordChangeSuccess ? (
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <p className="text-sm font-medium text-green-800">Đổi mật khẩu thành công!</p>
                    <p className="text-xs text-green-700 mt-1">Mật khẩu đã được cập nhật cho người dùng {selectedUser.name}</p>
                  </div>
                ) : null}

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground">Mật khẩu cũ</label>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu cũ"
                      value={passwordChange.oldPassword}
                      onChange={(e) => setPasswordChange({ ...passwordChange, oldPassword: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Mật khẩu mới</label>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                      value={passwordChange.newPassword}
                      onChange={(e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Xác nhận mật khẩu mới</label>
                    <Input
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      value={passwordChange.confirmPassword}
                      onChange={(e) => setPasswordChange({ ...passwordChange, confirmPassword: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setPasswordChange({ oldPassword: '', newPassword: '', confirmPassword: '' })}
                    className="w-full"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleChangePassword}
                    className="w-full"
                  >
                    Cập nhật mật khẩu
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground pt-2">
                  Mật khẩu mới sẽ được cập nhật cho người dùng <span className="font-semibold">{selectedUser.name}</span>. Hãy chắc chắn rằng mật khẩu được xác nhận trước khi cập nhật.
                </p>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
