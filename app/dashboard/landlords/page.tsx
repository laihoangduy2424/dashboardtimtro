'use client'

import { useState } from 'react'
import { DataTable, Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { mockLandlords, Landlord } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Lock, Unlock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function LandlordsPage() {
  const [selectedLandlord, setSelectedLandlord] = useState<Landlord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'expired'>('all')
  const [filterTier, setFilterTier] = useState<'all' | 'basic' | 'pro' | 'enterprise'>('all')

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

  const getFilteredLandlords = () => {
    let result = mockLandlords
    
    if (filterStatus !== 'all') {
      result = result.filter(l => l.status === filterStatus)
    }
    
    if (filterTier !== 'all') {
      result = result.filter(l => l.serviceTier === filterTier)
    }
    
    return result
  }

  const filteredLandlords = getFilteredLandlords()

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground"></h1>
        <p className="mt-1 text-muted-foreground"></p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            Tất cả ({mockLandlords.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
              filterStatus === 'active'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            Hoạt động ({mockLandlords.filter(l => l.status === 'active').length})
          </button>
          <button
            onClick={() => setFilterStatus('suspended')}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
              filterStatus === 'suspended'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            Khoá ({mockLandlords.filter(l => l.status === 'suspended').length})
          </button>
          <button
            onClick={() => setFilterStatus('expired')}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
              filterStatus === 'expired'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            Hết hạn ({mockLandlords.filter(l => l.status === 'expired').length})
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterTier('all')}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
              filterTier === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            Tất cả gói
          </button>
          <button
            onClick={() => setFilterTier('basic')}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
              filterTier === 'basic'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            Basic ({mockLandlords.filter(l => l.serviceTier === 'basic').length})
          </button>
          <button
            onClick={() => setFilterTier('pro')}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
              filterTier === 'pro'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            Pro ({mockLandlords.filter(l => l.serviceTier === 'pro').length})
          </button>
          <button
            onClick={() => setFilterTier('enterprise')}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
              filterTier === 'enterprise'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            Enterprise ({mockLandlords.filter(l => l.serviceTier === 'enterprise').length})
          </button>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-6">
        <DataTable<Landlord>
          data={filteredLandlords}
          columns={columns}
          searchPlaceholder="Tìm theo tên công ty, người đại diện hoặc email..."
          searchableFields={['companyName', 'representativeName', 'email', 'phone']}
          onRowClick={handleViewDetails}
        />
      </div>

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <div className="flex gap-2 pt-4 border-t border-border">
                {selectedLandlord.status === 'active' && (
                  <Button
                    onClick={() => handleSuspend(selectedLandlord)}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Lock size={16} className="mr-2" />
                    Khoá tài khoản
                  </Button>
                )}
                {selectedLandlord.status === 'suspended' && (
                  <Button
                    onClick={() => handleActivate(selectedLandlord)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Unlock size={16} className="mr-2" />
                    Kích hoạt lại
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
