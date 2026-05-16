'use client'

import { useState } from 'react'
import { mockRooms, Room } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Eye, Trash2 } from 'lucide-react'

type ListingStatus = 'pending' | 'approved' | 'deleted'

interface ListingWithDeletedAt extends Room {
  deletedAt?: string
  selectedAt?: boolean
}

export default function ListingsPage() {
  const [listings, setListings] = useState<ListingWithDeletedAt[]>(
    mockRooms.map((room) => ({
      ...room,
      deletedAt: undefined,
      selectedAt: false,
    }))
  )
  const [statusFilter, setStatusFilter] = useState<ListingStatus>('pending')
  const [confirmDialog, setConfirmDialog] = useState<{
    type: 'approve' | 'delete' | null
    listingId?: string
  }>({ type: null })
  const [selectedAll, setSelectedAll] = useState(false)

  // Filter listings based on status
  const getFilteredListings = () => {
    return listings.filter((listing) => {
      if (statusFilter === 'pending') {
        return listing.reviewStatus === 'pending' && !listing.deletedAt
      } else if (statusFilter === 'approved') {
        return listing.reviewStatus === 'approved' && !listing.deletedAt
      } else if (statusFilter === 'deleted') {
        return !!listing.deletedAt
      }
      return true
    })
  }

  const filteredListings = getFilteredListings()

  // Count listings by status
  const pendingCount = listings.filter(
    (l) => l.reviewStatus === 'pending' && !l.deletedAt
  ).length
  const approvedCount = listings.filter(
    (l) => l.reviewStatus === 'approved' && !l.deletedAt
  ).length
  const deletedCount = listings.filter((l) => !!l.deletedAt).length

  const handleSelectAll = (checked: boolean) => {
    setSelectedAll(checked)
    setListings(
      listings.map((listing) => ({
        ...listing,
        selectedAt: checked && statusFilter !== 'deleted',
      }))
    )
  }

  const handleSelectListing = (id: string, checked: boolean) => {
    setListings(
      listings.map((listing) =>
        listing.id === id ? { ...listing, selectedAt: checked } : listing
      )
    )
  }

  const handleApprove = (listingId?: string) => {
    if (listingId) {
      setListings(
        listings.map((listing) =>
          listing.id === listingId
            ? { ...listing, reviewStatus: 'approved', selectedAt: false }
            : listing
        )
      )
    } else {
      // Approve all selected
      setListings(
        listings.map((listing) =>
          listing.selectedAt && listing.reviewStatus === 'pending'
            ? { ...listing, reviewStatus: 'approved', selectedAt: false }
            : listing
        )
      )
      setSelectedAll(false)
    }
    setConfirmDialog({ type: null })
  }

  const handleDelete = (listingId: string) => {
    setListings(
      listings.map((listing) =>
        listing.id === listingId
          ? { ...listing, deletedAt: new Date().toISOString(), selectedAt: false }
          : listing
      )
    )
    setConfirmDialog({ type: null })
  }

  const hasSelected = listings.some((l) => l.selectedAt)

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Quản lý tin đăng</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý và duyệt các tin đăng từ chủ nhà
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border">
        <button
          onClick={() => {
            setStatusFilter('pending')
            setSelectedAll(false)
          }}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            statusFilter === 'pending'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Chờ duyệt ({pendingCount})
        </button>
        <button
          onClick={() => {
            setStatusFilter('approved')
            setSelectedAll(false)
          }}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            statusFilter === 'approved'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Đã duyệt ({approvedCount})
        </button>
        <button
          onClick={() => {
            setStatusFilter('deleted')
            setSelectedAll(false)
          }}
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            statusFilter === 'deleted'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Đã xóa ({deletedCount})
        </button>
      </div>

      {/* Toolbar */}
      {hasSelected && statusFilter === 'pending' && (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium text-foreground">
            Đã chọn {listings.filter((l) => l.selectedAt).length} tin
          </span>
          <Button
            onClick={() => setConfirmDialog({ type: 'approve' })}
            className="bg-green-500 hover:bg-green-600 text-white gap-2"
          >
            Duyệt
          </Button>
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="w-12 px-4 py-3 text-left">
                {statusFilter !== 'deleted' && (
                  <input
                    type="checkbox"
                    checked={selectedAll && filteredListings.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded"
                  />
                )}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                Ngày gửi bài
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                Danh mục
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                Người đăng
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                Tiêu đề
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <tr
                  key={listing.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="w-12 px-4 py-3">
                    {statusFilter !== 'deleted' && (
                      <input
                        type="checkbox"
                        checked={listing.selectedAt || false}
                        onChange={(e) =>
                          handleSelectListing(listing.id, e.target.checked)
                        }
                        className="rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                    {listing.listingDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {listing.building}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {listing.landlordName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground max-w-xs truncate">
                    {listing.title}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs font-medium px-2"
                        onClick={() => setConfirmDialog({ type: 'approve', listingId: listing.id })}
                      >
                        <Eye size={14} className="mr-1" />
                        Xem chi tiết
                      </Button>
                      {statusFilter === 'pending' && (
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-2"
                          onClick={() =>
                            setConfirmDialog({ type: 'approve', listingId: listing.id })
                          }
                        >
                          Duyệt
                        </Button>
                      )}
                      {statusFilter !== 'deleted' && (
                        <Button
                          size="sm"
                          className="bg-pink-200 text-pink-700 hover:bg-pink-300 text-xs font-medium px-2"
                          onClick={() =>
                            setConfirmDialog({ type: 'delete', listingId: listing.id })
                          }
                        >
                          <Trash2 size={14} className="mr-1" />
                          Xóa
                        </Button>
                      )}
                      {statusFilter === 'deleted' && (
                        <span className="text-xs text-muted-foreground">
                          Đã xóa
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialogs */}
      <AlertDialog
        open={confirmDialog.type === 'approve'}
        onOpenChange={(open) => {
          if (!open) setConfirmDialog({ type: null })
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duyệt tin đăng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn duyệt{' '}
              {confirmDialog.listingId ? 'tin này' : 'tất cả các tin đã chọn'}
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel onClick={() => setConfirmDialog({ type: null })}>
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                handleApprove(confirmDialog.listingId)
              }
              className="bg-green-500 hover:bg-green-600"
            >
              Duyệt
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={confirmDialog.type === 'delete'}
        onOpenChange={(open) => {
          if (!open) setConfirmDialog({ type: null })
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa tin đăng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tin này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel onClick={() => setConfirmDialog({ type: null })}>
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                handleDelete(confirmDialog.listingId || '')
              }
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
