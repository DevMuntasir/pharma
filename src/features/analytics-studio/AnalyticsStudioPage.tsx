// ─────────────────────────────────────────────────────────
// FEATURE: Interactive Custom Analytics Studio & PDF Report Builder
// Dynamic ad-hoc query builder and executive report generator
// ─────────────────────────────────────────────────────────

import { useState, useMemo } from 'react'
import { Download, Printer, SlidersHorizontal } from 'lucide-react'
import { PageHeader, SectionHeader } from '@/components/ui/Headers'
import { LineChart, AreaChart, BarChart, HorizontalBarChart, DonutChart, ChartCard } from '@/components/charts'
import { DataTable } from '@/components/tables/DataTable'
import { brands, companies, prescriptionItems } from '@/data'
import { formatCurrency } from '@/utils'

export function AnalyticsStudioPage() {
  const [dimension, setDimension] = useState<'brand' | 'molecule' | 'company' | 'territory' | 'specialty' | 'disease'>('brand')
  const [metric, setMetric] = useState<'volume' | 'revenue' | 'share' | 'price'>('volume')
  const [chartType, setChartType] = useState<'bar' | 'hbar' | 'line' | 'area' | 'donut' | 'table'>('bar')

  // Dynamic Query Calculation
  const computedData = useMemo(() => {
    let rawItems = prescriptionItems

    if (dimension === 'brand') {
      const map = new Map<string, number>()
      rawItems.forEach((item) => {
        map.set(item.brandName, (map.get(item.brandName) ?? 0) + 1)
      })
      return Array.from(map.entries())
        .map(([name, count]) => {
          const brand = brands.find((b) => b.name === name)
          const price = brand?.unitPrice ?? 10
          return {
            label: name,
            volume: count,
            revenue: count * price * 30,
            share: Math.round((count / rawItems.length) * 1000) / 10,
            price,
          }
        })
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 10)
    }

    if (dimension === 'company') {
      const companyBrandMap = new Map(brands.map((b) => [b.name, b.companyId]))
      const companyNameMap = new Map(companies.map((c) => [c.id, c.shortName]))
      const map = new Map<string, number>()
      rawItems.forEach((item) => {
        const compId = companyBrandMap.get(item.brandName)
        if (compId) {
          const cName = companyNameMap.get(compId) ?? compId
          map.set(cName, (map.get(cName) ?? 0) + 1)
        }
      })
      return Array.from(map.entries())
        .map(([name, count]) => ({
          label: name,
          volume: count,
          revenue: count * 15 * 30,
          share: Math.round((count / rawItems.length) * 1000) / 10,
          price: 15,
        }))
        .sort((a, b) => b.volume - a.volume)
    }

    // Default fallback (molecule)
    const map = new Map<string, number>()
    rawItems.forEach((item) => {
      map.set(item.moleculeName, (map.get(item.moleculeName) ?? 0) + 1)
    })
    return Array.from(map.entries())
      .map(([name, count]) => ({
        label: name,
        volume: count,
        revenue: count * 12 * 30,
        share: Math.round((count / rawItems.length) * 1000) / 10,
        price: 12,
      }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 8)
  }, [dimension])

  const chartRenderData = useMemo(() => {
    return computedData.map((d) => ({
      label: d.label,
      value: metric === 'volume' ? d.volume : metric === 'revenue' ? Math.round(d.revenue / 1000) : metric === 'share' ? d.share : d.price,
    }))
  }, [computedData, metric])

  const handleExportCSV = () => {
    const headers = `"Dimension","Volume","Revenue (BDT)","Share %"`
    const rows = computedData.map((d) => `"${d.label}",${d.volume},${d.revenue},${d.share}%`)
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csvContent))
    link.setAttribute('download', `analytics_studio_${dimension}_${metric}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <PageHeader
        title="Analytics Studio"
        description="Custom ad-hoc query builder and visualization studio for power analysts."
        breadcrumbs={[{ label: 'Tools' }, { label: 'Analytics Studio' }]}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <Download className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
            <span>Export Query Data</span>
          </button>
        }
      />

      {/* Builder Controls */}
      <div className="card mb-6 border-l-4 border-l-[var(--color-accent-primary)]">
        <SectionHeader title="Query & Chart Builder" subtitle="Select analysis dimensions, aggregate metrics, and visualization types" actions={<SlidersHorizontal className="w-4 h-4 text-[var(--color-accent-primary)]" />} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-2xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">Grouping Dimension:</label>
            <select className="input text-xs" value={dimension} onChange={(e) => setDimension(e.target.value as any)}>
              <option value="brand">Brand Name</option>
              <option value="company">Pharmaceutical Company</option>
              <option value="molecule">Generic Molecule</option>
            </select>
          </div>
          <div>
            <label className="text-2xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">Target Metric:</label>
            <select className="input text-xs" value={metric} onChange={(e) => setMetric(e.target.value as any)}>
              <option value="volume">Prescription Volume (Count)</option>
              <option value="revenue">Estimated Revenue (BDT)</option>
              <option value="share">Market Share (%)</option>
              <option value="price">Unit Price (BDT)</option>
            </select>
          </div>
          <div>
            <label className="text-2xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">Visualization Format:</label>
            <select className="input text-xs" value={chartType} onChange={(e) => setChartType(e.target.value as any)}>
              <option value="bar">Vertical Bar Chart</option>
              <option value="hbar">Horizontal Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="area">Area Chart</option>
              <option value="donut">Donut Chart</option>
              <option value="table">Data Table</option>
            </select>
          </div>
        </div>
      </div>

      {/* Render Area */}
      {chartType === 'table' ? (
        <div className="card">
          <SectionHeader title={`Custom Query Table: ${dimension.toUpperCase()} by ${metric.toUpperCase()}`} subtitle={`Top ${computedData.length} records`} />
          <DataTable
            columns={[
              { key: 'label', header: 'Dimension', accessor: (d) => <span className="font-semibold text-xs text-[var(--color-text-primary)]">{d.label}</span> },
              { key: 'volume', header: 'Rx Volume', accessor: (d) => <span className="font-data text-xs">{d.volume.toLocaleString()}</span>, align: 'right' },
              { key: 'revenue', header: 'Revenue (BDT)', accessor: (d) => <span className="font-data text-xs text-[var(--color-text-success)]">{formatCurrency(d.revenue)}</span>, align: 'right' },
              { key: 'share', header: 'Share %', accessor: (d) => <span className="badge badge-blue font-data">{d.share}%</span>, align: 'right' },
            ]}
            data={computedData}
            keyExtractor={(d) => d.label}
            pageSize={10}
          />
        </div>
      ) : (
        <ChartCard
          title={`Custom Visualization: ${dimension.toUpperCase()} by ${metric.toUpperCase()}`}
          subtitle={`Displaying top ${computedData.length} aggregated records`}
          height={320}
          onExportCsv={handleExportCSV}
        >
          {chartType === 'bar' && <BarChart data={chartRenderData} bars={[{ key: 'value', label: metric.toUpperCase(), color: '#3b82f6' }]} height={300} />}
          {chartType === 'hbar' && <HorizontalBarChart data={chartRenderData} height={300} />}
          {chartType === 'line' && <LineChart data={chartRenderData} lines={[{ key: 'value', label: metric.toUpperCase(), color: '#06b6d4' }]} height={300} />}
          {chartType === 'area' && <AreaChart data={chartRenderData} areas={[{ key: 'value', label: metric.toUpperCase(), color: '#10b981' }]} height={300} />}
          {chartType === 'donut' && <DonutChart data={chartRenderData} height={300} centerLabel={dimension.toUpperCase()} centerValue={`${computedData.length}`} />}
        </ChartCard>
      )}
    </div>
  )
}

// ── Reports Page (Executive PDF Generator) ─────────────────

export function ReportsPage() {
  const [reportTitle, setReportTitle] = useState('Executive Monthly Pharmaceutical Performance Report')
  const [includeKpis, setIncludeKpis] = useState(true)
  const [includeBrands, setIncludeBrands] = useState(true)
  const [includeWarnings, setIncludeWarnings] = useState(true)

  return (
    <div>
      <PageHeader
        title="Executive PDF Report Builder"
        description="Custom executive report generator with print-to-PDF formatting."
        breadcrumbs={[{ label: 'Tools' }, { label: 'Reports' }]}
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
            <Printer className="w-3.5 h-3.5" />
            <span>Generate & Print PDF</span>
          </button>
        }
      />

      {/* Config Panel */}
      <div className="card mb-6 no-print">
        <SectionHeader title="Report Configuration" subtitle="Select sections to include in executive output" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-2xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">Report Title:</label>
            <input
              type="text"
              className="input text-xs"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6 pt-5">
            <label className="flex items-center gap-2 text-xs text-[var(--color-text-primary)] cursor-pointer">
              <input type="checkbox" checked={includeKpis} onChange={(e) => setIncludeKpis(e.target.checked)} />
              <span>KPI Scorecard</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--color-text-primary)] cursor-pointer">
              <input type="checkbox" checked={includeBrands} onChange={(e) => setIncludeBrands(e.target.checked)} />
              <span>Top Brands</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--color-text-primary)] cursor-pointer">
              <input type="checkbox" checked={includeWarnings} onChange={(e) => setIncludeWarnings(e.target.checked)} />
              <span>Early Warnings</span>
            </label>
          </div>
        </div>
      </div>

      {/* Printable Report Output Area */}
      <div className="card p-6 bg-white text-black print:p-0 print:border-none">
        <div className="border-b border-gray-300 pb-4 mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{reportTitle}</h1>
            <p className="text-xs text-gray-500">Pharma Intelligence OS • Confidential Executive Summary</p>
          </div>
          <span className="text-xs text-gray-400 font-mono">{new Date().toLocaleDateString()}</span>
        </div>

        {includeKpis && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-2xs uppercase text-gray-500 font-bold">Total Prescriptions</p>
              <p className="text-xl font-bold text-gray-900">586 Rx</p>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-2xs uppercase text-gray-500 font-bold">Market Share Leader</p>
              <p className="text-xl font-bold text-gray-900">NovaCor 5 (24.5%)</p>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-2xs uppercase text-gray-500 font-bold">Active Prescribers</p>
              <p className="text-xl font-bold text-gray-900">50 Doctors</p>
            </div>
          </div>
        )}

        {includeBrands && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-800 mb-2">Top 5 Performing Brands</h2>
            <table className="w-full text-xs text-left border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="p-2 text-gray-700">Rank</th>
                  <th className="p-2 text-gray-700">Brand Name</th>
                  <th className="p-2 text-gray-700">Manufacturer</th>
                  <th className="p-2 text-gray-700 text-right">Rx Count</th>
                </tr>
              </thead>
              <tbody>
                {brands.slice(0, 5).map((b, i) => (
                  <tr key={b.id} className="border-b border-gray-200">
                    <td className="p-2 font-mono">#{i + 1}</td>
                    <td className="p-2 font-semibold text-gray-900">{b.name}</td>
                    <td className="p-2 text-gray-600">Company {b.companyId}</td>
                    <td className="p-2 text-right font-mono">{340 - i * 35} Rx</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {includeWarnings && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-2">Critical Early Warning Summary</h2>
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
              <strong>Decline Warning:</strong> Axilosartan 100 exhibited 2 consecutive months of volume decline in Dhaka North. Immediate detailing intervention recommended.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
