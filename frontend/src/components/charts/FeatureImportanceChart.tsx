import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { FeatureImportanceItem } from '../../types'
import { TOOLTIP_STYLE } from './BarChartWrapper'

interface FeatureImportanceChartProps {
  data: FeatureImportanceItem[]
  height?: number
}

const AXIS_COLOR = '#94a3b8'
const GRID_COLOR = '#e2e8f0'

export default function FeatureImportanceChart({
  data,
  height = 320,
}: FeatureImportanceChartProps) {
  const max = Math.max(...data.map((d) => d.importance))
  const chartData = data.map((d, i) => ({
    ...d,
    percent: Math.round((d.importance / max) * 100),
    rank: i,
  }))

  const barColor = (rank: number) =>
    rank === 0 ? '#4f46e5' : rank < 4 ? '#818cf8' : '#c7d2fe'

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={(v: number) => `${v}%`}
          stroke={AXIS_COLOR}
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="feature"
          width={160}
          stroke={AXIS_COLOR}
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value: number | string, _name: string) => [
            `${value}% (relative)`,
            'Importance',
          ]}
          contentStyle={TOOLTIP_STYLE}
          cursor={{ fill: 'rgba(79, 70, 229, 0.06)' }}
        />
        <Bar dataKey="percent" radius={[0, 6, 6, 0]} maxBarSize={18}>
          {chartData.map((entry, index) => (
            <Cell key={`${entry.feature}-${index}`} fill={barColor(entry.rank)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
