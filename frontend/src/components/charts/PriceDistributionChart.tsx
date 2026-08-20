import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PriceDistributionPoint } from '../../types'
import { formatNumber } from '../../utils/format'

interface PriceDistributionChartProps {
  data: PriceDistributionPoint[]
  height?: number
}

export default function PriceDistributionChart({
  data,
  height = 260,
}: PriceDistributionChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: `₹${formatNumber(d.lowerBound)}–${formatNumber(d.upperBound)}`,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="#94a3b8"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-40}
          textAnchor="end"
          height={64}
        />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value: number | string) => [formatNumber(Number(value)), 'Flights']}
          labelFormatter={(label) => `Price range ${label}`}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" fill="#3d88c1" radius={[4, 4, 0, 0]} name="Flights" />
      </BarChart>
    </ResponsiveContainer>
  )
}
