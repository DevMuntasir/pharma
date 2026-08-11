// ─────────────────────────────────────────────────────────
// CHART SYSTEM: Shared config, wrappers
// Consistent Recharts-based chart components
// ─────────────────────────────────────────────────────────

import type { ReactNode } from 'react'
import {
  ResponsiveContainer,
  LineChart as RechartsLine,
  AreaChart as RechartsArea,
  BarChart as RechartsBar,
  ComposedChart as RechartsComposed,
  PieChart,
  Pie,
  Cell,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { cn, formatNumber } from '@/utils'
import { EmptyState } from '@/components/feedback'

import { Download } from 'lucide-react'
import { CHART_COLORS, getChartStyles } from './chartConstants'
import { useUIStore } from '@/store/useUIStore'
export { CHART_COLORS, getChartStyles }

// ── ChartCard wrapper ─────────────────────────────────────

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  height?: number
  actions?: ReactNode
  loading?: boolean
  empty?: boolean
  className?: string
  badge?: ReactNode
  onExportCsv?: () => void
}

export function ChartCard({
  title,
  subtitle,
  children,
  height = 280,
  actions,
  loading = false,
  empty = false,
  className,
  badge,
  onExportCsv,
}: ChartCardProps) {
  return (
    <div className={cn('card', className)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="section-title">{title}</h3>
            {badge}
          </div>
          {subtitle && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {onExportCsv && (
            <button
              className="btn btn-ghost btn-sm p-1 text-xs"
              onClick={onExportCsv}
              title="Export Chart Data as CSV"
            >
              <Download className="w-3.5 h-3.5 text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)]" />
            </button>
          )}
          {actions}
        </div>
      </div>
      {loading ? (
        <div className="skeleton rounded" style={{ height }} />
      ) : empty ? (
        <EmptyState className="py-6" />
      ) : (
        <div style={{ height }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ── Custom tooltip ────────────────────────────────────────

interface TooltipPayloadItem {
  color?: string
  name?: string
  value?: number | string
}

interface CustomTooltipComponentProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
  formatter?: (value: number) => string
}

function CustomTooltip({ active, payload, label, formatter }: CustomTooltipComponentProps) {
  const { theme } = useUIStore()
  const styles = getChartStyles(theme)
  if (!active || !payload?.length) return null
  return (
    <div style={styles.tooltip.contentStyle}>
      <p style={{ ...styles.tooltip.labelStyle, marginBottom: 6 }}>{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span style={styles.tooltip.itemStyle}>
            {entry.name}: <strong>{formatter && typeof entry.value === 'number' ? formatter(entry.value) : formatNumber(Number(entry.value ?? 0))}</strong>
          </span>
        </div>
      ))}
    </div>
  )
}

// ── LineChart wrapper ─────────────────────────────────────

interface ChartDataPoint {
  [key: string]: string | number
}

interface LineChartProps {
  data: ChartDataPoint[]
  lines: Array<{ key: string; label: string; color?: string }>
  xKey?: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  formatter?: (v: number) => string
}

export function LineChart({
  data,
  lines,
  xKey = 'label',
  height = 260,
  showGrid = true,
  showLegend = true,
  formatter,
}: LineChartProps) {
  const { theme } = useUIStore()
  const styles = getChartStyles(theme)
  const legendColor = theme === 'light' ? '#334155' : '#8da3bf'
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLine data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        {showGrid && <CartesianGrid {...styles.grid} vertical={false} />}
        <XAxis dataKey={xKey} {...styles.axis} />
        <YAxis {...styles.axis} width={48} />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        {showLegend && (
          <Legend wrapperStyle={{ fontSize: 11, color: legendColor, paddingTop: 12 }} />
        )}
        {lines.map((line, i) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.label}
            stroke={line.color ?? CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </RechartsLine>
    </ResponsiveContainer>
  )
}

// ── AreaChart wrapper ─────────────────────────────────────

interface AreaChartProps {
  data: ChartDataPoint[]
  areas: Array<{ key: string; label: string; color?: string }>
  xKey?: string
  height?: number
  showGrid?: boolean
  stacked?: boolean
  formatter?: (v: number) => string
}

export function AreaChart({
  data,
  areas,
  xKey = 'label',
  height = 260,
  showGrid = true,
  stacked = false,
  formatter,
}: AreaChartProps) {
  const { theme } = useUIStore()
  const styles = getChartStyles(theme)
  const legendColor = theme === 'light' ? '#334155' : '#8da3bf'
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsArea data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        {showGrid && <CartesianGrid {...styles.grid} vertical={false} />}
        <XAxis dataKey={xKey} {...styles.axis} />
        <YAxis {...styles.axis} width={48} />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Legend wrapperStyle={{ fontSize: 11, color: legendColor, paddingTop: 12 }} />
        {areas.map((area, i) => {
          const color = area.color ?? CHART_COLORS[i % CHART_COLORS.length]
          return (
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              name={area.label}
              stroke={color}
              fill={color}
              fillOpacity={0.12}
              strokeWidth={2}
              stackId={stacked ? 'stack' : undefined}
            />
          )
        })}
      </RechartsArea>
    </ResponsiveContainer>
  )
}

// ── BarChart wrapper ──────────────────────────────────────

interface BarChartProps {
  data: ChartDataPoint[]
  bars: Array<{ key: string; label: string; color?: string }>
  xKey?: string
  height?: number
  showGrid?: boolean
  stacked?: boolean
  formatter?: (v: number) => string
}

export function BarChart({
  data,
  bars,
  xKey = 'label',
  height = 260,
  showGrid = true,
  stacked = false,
  formatter,
}: BarChartProps) {
  const { theme } = useUIStore()
  const styles = getChartStyles(theme)
  const legendColor = theme === 'light' ? '#334155' : '#8da3bf'
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBar data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        {showGrid && <CartesianGrid {...styles.grid} vertical={false} />}
        <XAxis dataKey={xKey} {...styles.axis} />
        <YAxis {...styles.axis} width={48} />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Legend wrapperStyle={{ fontSize: 11, color: legendColor, paddingTop: 12 }} />
        {bars.map((bar, i) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.label}
            fill={bar.color ?? CHART_COLORS[i % CHART_COLORS.length]}
            radius={[2, 2, 0, 0]}
            stackId={stacked ? 'stack' : undefined}
            maxBarSize={40}
          />
        ))}
      </RechartsBar>
    </ResponsiveContainer>
  )
}

// ── HorizontalBarChart ────────────────────────────────────

interface HorizontalBarChartProps {
  data: Array<{ label: string; value: number; color?: string }>
  height?: number
  formatter?: (v: number) => string
}

export function HorizontalBarChart({
  data,
  height = 260,
  formatter,
}: HorizontalBarChartProps) {
  const { theme } = useUIStore()
  const styles = getChartStyles(theme)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBar
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 32, left: 8, bottom: 0 }}
      >
        <CartesianGrid {...styles.grid} horizontal={false} />
        <XAxis type="number" {...styles.axis} width={48} />
        <YAxis type="category" dataKey="label" {...styles.axis} width={120} tick={{ ...styles.axis.tick, textAnchor: 'end' }} />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Bar dataKey="value" radius={[0, 2, 2, 0]} maxBarSize={24}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color ?? CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </RechartsBar>
    </ResponsiveContainer>
  )
}

