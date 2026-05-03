'use client'

interface StatusBadgeProps {
  status: string
  variant?: 'success' | 'warning' | 'error' | 'info'
}

export function StatusBadge({ status, variant = 'info' }: StatusBadgeProps) {
  const variantStyles = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  }
  const translations: Record<string, string> = {
    active: 'Hoạt động',
    expired: 'Hết hạn',
    suspended: 'Bị khoá',
    displaying: 'Đang hiển thị',
    pending_review: 'Chờ duyệt',
    available: 'Có sẵn',
    rented: 'Đã cho thuê',
    approved: 'Đã duyệt',
    rejected: 'Bị từ chối',
    pending: 'Chờ xử lý',
    investigating: 'Đang điều tra',
    resolved: 'Đã xử lý',
    dismissed: 'Bỏ qua',
    listing: 'Tin đăng',
    user: 'Người dùng',
    landlord: 'Chủ nhà',
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao',
    critical: 'Rất cao',
  }

  const key = String(status ?? '')
  const normalized = key.trim()
  const label = translations[normalized] ?? normalized.replace(/_/g, ' ')

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}>
      {label}
    </span>
  )
}
