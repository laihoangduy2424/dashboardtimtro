'use client'

import { useState } from 'react'
import { DataTable, Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { mockRooms, Room } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Check, X } from 'lucide-react'

export default function RoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'room_rental' | 'shared_room' | 'displaying' | 'hidden'>('all')

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
      header: 'Loại tin đăng',
      accessor: 'listingType',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value === 'room_rental' ? 'Phòng trọ' : 'Ở ghép'}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Chủ nhà',
      accessor: 'landlordName',
      sortable: true,
    },
    {
      header: 'Trạng thái công khai',
      accessor: 'publicStatus',
      render: (value) => {
        let variant: 'success' | 'warning' | 'default' | 'error' | 'info' = 'default'
        if (value === 'displaying') variant = 'success'
        if (value === 'hidden') variant = 'warning'
        if (value === 'pending_review') variant = 'warning'
        return <StatusBadge status={value} variant={variant} />
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
      header: 'Lượt xem',
      accessor: 'views',
      render: (value) => value || 0,
      sortable: true,
    },
  ]

  const getFilteredRooms = () => {
    switch (filterType) {
      case 'room_rental':
        return mockRooms.filter(r => r.listingType === 'room_rental')
      case 'shared_room':
        return mockRooms.filter(r => r.listingType === 'shared_room')
      case 'displaying':
        return mockRooms.filter(r => r.publicStatus === 'displaying')
      case 'hidden':
        return mockRooms.filter(r => r.publicStatus === 'hidden' || r.publicStatus === 'pending_review')
      default:
        return mockRooms
    }
  }

  const filteredRooms = getFilteredRooms()

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room)
    setIsModalOpen(true)
  }

  const handleApprove = (room: Room) => {
    console.log('Approving listing:', room.id)
    // TODO: Call API to approve
  }

  const handleReject = (room: Room) => {
    console.log('Rejecting listing:', room.id)
    // TODO: Call API to reject
  }

  const handleHide = (room: Room) => {
    console.log('Hiding listing:', room.id)
    // TODO: Call API to hide
  }

  const handleShow = (room: Room) => {
    console.log('Showing listing:', room.id)
    // TODO: Call API to show
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý tin đăng</h1>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
            filterType === 'all'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        >
          Tất cả tin ({mockRooms.length})
        </button>
        <button
          onClick={() => setFilterType('room_rental')}
          className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
            filterType === 'room_rental'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        >
          Phòng trọ ({mockRooms.filter(r => r.listingType === 'room_rental').length})
        </button>
        <button
          onClick={() => setFilterType('shared_room')}
          className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
            filterType === 'shared_room'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        >
          Ở ghép ({mockRooms.filter(r => r.listingType === 'shared_room').length})
        </button>
        <button
          onClick={() => setFilterType('displaying')}
          className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
            filterType === 'displaying'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        >
          Đang hiển thị ({mockRooms.filter(r => r.publicStatus === 'displaying').length})
        </button>
        <button
          onClick={() => setFilterType('hidden')}
          className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
            filterType === 'hidden'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        >
          Đã ẩn ({mockRooms.filter(r => r.publicStatus === 'hidden' || r.publicStatus === 'pending_review').length})
        </button>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border border-border bg-card p-6">
        <DataTable<Room>
          data={filteredRooms}
          columns={columns}
          searchPlaceholder="Tìm tin theo tiêu đề hoặc địa chỉ..."
          searchableFields={['title', 'address', 'landlordName', 'building']}
          onRowClick={handleViewDetails}
        />
      </div>

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết tin đăng</DialogTitle>
            <DialogDescription>Xem thông tin tin đăng và các chỉ số tương tác</DialogDescription>
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
                    <p className="text-sm font-medium text-muted-foreground">Loại tin đăng</p>
                    <p className="text-foreground font-semibold">
                      {selectedRoom.listingType === 'room_rental' ? 'Phòng trọ' : 'Ở ghép'}
                    </p>
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
                </div>
              </div>

              {/* Status Information */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Thông tin trạng thái</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trạng thái công khai</p>
                    <div className="mt-1">
                      <StatusBadge
                        status={selectedRoom.publicStatus}
                        variant={
                          selectedRoom.publicStatus === 'displaying'
                            ? 'success'
                            : 'warning'
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
                    <p className="text-foreground">{new Date(selectedRoom.createdDate).toLocaleDateString('vi-VN')}</p>
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
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <p className="text-sm font-semibold text-foreground">Các tác vụ</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedRoom.publicStatus === 'pending_review' && (
                    <>
                      <Button
                        onClick={() => handleApprove(selectedRoom)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check size={16} className="mr-2" />
                        Duyệt
                      </Button>
                      <Button
                        onClick={() => handleReject(selectedRoom)}
                        variant="destructive"
                      >
                        <X size={16} className="mr-2" />
                        Không duyệt
                      </Button>
                      <Button
                        onClick={() => handleHide(selectedRoom)}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Ẩn trạng thái công khai
                      </Button>
                    </>
                  )}
                  {selectedRoom.publicStatus === 'displaying' && (
                    <Button
                      onClick={() => handleHide(selectedRoom)}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Ẩn trạng thái công khai
                    </Button>
                  )}
                  {selectedRoom.publicStatus === 'hidden' && (
                    <Button
                      onClick={() => handleShow(selectedRoom)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Hiển thị trạng thái công khai
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
