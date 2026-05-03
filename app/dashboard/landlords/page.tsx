'use client'

import { useState } from 'react'
import { DataTable, Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { mockLandlords, Landlord } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye, Lock, Unlock, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function LandlordsPage() {
  const [selectedLandlord, setSelectedLandlord] = useState<Landlord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const columns: Column<Landlord>[] = [
    {
      header: 'ID',
      accessor: 'id',
      sortable: true,
      className: 'w-20',
    },
    {
      header: 'Tên công ty',
      accessor: 'companyName',
      sortable: true,
    },
    {
      header: 'Người đại diện',
      accessor: 'representativeName',
      sortable: true,
    },
    {
      header: 'Liên hệ',
      accessor: 'phone',
      render: (value) => value,
    },
    {
      header: 'Gói dịch vụ',
      accessor: 'serviceTier',
      render: (value) => {
        const tierVariant = value === 'enterprise' ? 'success' : value === 'pro' ? 'info' : value === 'basic' ? 'warning' : 'default'
        return <StatusBadge status={value} variant={tierVariant} />
      },
      sortable: true,
    },
    {
      header: 'Tình trạng tài khoản',
      accessor: 'status',
      render: (value) => {
        const statusVariant = value === 'active' ? 'success' : value === 'expired' ? 'warning' : value === 'suspended' ? 'error' : 'default'
        return <StatusBadge status={value} variant={statusVariant} />
      },
      sortable: true,
    },
    {
      header: 'Tài sản',
      accessor: 'propertiesCount',
      render: (value) => value,
      sortable: true,
    },
    {
      header: 'Phòng',
      accessor: 'roomsCount',
      render: (value) => value,
      sortable: true,
    },
    {
      header: 'Doanh thu',
      accessor: 'totalRevenue',
      render: (value) => formatCurrency(value),
      sortable: true,
    },
  ]

  const handleViewDetails = (landlord: Landlord) => {
    setSelectedLandlord(landlord)
    setIsModalOpen(true)
  }

  const handleActivate = (landlord: Landlord) => {
    console.log('Activating landlord:', landlord.id)
    // TODO: Call API to activate landlord
  }

  const handleSuspend = (landlord: Landlord) => {
    console.log('Suspending landlord:', landlord.id)
    // TODO: Call API to suspend landlord
  }

  const handleDelete = (landlord: Landlord) => {
    console.log('Deleting landlord:', landlord.id)
    // TODO: Call API to delete landlord
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý chủ nhà</h1>
        <p className="mt-1 text-muted-foreground">Quản lý tài khoản khách hàng, gói dịch vụ và tình trạng tài khoản</p>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border border-border bg-card p-6">
        <DataTable<Landlord>
          data={mockLandlords}
          columns={columns}
          searchPlaceholder="Tìm theo tên công ty, người đại diện hoặc email..."
          searchableFields={['companyName', 'representativeName', 'email', 'phone']}
          onRowClick={handleViewDetails}
          actions={(landlord) => (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewDetails(landlord)}
                className="text-muted-foreground hover:text-foreground"
                title="Xem chi tiết"
              >
                <Eye size={16} />
              </Button>
              {landlord.status === 'active' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSuspend(landlord)}
                  className="text-orange-600 hover:text-orange-700"
                  title="Khoá tài khoản"
                >
                  <Lock size={16} />
                </Button>
              )}
              {landlord.status === 'suspended' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleActivate(landlord)}
                  className="text-green-600 hover:text-green-700"
                  title="Kích hoạt lại tài khoản"
                >
                  <Unlock size={16} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(landlord)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết tài khoản chủ nhà</DialogTitle>
            <DialogDescription>Xem và quản lý thông tin tài khoản khách hàng</DialogDescription>
          </DialogHeader>

          {selectedLandlord && (
            <div className="space-y-6">
              {/* Company Information */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Thông tin công ty</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tên công ty</p>
                    <p className="text-foreground">{selectedLandlord.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Người đại diện</p>
                    <p className="text-foreground">{selectedLandlord.representativeName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-foreground">{selectedLandlord.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Điện thoại</p>
                    <p className="text-foreground">{selectedLandlord.phone}</p>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Tình trạng tài khoản</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                    <div className="mt-1">
                      <StatusBadge
                        status={selectedLandlord.status}
                        variant={
                          selectedLandlord.status === 'active'
                            ? 'success'
                            : selectedLandlord.status === 'expired'
                              ? 'warning'
                              : selectedLandlord.status === 'suspended'
                                ? 'error'
                                : 'default'
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gói dịch vụ</p>
                    <div className="mt-1">
                      <StatusBadge
                        status={selectedLandlord.serviceTier}
                        variant={
                          selectedLandlord.serviceTier === 'enterprise'
                            ? 'success'
                            : selectedLandlord.serviceTier === 'pro'
                              ? 'info'
                              : selectedLandlord.serviceTier === 'basic'
                                ? 'warning'
                                : 'default'
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ngày tham gia</p>
                    <p className="text-foreground">{new Date(selectedLandlord.joinedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ngày hết hạn</p>
                    <p className="text-foreground">{new Date(selectedLandlord.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Properties Statistics */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Tài sản & Thống kê</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-muted-foreground">Tài sản</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{selectedLandlord.propertiesCount}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-muted-foreground">Tổng số phòng</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{selectedLandlord.roomsCount}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-muted-foreground">Người thuê đang hoạt động</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{selectedLandlord.tenantsCount}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-muted-foreground">Tổng doanh thu</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{formatCurrency(selectedLandlord.totalRevenue)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                {selectedLandlord.status === 'active' && (
                  <Button
                    onClick={() => handleSuspend(selectedLandlord)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    <Lock size={16} className="mr-2" />
                    Khoá tài khoản
                  </Button>
                )}
                {selectedLandlord.status === 'suspended' && (
                  <Button
                    onClick={() => handleActivate(selectedLandlord)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Unlock size={16} className="mr-2" />
                    Kích hoạt lại
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(selectedLandlord)}
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
