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

interface FeatureImportanceChartProps {
  data: FeatureImportanceItem[]
  height?: number
}

// Normalize importance to a 0–100 scale for display.
export default function FeatureImportanceChart({
  data,
  height = 320,
}: FeatureImportanceChartProps) {
  const max = Math.max(...data.map((d) => d.importance))
  const chartData = data.map((d) => ({
    ...d,
    percent: Math.round((d.importance / max) * 100),
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={(v: number) => `${v}%`}
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="feature"
          width={150}
          stroke="#94a3b8"
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value: number | string, _name: string) => [
            `${value}% (relative)`,
            'Importance',
          ]}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            fontSize: 12,
          }}
        />
        <Bar dataKey="percent" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {chartData.map((entry, index) => (
            <Cell
              key={`${entry.feature}-${index}`}
              fill={index === 0 ? '#2c6da3' : index < 4 ? '#3d88c1' : '#94c3e4'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