// ── DonutChart ────────────────────────────────────────────

interface DonutChartProps {
  data: Array<{ label: string; value: number; color?: string }>
  height?: number
  innerRadius?: number
  outerRadius?: number
  centerLabel?: string
  centerValue?: string
}

export function DonutChart({
  data,
  height = 260,
  innerRadius = 60,
  outerRadius = 90,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const { theme } = useUIStore()
  const styles = getChartStyles(theme)
  const legendColor = theme === 'light' ? '#334155' : '#8da3bf'
  const centerValueColor = theme === 'light' ? '#0f172a' : '#f0f4f8'
  const centerLabelColor = theme === 'light' ? '#64748b' : '#4d6480'
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="value"
          nameKey="label"
          paddingAngle={2}
        >
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.color ?? CHART_COLORS[i % CHART_COLORS.length]}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [formatNumber(Number(value)), '']}
          contentStyle={styles.tooltip.contentStyle}
          itemStyle={styles.tooltip.itemStyle}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: legendColor, fontSize: 11 }}>{value}</span>
          )}
        />
        {centerLabel && centerValue && (
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
            <tspan x="50%" dy="-6" fontSize={18} fontWeight={700} fill={centerValueColor} fontFamily="JetBrains Mono, monospace">
              {centerValue}
            </tspan>
            <tspan x="50%" dy="18" fontSize={10} fill={centerLabelColor} fontFamily="Inter, sans-serif">
              {centerLabel}
            </tspan>
          </text>
        )}
      </PieChart>
    </ResponsiveContainer>
  )
}

// ── Sparkline ─────────────────────────────────────────────

interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  width?: number
}

export function Sparkline({ data, color = '#3b82f6', height = 32, width = 80 }: SparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }))
  return (
    <ResponsiveContainer width={width} height={height}>
      <RechartsLine data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
        />
      </RechartsLine>
    </ResponsiveContainer>
  )
}

// ── ComposedChart ─────────────────────────────────────────

interface ComposedChartProps {
  data: ChartDataPoint[]
  bars?: Array<{ key: string; label: string; color?: string }>
  lines?: Array<{ key: string; label: string; color?: string }>
  xKey?: string
  height?: number
  formatter?: (v: number) => string
}

export function ComposedChart({
  data,
  bars = [],
  lines = [],
  xKey = 'label',
  height = 260,
  formatter,
}: ComposedChartProps) {
  const { theme } = useUIStore()
  const styles = getChartStyles(theme)
  const legendColor = theme === 'light' ? '#334155' : '#8da3bf'
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsComposed data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid {...styles.grid} vertical={false} />
        <XAxis dataKey={xKey} {...styles.axis} />
        <YAxis {...styles.axis} width={48} />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Legend wrapperStyle={{ fontSize: 11, color: legendColor, paddingTop: 12 }} />
        {bars.map((bar, i) => (
          <Bar key={bar.key} dataKey={bar.key} name={bar.label} fill={bar.color ?? CHART_COLORS[i % CHART_COLORS.length]} radius={[2, 2, 0, 0]} maxBarSize={40} />
        ))}
        {lines.map((line, i) => (
          <Line key={line.key} type="monotone" dataKey={line.key} name={line.label} stroke={line.color ?? CHART_COLORS[(i + bars.length) % CHART_COLORS.length]} strokeWidth={2} dot={false} />
        ))}
      </RechartsComposed>
    </ResponsiveContainer>
  )
}
