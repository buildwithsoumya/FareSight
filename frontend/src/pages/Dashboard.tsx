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
import SectionHeader from '../components/common/SectionHeader'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorState from '../components/common/ErrorState'
import BarChartWrapper from '../components/charts/BarChartWrapper'

export default function Dashboard() {
  const summary = useAsyncData(getSummary)
  const airlines = useAsyncData(getAirlineAnalytics)
  const classes = useAsyncData(getClassAnalytics)
  const stops = useAsyncData(getStopsAnalytics)

  const loading =
    summary.loading || airlines.loading || classes.loading || stops.loading

  const error =
    summary.error || airlines.error || classes.error || stops.error

  if (loading) return <LoadingSpinner label="Loading flight analytics..." />
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />
  if (!summary.data) return null

  const s = summary.data

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard"
        description="Summary statistics computed from the FareSight training dataset of 98,039 cleaned flight records."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Average Fare"
          value={formatINR(s.average_price)}
          icon="banknote"
          hint="Mean fare across the dataset"
          tone="indigo"
        />
        <KpiCard
          label="Minimum Fare"
          value={formatINR(s.min_price)}
          icon="trending-down"
          hint="Cheapest observed fare"
          tone="sky"
        />
        <KpiCard
          label="Maximum Fare"
          value={formatINR(s.max_price)}
          icon="trending-up"
          hint="Most expensive observed fare"
          tone="violet"
        />
        <KpiCard
          label="Flights Analyzed"
          value={formatNumber(s.rows)}
          icon="plane"
          hint={`Median fare ${formatINR(s.median_price)}`}
          tone="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ChartCard
            title="Average Fare by Airline"
            icon="bar-chart"
            meta="INR (₹)"
            heightClass="h-[350px]"
          >
            <BarChartWrapper data={airlines.data ?? []} horizontal height={310} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
          <ChartCard title="Class Impact" icon="pie-chart" heightClass="h-[167px]">
            <BarChartWrapper data={classes.data ?? []} height={142} />
          </ChartCard>
          <ChartCard title="Fare by Stops" icon="layers" heightClass="h-[167px]">
            <BarChartWrapper data={stops.data ?? []} height={142} />
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
