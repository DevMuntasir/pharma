// ─────────────────────────────────────────────────────────
// CHART CONSTANTS
// ─────────────────────────────────────────────────────────

export const CHART_COLORS = [
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#84cc16', // lime
  '#14b8a6', // teal
  '#f97316', // orange
]

type Theme = 'dark' | 'light'

const DARK_CHART_STYLES = {
  grid: { stroke: '#1e2d45', strokeDasharray: '3 3' },
  axis: { stroke: '#4d6480', tick: { fill: '#4d6480', fontSize: 11, fontFamily: 'Inter' } },
  tooltip: {
    contentStyle: {
      backgroundColor: '#1a2235',
      border: '1px solid #1e2d45',
      borderRadius: 6,
      fontSize: 12,
      fontFamily: 'Inter',
    },
    labelStyle: { color: '#8da3bf', fontWeight: 600 },
    itemStyle: { color: '#f0f4f8' },
  },
}

const LIGHT_CHART_STYLES = {
  grid: { stroke: '#d1dde8', strokeDasharray: '3 3' },
  axis: { stroke: '#94a3b8', tick: { fill: '#64748b', fontSize: 11, fontFamily: 'Inter' } },
  tooltip: {
    contentStyle: {
      backgroundColor: '#ffffff',
      border: '1px solid #d1dde8',
      borderRadius: 6,
      fontSize: 12,
      fontFamily: 'Inter',
    },
    labelStyle: { color: '#334155', fontWeight: 600 },
    itemStyle: { color: '#0f172a' },
  },
}

/** Returns chart style tokens for the given theme. */
export function getChartStyles(theme: Theme = 'dark') {
  return theme === 'light' ? LIGHT_CHART_STYLES : DARK_CHART_STYLES
}

/** @deprecated Use getChartStyles(theme) instead */
export const CHART_STYLES = DARK_CHART_STYLES
