// ─────────────────────────────────────────────────────────
// COMPONENT: DataTable (Enhanced with CSV Export & Quick Search)
// Reusable table with sorting, pagination, search, CSV export
// ─────────────────────────────────────────────────────────

import { useState, useMemo, type ReactNode } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Download, Search } from 'lucide-react'
import { cn } from '@/utils'
import { EmptyState, Skeleton } from '@/components/feedback'

export interface ColumnDef<T> {
  key: string
  header: string
  accessor: (row: T) => ReactNode
  sortAccessor?: (row: T) => string | number
  rawAccessor?: (row: T) => string | number
  width?: string
  align?: 'left' | 'right' | 'center'
  className?: string
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  onRowClick?: (row: T) => void
  pageSize?: number
  className?: string
  caption?: string
  stickyHeader?: boolean
  enableSearch?: boolean
  enableExport?: boolean
}

type SortDir = 'asc' | 'desc' | null

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyTitle,
  emptyDescription,
  onRowClick,
  pageSize = 20,
  className,
  caption,
  stickyHeader = false,
  enableSearch = true,
  enableExport = true,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  // ── Quick Search Filter ─────────────────────────────
  const searchedData = useMemo(() => {
    if (!searchQuery.trim()) return data
    const q = searchQuery.toLowerCase()
    return data.filter((row) => {
      return columns.some((col) => {
        if (col.sortAccessor) {
          const val = String(col.sortAccessor(row)).toLowerCase()
          if (val.includes(q)) return true
        }
        if (col.rawAccessor) {
          const val = String(col.rawAccessor(row)).toLowerCase()
          if (val.includes(q)) return true
        }
        return false
      })
    })
  }, [data, searchQuery, columns])

  // ── Sort ───────────────────────────────────────────
  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return searchedData
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.sortAccessor) return searchedData
    return [...searchedData].sort((a, b) => {
      const aVal = col.sortAccessor!(a)
      const bVal = col.sortAccessor!(b)
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [searchedData, sortKey, sortDir, columns])

  // ── Paginate ───────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageData = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)

  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key)
      setSortDir('asc')
    } else if (sortDir === 'asc') {
      setSortDir('desc')
    } else {
      setSortKey(null)
      setSortDir(null)
    }
  }

  // ── CSV Export Handler ─────────────────────────────
  const handleExportCSV = () => {
    const headers = columns.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(',')
    const rows = sorted.map((row) => {
      return columns.map((col) => {
        let val = ''
        if (col.rawAccessor) {
          val = String(col.rawAccessor(row))
        } else if (col.sortAccessor) {
          val = String(col.sortAccessor(row))
        }
        return `"${val.replace(/"/g, '""')}"`
      }).join(',')
    })

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `pharma_export_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown className="w-3 h-3 opacity-40" />
    if (sortDir === 'asc') return <ChevronUp className="w-3 h-3" />
    return <ChevronDown className="w-3 h-3" />
  }

  if (loading) {
    return (
      <div className={cn('overflow-x-auto', className)}>
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    <Skeleton height={14} width="80%" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Table Toolbar */}
      {(enableSearch || enableExport) && (
        <div className="flex items-center justify-between gap-3 mb-2 px-1">
          {enableSearch ? (
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Filter table rows..."
                className="input text-2xs pl-7 h-7"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
              />
            </div>
          ) : <div />}

          {enableExport && (
            <button
              className="btn btn-secondary btn-sm text-2xs h-7 py-0"
              onClick={handleExportCSV}
              title="Download table data as CSV file"
            >
              <Download className="w-3 h-3 text-[var(--color-accent-primary)]" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      )}

      {/* Table Content */}
      {sorted.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table">
            {caption && <caption className="sr-only">{caption}</caption>}
            <thead className={stickyHeader ? 'sticky top-0 z-10' : undefined}>
              <tr>
                {columns.map((col) => {
                  const sortable = !!col.sortAccessor
                  return (
                    <th
                      key={col.key}
                      className={cn(sortable && 'sortable', col.className)}
                      style={{ width: col.width, textAlign: col.align ?? 'left' }}
                      onClick={sortable ? () => handleSort(col.key) : undefined}
                      aria-sort={
                        sortKey === col.key
                          ? sortDir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : undefined
                      }
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.header}
                        {sortable && <SortIcon colKey={col.key} />}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? 'cursor-pointer' : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={col.className}
                      style={{ textAlign: col.align ?? 'left' }}
                    >
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] mt-1">
          <span className="text-xs text-[var(--color-text-muted)]">
            Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sorted.length)} of {sorted.length.toLocaleString()} rows
          </span>
          <div className="flex items-center gap-1">
            <button
              className="btn btn-ghost btn-sm"
              disabled={safePage === 1}
              onClick={() => setPage(safePage - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-[var(--color-text-secondary)] px-2">
              {safePage} / {totalPages}
            </span>
            <button
              className="btn btn-ghost btn-sm"
              disabled={safePage === totalPages}
              onClick={() => setPage(safePage + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
