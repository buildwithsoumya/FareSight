import { useAsyncData } from '../hooks/useAsyncData'
import {
  getAirlineAnalytics,
  getClassAnalytics,
  getStopsAnalytics,
  getSummary,
} from '../services/api'
import { formatINR, formatNumber } from '../utils/format'
import KpiCard from '../components/cards/KpiCard'
import ChartCard from '../components/cards/ChartCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorState from '../components/common/ErrorState'
import BarChartWrapper from '../components/charts/BarChartWrapper'

export default function Dashboard() {
  const summary = useAsyncData(getSummary)
  const airlines = useAsyncData(getAirlineAnalytics)
  const classes = useAsyncData(getClassAnalytics)
  const stops = useAsyncData(getStopsAnalytics)

  const loading =
    summary.loading ||
    airlines.loading ||
    classes.loading ||
    stops.loading

  const error =
    summary.error ||
    airlines.error ||
    classes.error ||
    stops.error

  if (loading) return <LoadingSpinner label="Loading flight analytics..." />
  if (error) return <ErrorState message={error} />
  if (!summary.data) return null

  const { data: s } = summary

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Average Fare"
          value={formatINR(s.average_price)}
          icon="💸"
          hint="Mean fare across the dataset"
        />
        <KpiCard
          label="Minimum Fare"
          value={formatINR(s.min_price)}
          icon="🟢"
          hint="Cheapest observed fare"
        />
        <KpiCard
          label="Maximum Fare"
          value={formatINR(s.max_price)}
          icon="🔺"
          hint="Most expensive observed fare"
        />
        <KpiCard
          label="Flights Analyzed"
          value={formatNumber(s.rows)}
          icon="✈️"
          hint={`Median fare ${formatINR(s.median_price)}`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Average Fare by Airline"
          description="Mean fare per airline (historical dataset)"
          className="lg:col-span-2"
        >
          <BarChartWrapper data={airlines.data ?? []} horizontal height={320} />
        </ChartCard>

        <div className="space-y-4">
          <ChartCard title="Average Fare by Travel Class">
            <BarChartWrapper data={classes.data ?? []} height={180} />
          </ChartCard>

          <ChartCard title="Average Fare by Number of Stops">
            <BarChartWrapper data={stops.data ?? []} height={180} />
          </ChartCard>
        </div>

        <div className="card flex flex-col items-center justify-center p-8 text-center">
          <span className="text-3xl" aria-hidden="true">
            📈
          </span>
          <h3 className="mt-3 text-sm font-semibold text-slate-800">
            Explore the analytics
          </h3>
          <p className="mt-1.5 max-w-xs text-sm text-slate-500">
            Head to the Analytics page for fare-vs-duration scatter plots,
            seasonal trends and booking-channel comparisons — all computed from
            the FareSight dataset.
          </p>
        </div>
      </div>
    </div>
  )
}
