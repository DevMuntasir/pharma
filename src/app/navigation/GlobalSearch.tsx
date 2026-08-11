// ─────────────────────────────────────────────────────────
// COMPONENT: GlobalSearch
// Searches mock entities, shows grouped results
// ─────────────────────────────────────────────────────────

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { doctors } from '@/data/seed/doctors'
import { brands } from '@/data/seed/brands'
import { molecules } from '@/data/seed/therapeutics'
import { diseases } from '@/data/seed/therapeutics'
import { territories } from '@/data/seed/geography'
import { cn, truncate } from '@/utils'

interface SearchResult {
  id: string
  label: string
  sublabel?: string
  group: string
  path?: string
}

function searchAll(query: string): SearchResult[] {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  const results: SearchResult[] = []

  // Doctors
  doctors
    .filter((d) => d.name.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach((d) => {
      results.push({ id: d.id, label: d.name, sublabel: d.degree, group: 'Doctors', path: `/doctors/${d.id}` })
    })

  // Brands
  brands
    .filter((b) => b.name.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach((b) => {
      results.push({ id: b.id, label: b.name, sublabel: b.strength, group: 'Brands', path: '/products/brands' })
    })

  // Molecules
  molecules
    .filter((m) => m.name.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach((m) => {
      results.push({ id: m.id, label: m.name, sublabel: m.genericName, group: 'Molecules', path: '/products/molecules' })
    })

  // Diseases
  diseases
    .filter((d) => d.name.toLowerCase().includes(q))
    .slice(0, 2)
    .forEach((d) => {
      results.push({ id: d.id, label: d.name, sublabel: `ICD: ${d.icdCode}`, group: 'Diseases', path: '/prescriptions/disease' })
    })

  // Territories
  territories
    .filter((t) => t.name.toLowerCase().includes(q) || t.division.toLowerCase().includes(q))
    .slice(0, 2)
    .forEach((t) => {
      results.push({ id: t.id, label: t.name, sublabel: t.division, group: 'Territories', path: '/territories' })
    })

  return results
}

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const results = searchAll(query)
  const groups = [...new Set(results.map((r) => r.group))]

  const handleSelect = (result: SearchResult) => {
    if (result.path) navigate(result.path)
    setQuery('')
    setOpen(false)
    setSelected(-1)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelected((s) => Math.min(s + 1, results.length - 1))
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      setSelected((s) => Math.max(s - 1, -1))
      e.preventDefault()
    } else if (e.key === 'Enter' && selected >= 0) {
      handleSelect(results[selected])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  useEffect(() => {
    setOpen(query.length >= 2)
    setSelected(-1)
  }, [query])

  // Global keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.closest('[data-search-container]')?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative flex-1 max-w-sm" data-search-container="" id="global-search-container">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
        <input
          ref={inputRef}
          id="global-search-input"
          type="search"
          placeholder="Search doctors, brands... (Ctrl+K)"
          className="input pl-8 pr-12 text-xs h-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setOpen(true)}
          aria-label="Global search"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] border border-[var(--color-border-strong)] rounded pointer-events-none">
          Ctrl K
        </kbd>
        {query && (
          <button
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus() }}
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 card p-0 overflow-hidden shadow-xl z-50"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
          role="listbox"
          aria-label="Search results"
        >
          {groups.map((group) => (
            <div key={group}>
              <div className="px-3 py-1.5 text-2xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] bg-[var(--color-bg-base)]">
                {group}
              </div>
              {results
                .filter((r) => r.group === group)
                .map((result) => {
                  const globalIdx = results.indexOf(result)
                  return (
                    <button
                      key={result.id}
                      className={cn(
                        'w-full text-left px-3 py-2 text-xs hover:bg-[var(--color-bg-hover)] transition-colors',
                        selected === globalIdx && 'bg-[var(--color-bg-hover)]'
                      )}
                      onClick={() => handleSelect(result)}
                      role="option"
                      aria-selected={selected === globalIdx}
                    >
                      <span className="text-[var(--color-text-primary)] font-medium">
                        {truncate(result.label, 40)}
                      </span>
                      {result.sublabel && (
                        <span className="text-[var(--color-text-muted)] ml-2">{result.sublabel}</span>
                      )}
                    </button>
                  )
                })}
            </div>
          ))}
        </div>
      )}

      {open && results.length === 0 && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 card py-6 text-center text-xs text-[var(--color-text-muted)]">
          No results for "{truncate(query, 30)}"
        </div>
      )}
    </div>
  )
}
