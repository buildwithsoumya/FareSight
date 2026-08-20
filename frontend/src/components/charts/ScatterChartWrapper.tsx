import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ScatterPoint } from '../../types'
import { formatCompactINR, formatNumber } from '../../utils/format'

interface ScatterChartWrapperProps {
  data: ScatterPoint[]
  xLabel: string
  yLabel?: string
  xFormatter?: (value: number) => string
  yFormatter?: (value: number) => string
  height?: number
  color?: string
}

export default function ScatterChartWrapper({
  data,
  xLabel,
  yLabel = 'Price',
  xFormatter = formatNumber,
  yFormatter = formatCompactINR,
  height = 260,
  color = '#2c6da3',
}: ScatterChartWrapperProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          type="number"
          dataKey="x"
          name={xLabel}
          tickFormatter={(v: number) => xFormatter(v)}
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          label={{
            value: xLabel,
            position: 'insideBottom',
            offset: -2,
            fontSize: 11,
            fill: '#64748b',
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yLabel}
          tickFormatter={(v: number) => yFormatter(v)}
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(value: number | string, name: string) => {
            if (name === 'x') return [xFormatter(Number(value)), xLabel]
            return [yFormatter(Number(value)), yLabel]
          }}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            fontSize: 12,
          }}
        />
        <Scatter
          data={data}
          fill={color}
          fillOpacity={0.55}
          stroke={color}
          strokeWidth={0.5}
        />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
