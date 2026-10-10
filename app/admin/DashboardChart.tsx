'use client'

interface DayData {
  label: string
  count: number
  revenue: number
}

export default function DashboardChart({ days }: { days: DayData[] }) {
  const maxCount = Math.max(...days.map(d => d.count), 1)
  const maxRevenue = Math.max(...days.map(d => d.revenue), 1)

  const W = 520
  const H = 140
  const PAD = { top: 16, right: 12, bottom: 28, left: 32 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const barW = Math.floor(chartW / days.length) - 6
  const halfW = Math.floor(chartW / days.length)

  // Line path for revenue
  const pts = days.map((d, i) => {
    const x = PAD.left + i * halfW + halfW / 2
    const y = PAD.top + chartH - (d.revenue / maxRevenue) * chartH
    return `${x},${y}`
  })
  const linePath = pts.length ? `M ${pts.join(' L ')}` : ''

  const areaPath = pts.length
    ? `M ${PAD.left + 0 * halfW + halfW / 2},${PAD.top + chartH} L ${pts.join(' L ')} L ${PAD.left + (days.length - 1) * halfW + halfW / 2},${PAD.top + chartH} Z`
    : ''

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-label="Orders and revenue over the last 7 days"
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4953a" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#c4953a" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Y-axis gridlines */}
      {[0, 0.5, 1].map((f, i) => {
        const y = PAD.top + chartH - f * chartH
        return (
          <g key={i}>
            <line
              x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
              stroke="currentColor" strokeOpacity="0.07" strokeWidth="1"
              className="text-slate-900 dark:text-white"
            />
            <text
              x={PAD.left - 6} y={y + 4}
              fontSize="9" textAnchor="end"
              fill="currentColor" fillOpacity="0.4"
              className="text-slate-600 dark:text-slate-400"
            >
              {Math.round(f * maxCount)}
            </text>
          </g>
        )
      })}

      {/* Bars (order count) */}
      {days.map((d, i) => {
        const barH = Math.max(2, (d.count / maxCount) * chartH)
        const x = PAD.left + i * halfW + (halfW - barW) / 2
        const y = PAD.top + chartH - barH
        return (
          <rect
            key={i}
            x={x} y={y} width={barW} height={barH}
            rx="3"
            fill="#c4953a"
            fillOpacity="0.18"
          />
        )
      })}

      {/* Revenue area */}
      {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}

      {/* Revenue line */}
      {linePath && (
        <path
          d={linePath}
          fill="none"
          stroke="#c4953a"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {/* Dots */}
      {days.map((d, i) => {
        const x = PAD.left + i * halfW + halfW / 2
        const y = PAD.top + chartH - (d.revenue / maxRevenue) * chartH
        return (
          <circle key={i} cx={x} cy={y} r="3" fill="#c4953a" />
        )
      })}

      {/* X-axis labels */}
      {days.map((d, i) => {
        const x = PAD.left + i * halfW + halfW / 2
        return (
          <text
            key={i}
            x={x} y={H - 6}
            fontSize="9" textAnchor="middle"
            fill="currentColor" fillOpacity="0.45"
            className="text-slate-600 dark:text-slate-400"
          >
            {d.label}
          </text>
        )
      })}
    </svg>
  )
}
