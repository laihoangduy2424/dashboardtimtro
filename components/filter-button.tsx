import { cn } from '@/lib/utils'

interface FilterButtonProps {
  label: string
  count?: number
  isActive: boolean
  onClick: () => void
  className?: string
}

export function FilterButton({ label, count, isActive, onClick, className }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground border-primary'
          : 'border-border bg-card hover:border-primary/50 text-foreground',
        className
      )}
    >
      {label}
      {count !== undefined && ` (${count})`}
    </button>
  )
}
