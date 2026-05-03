'use client'

import { useState } from 'react'
import { DataTable, Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye, CheckCircle, XCircle } from 'lucide-react'

interface Report {
  id: string
  reportedId: string
  reportedName: string
  reportedType: 'listing' | 'user' | 'landlord'
  reporterName: string
  violationType: string
  description: string
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  reportedDate: string
  resolvedDate?: string
  resolvedBy?: string
  notes?: string
}

// Mock reports data
const mockReports: Report[] = [
  {
    id: 'RPT-001',
    reportedId: 'LST-042',
    reportedName: 'Luxury Studio Downtown',
    reportedType: 'listing',
    reporterName: 'John Smith',
    violationType: 'Fraudulent Content',
    description: 'Photos appear to be from a different property than described. Price is suspiciously low.',
    status: 'investigating',
    priority: 'high',
    reportedDate: '2024-04-28',
  },
  {
    id: 'RPT-002',
    reportedId: 'LL-015',
    reportedName: 'Tech Properties LLC',
    reportedType: 'landlord',
    reporterName: 'Sarah Johnson',
    violationType: 'Harassment',
    description: 'Multiple tenants reporting aggressive behavior and threats from landlord',
    status: 'investigating',
    priority: 'critical',
    reportedDate: '2024-04-27',
  },
  {
    id: 'RPT-003',
    reportedId: 'USR-089',
    reportedName: 'Alice Chen',
    reportedType: 'user',
    reporterName: 'Property Owner',
    violationType: 'Spam/Abuse',
    description: 'User sending multiple suspicious contact requests to different properties',
    status: 'pending',
    priority: 'medium',
    reportedDate: '2024-04-26',
  },
  {
    id: 'RPT-004',
    reportedId: 'LST-085',
    reportedName: 'Beachfront Condo',
    reportedType: 'listing',
    reporterName: 'Admin Review',
    violationType: 'Illegal Content',
    description: 'Listing contains explicit/adult content and inappropriate images',
    status: 'resolved',
    priority: 'critical',
    reportedDate: '2024-04-25',
    resolvedDate: '2024-04-26',
    resolvedBy: 'Admin',
    notes: 'Listing removed and user suspended',
  },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const columns: Column<Report>[] = [
    {
      header: 'ID',
      accessor: 'id',
      sortable: true,
      className: 'w-24',
    },
    {
      header: 'Mục bị báo cáo',
      accessor: 'reportedName',
      sortable: true,
    },
    {
      header: 'Loại',
      accessor: 'reportedType',
      render: (value) => {
        const typeLabel = value === 'listing' ? 'Tin đăng' : value === 'user' ? 'Người dùng' : 'Chủ nhà'
        return <StatusBadge status={value} variant="info" />
      },
      sortable: true,
    },
    {
      header: 'Vi phạm',
      accessor: 'violationType',
      sortable: true,
    },
    {
      header: 'Mức độ',
      accessor: 'priority',
      render: (value) => {
        const variantMap = {
          critical: 'error',
          high: 'warning',
          medium: 'warning',
          low: 'info',
        } as const
        return <StatusBadge status={value} variant={variantMap[value as keyof typeof variantMap]} />
      },
      sortable: true,
    },
    {
      header: 'Tình trạng',
      accessor: 'status',
      render: (value) => {
        const variantMap = {
          pending: 'warning',
          investigating: 'info',
          resolved: 'success',
          dismissed: 'default',
        } as const
        return <StatusBadge status={value} variant={variantMap[value as keyof typeof variantMap]} />
      },
      sortable: true,
    },
    {
      header: 'Ngày báo cáo',
      accessor: 'reportedDate',
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
  ]

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report)
    setIsModalOpen(true)
  }

  const handleResolve = (report: Report) => {
    console.log('Resolving report:', report.id)
    // TODO: Call API to mark report as resolved
  }

  const handleDismiss = (report: Report) => {
    console.log('Dismissing report:', report.id)
    // TODO: Call API to dismiss report
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Báo cáo vi phạm</h1>
        <p className="mt-1 text-muted-foreground">Duyệt và xử lý báo cáo về spam, gian lận, lạm dụng và vi phạm</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Đang chờ</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {mockReports.filter((r) => r.status === 'pending').length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Đang điều tra</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {mockReports.filter((r) => r.status === 'investigating').length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Ưu tiên cao</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {mockReports.filter((r) => r.priority === 'critical').length}
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border border-border bg-card p-6">
        <DataTable<Report>
          data={mockReports}
          columns={columns}
          searchPlaceholder="Tìm báo cáo theo ID hoặc tên mục..."
          searchableFields={['id', 'reportedName', 'violationType', 'reporterName']}
          onRowClick={handleViewDetails}
          actions={(report) => (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewDetails(report)}
                className="text-muted-foreground hover:text-foreground"
                title="Xem chi tiết"
              >
                <Eye size={16} />
              </Button>
              {report.status !== 'resolved' && report.status !== 'dismissed' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResolve(report)}
                    className="text-green-600 hover:text-green-700"
                    title="Đánh dấu đã xử lý"
                  >
                    <CheckCircle size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(report)}
                    className="text-orange-600 hover:text-orange-700"
                    title="Bỏ qua"
                  >
                    <XCircle size={16} />
                  </Button>
                </>
              )}
            </div>
          )}
        />
      </div>

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết báo cáo vi phạm</DialogTitle>
            <DialogDescription>Xem và xử lý các báo cáo vi phạm</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Report Information */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Thông tin báo cáo</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mã báo cáo</p>
                    <p className="text-foreground font-semibold">{selectedReport.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ngày báo cáo</p>
                    <p className="text-foreground">{new Date(selectedReport.reportedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Người báo cáo</p>
                    <p className="text-foreground">{selectedReport.reporterName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Loại báo cáo</p>
                    <p className="text-foreground">{selectedReport.reportedType === 'listing' ? 'Tin đăng' : selectedReport.reportedType === 'user' ? 'Người dùng' : 'Chủ nhà'}</p>
                  </div>
                </div>
              </div>

              {/* Reported Item */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Mục bị báo cáo</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mã mục</p>
                    <p className="text-foreground">{selectedReport.reportedId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tên mục</p>
                    <p className="text-foreground">{selectedReport.reportedName}</p>
                  </div>
                </div>
              </div>

              {/* Violation Details */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Chi tiết vi phạm</h3>
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Loại vi phạm</p>
                    <p className="text-foreground font-semibold">{selectedReport.violationType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
                    <p className="text-foreground whitespace-pre-wrap">{selectedReport.description}</p>
                  </div>
                </div>
              </div>

              {/* Status & Priority */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Tình trạng & Mức độ</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tình trạng</p>
                    <div className="mt-1">
                      <StatusBadge
                        status={selectedReport.status}
                        variant={
                          selectedReport.status === 'resolved'
                            ? 'success'
                            : selectedReport.status === 'investigating'
                              ? 'info'
                              : selectedReport.status === 'dismissed'
                                ? 'default'
                                : 'warning'
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mức độ</p>
                    <div className="mt-1">
                      <StatusBadge
                        status={selectedReport.priority}
                        variant={
                          selectedReport.priority === 'critical'
                            ? 'error'
                            : selectedReport.priority === 'high'
                              ? 'warning'
                              : selectedReport.priority === 'medium'
                                ? 'warning'
                                : 'info'
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Resolution Information */}
              {selectedReport.resolvedDate && (
                <div>
                  <h3 className="mb-3 font-semibold text-foreground">Thông tin xử lý</h3>
                  <div className="grid gap-4">
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Ngày xử lý</p>
                      <p className="text-foreground">{new Date(selectedReport.resolvedDate).toLocaleDateString()}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Người xử lý</p>
                      <p className="text-foreground">{selectedReport.resolvedBy || 'N/A'}</p>
                    </div>
                    {selectedReport.notes && (
                      <div className="sm:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Ghi chú</p>
                        <p className="text-foreground whitespace-pre-wrap">{selectedReport.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedReport.status !== 'resolved' && selectedReport.status !== 'dismissed' && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleResolve(selectedReport)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Đánh dấu đã xử lý
                  </Button>
                  <Button
                    onClick={() => handleDismiss(selectedReport)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    <XCircle size={16} className="mr-2" />
                    Bỏ qua báo cáo
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
