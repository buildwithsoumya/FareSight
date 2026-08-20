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
import type { CategoryPricePoint } from '../../types'
import { formatAxisPrice, formatCompactINR } from '../../utils/format'

interface BarChartWrapperProps {
  data: CategoryPricePoint[]
  dataKey?: string
  color?: string
  height?: number
  horizontal?: boolean
  valueFormatter?: (value: number) => string
  nameKey?: string
}

export default function BarChartWrapper({
  data,
  dataKey = 'average_price',
  color = '#3d88c1',
  height = 260,
  horizontal = false,
  valueFormatter = formatCompactINR,
  nameKey = 'name',
}: BarChartWrapperProps) {
  if (data.length === 0) return null

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 4, right: 8, bottom: 4, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        {horizontal ? (
          <>
            <XAxis
              type="number"
              tickFormatter={(v: number) => formatAxisPrice(v)}
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey={nameKey}
              width={130}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={nameKey}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={data.length > 6 ? -32 : 0}
              textAnchor={data.length > 6 ? 'end' : 'middle'}
              height={data.length > 6 ? 60 : 30}
            />
            <YAxis
              tickFormatter={(v: number) => formatAxisPrice(v)}
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
          </>
        )}
        <Tooltip
          formatter={(value: number | string) => [
            valueFormatter(Number(value)),
            'Avg price',
          ]}
          labelFormatter={(label) => String(label)}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            fontSize: 12,
          }}
        />
        <Bar
          dataKey={dataKey}
          radius={[4, 4, 0, 0]}
          maxBarSize={48}
          name="Avg price"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}-${index}`}
              fill={index === 0 ? color : `${color}88`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
