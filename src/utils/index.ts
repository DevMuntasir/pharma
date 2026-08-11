// ─────────────────────────────────────────────────────────
// UTILITY: className merger
// ─────────────────────────────────────────────────────────

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ── Number formatters ─────────────────────────────────────

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? '' : ''}${value.toFixed(decimals)}%`
}

export function formatCurrency(value: number, currency = 'BDT'): string {
  const symbol = currency === 'BDT' ? '৳' : `${currency} `
  if (value >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${symbol}${(value / 1_000).toFixed(1)}K`
  return `${symbol}${value.toFixed(0)}`
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toString()
}

// ── Growth direction ──────────────────────────────────────

export function growthClass(value: number): string {
  if (value > 0) return 'trend-up'
  if (value < 0) return 'trend-down'
  return 'trend-flat'
}

export function growthSign(value: number): string {
  return value >= 0 ? '+' : ''
}

// ── Date formatters ───────────────────────────────────────

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatMonthYear(year: number, month: number): string {
  const d = new Date(year, month - 1, 1)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export function getQuarterLabel(year: number, quarter: 1 | 2 | 3 | 4): string {
  return `Q${quarter} ${year}`
}

// ── String helpers ────────────────────────────────────────

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}…`
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
