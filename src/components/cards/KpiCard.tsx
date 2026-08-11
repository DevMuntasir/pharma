// ─────────────────────────────────────────────────────────
// COMPONENT: KpiCard
// Displays a single KPI metric with trend indicator.
// ─────────────────────────────────────────────────────────

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn, formatNumber, formatPercent, growthSign } from '@/utils'

interface KpiCardProps {
  title: string
  value: string | number
  unit?: string
  change?: number // percentage change
  changeLabel?: string
  subtitle?: string
  accent?: 'blue' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet'
  loading?: boolean
  className?: string
}

const accentColors = {
  blue:    { border: 'border-l-[var(--color-accent-primary)]',    text: 'text-[var(--color-accent-primary)]' },
  cyan:    { border: 'border-l-[var(--color-accent-secondary)]',  text: 'text-[var(--color-accent-secondary)]' },
  emerald: { border: 'border-l-[var(--color-accent-emerald)]',    text: 'text-[var(--color-accent-emerald)]' },
  amber:   { border: 'border-l-[var(--color-accent-amber)]',      text: 'text-[var(--color-accent-amber)]' },
  rose:    { border: 'border-l-[var(--color-accent-rose)]',       text: 'text-[var(--color-accent-rose)]' },
  violet:  { border: 'border-l-[var(--color-accent-violet)]',     text: 'text-[var(--color-accent-violet)]' },
}

export function KpiCard({
  title,
  value,
  unit,
  change,
  changeLabel = 'vs prev period',
  subtitle,
  accent = 'blue',
  loading = false,
  className,
}: KpiCardProps) {
  const colors = accentColors[accent]
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  if (loading) {
    return (
      <div className={cn('kpi-card border-l-4', colors.border, className)}>
        <div className="skeleton h-3 w-24 mb-3" />
        <div className="skeleton h-8 w-20 mb-2" />
        <div className="skeleton h-3 w-16" />
      </div>
    )
  }

  return (
    <div className={cn('kpi-card border-l-4', colors.border, className)}>
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
        {title}
      </p>
      <div className="flex items-end gap-1.5 mb-1.5">
        <span className="font-data text-2xl font-bold text-[var(--color-text-primary)] leading-none">
          {typeof value === 'number' ? formatNumber(value) : value}
        </span>
        {unit && (
          <span className={cn('text-sm font-medium mb-0.5', colors.text)}>
            {unit}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-[var(--color-text-muted)] mb-1.5">{subtitle}</p>
      )}
      {change !== undefined && (
        <div className="flex items-center gap-1">
          {isPositive && <TrendingUp className="w-3 h-3 trend-up" />}
          {isNegative && <TrendingDown className="w-3 h-3 trend-down" />}
          {!isPositive && !isNegative && <Minus className="w-3 h-3 trend-flat" />}
          <span
            className={cn(
              'text-xs font-medium font-data',
              isPositive ? 'trend-up' : isNegative ? 'trend-down' : 'trend-flat'
            )}
          >
            {growthSign(change)}{formatPercent(change)}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">{changeLabel}</span>
        </div>
      )}
    </div>
  )
}
