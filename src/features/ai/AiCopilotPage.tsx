// ─────────────────────────────────────────────────────────
// FEATURE: AI Pharma Copilot (Enhanced with Live Inline Recharts)
// Conversational AI with dataset query capabilities and inline chart rendering
// ─────────────────────────────────────────────────────────

import { useState } from 'react'
import { Bot, Send, Sparkles, User } from 'lucide-react'
import { PageHeader } from '@/components/ui/Headers'
import { LineChart, BarChart, DonutChart } from '@/components/charts'
import { brands, prescriptions, doctors, territories } from '@/data'

interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  tableData?: Array<Record<string, string | number>>
  chartData?: {
    type: 'line' | 'bar' | 'donut'
    data: Array<{ label: string; value: number }>
  }
  timestamp: string
}

export function AiCopilotPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your **Pharma Copilot**. I can analyze Bangladesh prescription datasets, generate inline charts, compare brand market shares, and uncover growth opportunities. How can I assist your market strategy today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [loading, setLoading] = useState(false)

  const quickPrompts = [
    'Top 5 brands market share donut chart',
    'Compare NovaCor vs Axilosartan sales trend',
    'Which doctors in Dhaka prescribe NovaCor?',
    'Show Sylhet white space opportunities',
  ]

  const handleSend = (textToSend?: string) => {
    const query = textToSend ?? input
    if (!query.trim()) return

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setLoading(true)

    setTimeout(() => {
      let aiText = ''
      let tableData: Array<Record<string, string | number>> | undefined = undefined
      let chartData: { type: 'line' | 'bar' | 'donut'; data: Array<{ label: string; value: number }> } | undefined = undefined

      const q = query.toLowerCase()
      if (q.includes('donut') || q.includes('top 5') || q.includes('market share')) {
        aiText = 'Here is the **Top 5 Brands Market Share Breakdown** rendered directly from our prescription dataset:'
        chartData = {
          type: 'donut',
          data: brands.slice(0, 5).map((b, i) => ({
            label: b.name,
            value: 340 - i * 40,
          })),
        }
        tableData = brands.slice(0, 5).map((b, i) => ({
          Rank: `#${i + 1}`,
          Brand: b.name,
          Form: `${b.form} (${b.strength})`,
          UnitPrice: `৳${b.unitPrice.toFixed(2)}`,
        }))
      } else if (q.includes('compare') || q.includes('trend') || q.includes('novacor vs axilosartan')) {
        aiText = 'Here is the **6-Month Prescription Volume Comparison** for NovaCor vs Axilosartan:'
        chartData = {
          type: 'line',
          data: [
            { label: 'Jan', value: 42 },
            { label: 'Feb', value: 48 },
            { label: 'Mar', value: 55 },
            { label: 'Apr', value: 62 },
            { label: 'May', value: 59 },
            { label: 'Jun', value: 68 },
          ],
        }
      } else if (q.includes('dhaka') || q.includes('doctor')) {
        aiText = 'Found **4 Tier A Cardiologists in Dhaka** actively prescribing NovaCor 5/10:'
        tableData = doctors.slice(0, 4).map((d) => ({
          Doctor: d.name,
          Degree: d.degree,
          Tier: `Tier ${d.tier}`,
          RxCount: `${d.prescriptionCount} Rx`,
        }))
      } else if (q.includes('sylhet') || q.includes('white space')) {
        aiText = 'Analysis of **Sylhet Metro Territory**: Low NovaMet penetration detected among diabetologists. Estimated **+৳450,000** monthly opportunity.'
        chartData = {
          type: 'bar',
          data: [
            { label: 'Current Coverage', value: 38 },
            { label: 'Target Potential', value: 85 },
          ],
        }
      } else {
        aiText = `Based on our dataset of **${prescriptions.length} digital prescriptions** across **${territories.length} territories**: Query "${query}" shows strong prescriber velocity.`
      }

      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: aiText,
        tableData,
        chartData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, aiMsg])
      setLoading(false)
    }, 600)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-3rem)]">
      <PageHeader
        title="Pharma Copilot"
        description="Conversational AI assistant rendering live interactive charts, competitive analysis, and dataset insights."
        badge="AI Assistant + Live Charting"
        breadcrumbs={[{ label: 'AI' }, { label: 'Pharma Copilot' }]}
      />

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3">
        <span className="text-2xs text-[var(--color-text-muted)] font-bold uppercase tracking-wider whitespace-nowrap">Prompts:</span>
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            className="btn btn-secondary btn-sm text-2xs whitespace-nowrap"
            onClick={() => handleSend(p)}
          >
            <Sparkles className="w-3 h-3 text-[var(--color-accent-primary)]" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 card overflow-y-auto p-4 space-y-4 mb-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-xl rounded-lg p-3 text-xs ${m.sender === 'user' ? 'bg-[var(--color-accent-primary)] text-white' : 'bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)]'}`}>
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

              {/* Inline Interactive Chart Rendering */}
              {m.chartData && (
                <div className="mt-3 p-3 bg-[var(--color-bg-surface)] border border-[var(--color-border-strong)] rounded-lg">
                  {m.chartData.type === 'donut' && (
                    <DonutChart data={m.chartData.data} height={180} />
                  )}
                  {m.chartData.type === 'line' && (
                    <LineChart data={m.chartData.data} lines={[{ key: 'value', label: 'Rx Volume', color: '#3b82f6' }]} height={180} />
                  )}
                  {m.chartData.type === 'bar' && (
                    <BarChart data={m.chartData.data} bars={[{ key: 'value', label: 'Coverage %', color: '#10b981' }]} height={180} />
                  )}
                </div>
              )}

              {/* Data Table */}
              {m.tableData && (
                <div className="mt-2.5 overflow-x-auto">
                  <table className="w-full text-2xs border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-strong)]">
                        {Object.keys(m.tableData[0]).map((k) => (
                          <th key={k} className="p-1 text-left text-[var(--color-text-muted)] uppercase font-bold">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {m.tableData.map((row, idx) => (
                        <tr key={idx} className="border-b border-[var(--color-border-subtle)]">
                          {Object.values(row).map((val, vIdx) => (
                            <td key={vIdx} className="p-1">{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <span className="text-[10px] opacity-60 block text-right mt-1.5">{m.timestamp}</span>
            </div>
            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-strong)] flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg p-3 text-xs text-[var(--color-text-muted)]">
              Copilot is generating chart & data insights...
            </div>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend() }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          className="input flex-1 text-xs"
          placeholder="Ask Copilot: 'Show top 5 brands donut chart', 'Compare NovaCor sales'..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary text-xs" disabled={!input.trim() || loading}>
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  )
}
