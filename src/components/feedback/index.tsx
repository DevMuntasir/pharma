// ─────────────────────────────────────────────────────────
// COMPONENT: Feedback primitives
// LoadingState, Skeleton, EmptyState, ErrorState
// ─────────────────────────────────────────────────────────

import type { ReactNode } from 'react'
import { AlertCircle, Inbox, Loader2 } from 'lucide-react'
import { cn } from '@/utils'

// ── Skeleton ──────────────────────────────────────────────

interface SkeletonProps {
  className?: string
  height?: string | number
  width?: string | number
  rounded?: boolean
}

export function Skeleton({ className, height, width, rounded = false }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', rounded && 'rounded-full', className)}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
      }}
    />
  )
}

// ── Loading state ──────────────────────────────────────────

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ message = 'Loading data…', className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[200px] gap-3', className)}>
      <Loader2 className="w-6 h-6 animate-spin text-[var(--color-accent-primary)]" />
      <p className="text-sm text-[var(--color-text-muted)]">{message}</p>
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title = 'No data available',
  description = 'No records match the current filters.',
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[200px] gap-3 p-6 text-center', className)}>
      <div className="w-10 h-10 flex items-center justify-center text-[var(--color-text-disabled)]">
        {icon ?? <Inbox className="w-10 h-10" />}
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{title}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
      </div>
      {action}
    </div>
  )
}

// ── Error state ────────────────────────────────────────────

interface ErrorStateProps {
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading data.',
  action,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[200px] gap-3 p-6 text-center', className)}>
      <AlertCircle className="w-10 h-10 text-[var(--color-text-danger)]" />
      <div>
        <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{title}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
      </div>
      {action}
    </div>
  )
}
