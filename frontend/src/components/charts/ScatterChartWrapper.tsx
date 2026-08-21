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
import { TOOLTIP_STYLE } from './BarChartWrapper'

interface ScatterChartWrapperProps {
  data: ScatterPoint[]
  xLabel: string
  yLabel?: string
  xFormatter?: (value: number) => string
  yFormatter?: (value: number) => string
  height?: number
  color?: string
}

const AXIS_COLOR = '#94a3b8'
const GRID_COLOR = '#e2e8f0'

export default function ScatterChartWrapper({
  data,
  xLabel,
  yLabel = 'Price',
  xFormatter = formatNumber,
  yFormatter = formatCompactINR,
  height = 260,
  color = '#6366f1',
}: ScatterChartWrapperProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 8, right: 8, bottom: 16, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
        <XAxis
          type="number"
          dataKey="x"
          name={xLabel}
          tickFormatter={(v: number) => xFormatter(v)}
          stroke={AXIS_COLOR}
          fontSize={10}
          tickLine={false}
          axisLine={false}
          label={{
            value: xLabel,
            position: 'insideBottom',
            offset: -6,
            fontSize: 10,
            fill: '#94a3b8',
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yLabel}
          tickFormatter={(v: number) => yFormatter(v)}
          stroke={AXIS_COLOR}
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 3', stroke: '#94a3b8' }}
          formatter={(value: number | string, name: string) => {
            if (name === 'x') return [xFormatter(Number(value)), xLabel]
            return [yFormatter(Number(value)), yLabel]
          }}
          contentStyle={TOOLTIP_STYLE}
        />
        <Scatter data={data} fill={color} fillOpacity={0.45} stroke="none" />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
