'use client'

import { useState } from 'react'
import { DataTable, Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { mockRooms, Room } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function RoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending_review' | 'displaying' | 'hidden' | 'rented'>('all')



  const columns: Column<Room>[] = [
    {
      header: 'ID',
      accessor: 'id',
      sortable: true,
      className: 'w-20',
    },
    {
      header: 'Tiêu đề tin',
      accessor: 'title',
      sortable: true,
    },
    {
      header: 'Địa chỉ',
      accessor: 'address',
      className: 'max-w-xs truncate',
      sortable: true,
    },
    {
      header: 'Chủ nhà',
      accessor: 'landlordName',
      sortable: true,
    },
    {
      header: 'Giá',
      accessor: 'price',
      render: (value) => formatCurrency(value),
      sortable: true,
    },
    {
      header: 'Trạng thái nội bộ',
      accessor: 'internalStatus',
      render: (value) => {
        const statusVariant = value === 'available' ? 'success' : value === 'rented' ? 'info' : 'warning'
        return <StatusBadge status={value} variant={statusVariant} />
      },
      sortable: true,
    },
    {
      header: 'Trạng thái công khai',
      accessor: 'publicStatus',
      render: (value) => {
        const statusVariant = value === 'displaying' ? 'success' : value === 'pending_review' ? 'warning' : value === 'rented' ? 'info' : 'default'
        return <StatusBadge status={value} variant={statusVariant} />
      },
      sortable: true,
    },
    {
      header: 'Trạng thái duyệt',
      accessor: 'reviewStatus',
      render: (value) => {
        const statusVariant = value === 'approved' ? 'success' : value === 'rejected' ? 'error' : 'warning'
        return <StatusBadge status={value || 'pending'} variant={statusVariant} />
      },
      sortable: true,
    },
    {
      header: 'Lượt xem trang',
      accessor: 'views',
      render: (value) => value || 0,
      sortable: true,
    },
  ]

  const filteredRooms = filterStatus === 'all' 
    ? mockRooms 
    : mockRooms.filter(r => r.publicStatus === filterStatus)

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room)
    setIsModalOpen(true)
  }



  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý tin đăng</h1>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border border-border bg-card p-6">
        <DataTable<Room>
          data={filteredRooms}
          columns={columns}
          searchPlaceholder="Tìm tin theo tiêu đề hoặc địa chỉ..."
          searchableFields={['title', 'address', 'landlordName', 'building']}
          onRowClick={handleViewDetails}
          actions={(room) => (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewDetails(room)}
                className="text-muted-foreground hover:text-foreground"
                title="Xem chi tiết"
              >
                <Eye size={16} />
              </Button>
            </div>
          )}
        />
      </div>

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết tin đăng</DialogTitle>
            <DialogDescription>Xem và quản lý thông tin tin đăng và các chỉ số tương tác</DialogDescription>
          </DialogHeader>

          {selectedRoom && (
            <div className="space-y-6">
              {/* Listing Information */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Thông tin tin đăng</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Tiêu đề</p>
                    <p className="text-foreground font-semibold">{selectedRoom.title}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
                    <p className="text-foreground">{selectedRoom.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Toà nhà/Tài sản</p>
                    <p className="text-foreground">{selectedRoom.building}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Chủ nhà</p>
                    <p className="text-foreground">{selectedRoom.landlordName}</p>
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Chi tiết phòng</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-muted-foreground">Phòng ngủ</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{selectedRoom.bedrooms}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-muted-foreground">Phòng tắm</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{selectedRoom.bathrooms}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-muted-foreground">Diện tích</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{selectedRoom.area} m²</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 sm:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Giá</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(selectedRoom.price)}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-muted-foreground">Giá/m²</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(selectedRoom.price / selectedRoom.area)}</p>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Thông tin trạng thái</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trạng thái nội bộ</p>
                    <div className="mt-1">
                      <StatusBadge
                        status={selectedRoom.internalStatus}
                        variant={
                          selectedRoom.internalStatus === 'available'
                            ? 'success'
                            : selectedRoom.internalStatus === 'rented'
                              ? 'info'
                              : 'warning'
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trạng thái công khai</p>
                    <div className="mt-1">
                      <StatusBadge
                        status={selectedRoom.publicStatus}
                        variant={
                          selectedRoom.publicStatus === 'displaying'
                            ? 'success'
                            : selectedRoom.publicStatus === 'pending_review'
                              ? 'warning'
                              : selectedRoom.publicStatus === 'rented'
                                ? 'info'
                                : 'default'
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trạng thái duyệt</p>
                    <div className="mt-1">
                      <StatusBadge
                        status={selectedRoom.reviewStatus || 'pending'}
                        variant={
                          selectedRoom.reviewStatus === 'approved'
                            ? 'success'
                            : selectedRoom.reviewStatus === 'rejected'
                              ? 'error'
                              : 'warning'
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ngày đăng</p>
                    <p className="text-foreground">{new Date(selectedRoom.createdDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Page Visit Metrics */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Chỉ số lượt xem trang</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium text-muted-foreground">Tổng lượt xem</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{selectedRoom.views || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Lượt truy cập của người dùng đến tin này</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium text-muted-foreground">Xếp hạng lượt xem</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      #{mockRooms.filter(r => (r.views || 0) >= (selectedRoom.views || 0)).length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Trong {mockRooms.length} tin đăng</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleEdit(selectedRoom)}
                  variant="outline"
                  className="flex-1"
                >
                  <Edit size={16} className="mr-2" />
                  Chỉnh sửa tin
                </Button>
                {selectedRoom.publicStatus === 'pending_review' && (
                  <>
                    <Button
                      onClick={() => handleApprove(selectedRoom)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check size={16} className="mr-2" />
                      Duyệt
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedRoom)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <X size={16} className="mr-2" />
                      Từ chối
                    </Button>
                  </>
                )}
                {selectedRoom.publicStatus === 'displaying' && (
                  <Button
                    onClick={() => handleHideFromPublic(selectedRoom)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    <EyeOff size={16} className="mr-2" />
                    Ẩn khỏi công khai
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(selectedRoom)}
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 size={16} className="mr-2" />
                  Xóa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
