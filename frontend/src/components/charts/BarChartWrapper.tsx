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

const AXIS_COLOR = '#94a3b8'
const GRID_COLOR = '#e2e8f0'

export const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px -1px rgb(15 23 42 / 0.08)',
  backgroundColor: '#ffffff',
  color: '#334155',
  fontSize: 12,
} as const

export default function BarChartWrapper({
  data,
  dataKey = 'average_price',
  color = '#4f46e5',
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
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
        {horizontal ? (
          <>
            <XAxis
              type="number"
              tickFormatter={(v: number) => formatAxisPrice(v)}
              stroke={AXIS_COLOR}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey={nameKey}
              width={130}
              stroke={AXIS_COLOR}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={nameKey}
              stroke={AXIS_COLOR}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={data.length > 6 ? -32 : 0}
              textAnchor={data.length > 6 ? 'end' : 'middle'}
              height={data.length > 6 ? 60 : 30}
            />
            <YAxis
              tickFormatter={(v: number) => formatAxisPrice(v)}
              stroke={AXIS_COLOR}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
          </>
        )}
        <Tooltip
          formatter={(value: number | string) => [
            valueFormatter(Number(value)),
            'Avg fare',
          ]}
          labelFormatter={(label) => String(label)}
          contentStyle={TOOLTIP_STYLE}
          cursor={{ fill: 'rgba(79, 70, 229, 0.06)' }}
        />
        <Bar dataKey={dataKey} radius={[6, 6, 0, 0]} maxBarSize={44} name="Avg fare">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}-${index}`}
              fill={index === 0 ? color : `${color}55`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
