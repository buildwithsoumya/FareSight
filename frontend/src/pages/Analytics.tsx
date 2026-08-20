import { useAsyncData } from '../hooks/useAsyncData'
import {
  getAirlineAnalytics,
  getBookingChannelAnalytics,
  getClassAnalytics,
  getDaysBeforeDepartureAnalytics,
  getDestinationAnalytics,
  getDurationAnalytics,
  getSeasonAnalytics,
  getSourceAnalytics,
  getStopsAnalytics,
  getSummary,
} from '../services/api'
import ChartCard from '../components/cards/ChartCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorState from '../components/common/ErrorState'
import EmptyState from '../components/common/EmptyState'
import BarChartWrapper from '../components/charts/BarChartWrapper'
import ScatterChartWrapper from '../components/charts/ScatterChartWrapper'
import { formatHours, formatNumber } from '../utils/format'

export default function Analytics() {
  const summary = useAsyncData(getSummary)
  const airlines = useAsyncData(getAirlineAnalytics)
  const classes = useAsyncData(getClassAnalytics)
  const stops = useAsyncData(getStopsAnalytics)
  const seasons = useAsyncData(getSeasonAnalytics)
  const sources = useAsyncData(getSourceAnalytics)
  const destinations = useAsyncData(getDestinationAnalytics)
  const channels = useAsyncData(getBookingChannelAnalytics)
  const duration = useAsyncData(getDurationAnalytics)
  const daysBefore = useAsyncData(getDaysBeforeDepartureAnalytics)

  const loading =
    summary.loading ||
    airlines.loading ||
    classes.loading ||
    stops.loading ||
    seasons.loading ||
    sources.loading ||
    destinations.loading ||
    channels.loading ||
    duration.loading ||
    daysBefore.loading

  const error =
    summary.error ||
    airlines.error ||
    classes.error ||
    stops.error ||
    seasons.error ||
    sources.error ||
    destinations.error ||
    channels.error ||
    duration.error ||
    daysBefore.error

  if (loading) return <LoadingSpinner label="Loading flight analytics..." />
  if (error) return <ErrorState message={error} />

  const hasData = Boolean(
    airlines.data?.length ||
      classes.data?.length ||
      stops.data?.length ||
      seasons.data?.length,
  )
  if (!hasData) {
    return (
      <div className="card">
        <EmptyState message="No analytics data available." />
      </div>
    )
  }

  const toScatter = (
    data: { points: { duration_minutes?: number; days_before_departure?: number; price: number }[] },
    xKey: 'duration_minutes' | 'days_before_departure',
  ) =>
    (data?.points ?? [])
      .filter((p) => p[xKey] !== undefined)
      .map((p) => ({ x: p[xKey] as number, y: p.price }))

  return (
    <div className="space-y-6">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Historical Dataset Analysis — averages computed from the FareSight
        training dataset ({summary.data ? formatNumber(summary.data.rows) : '—'}{' '}
        flights)
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Average Fare by Airline"
          description="Mean fare per airline (historical data)"
        >
          <BarChartWrapper data={airlines.data ?? []} horizontal height={300} />
        </ChartCard>

        <div className="space-y-4">
          <ChartCard title="Average Fare by Travel Class">
            <BarChartWrapper data={classes.data ?? []} height={180} />
          </ChartCard>
          <ChartCard title="Average Fare by Stops">
            <BarChartWrapper data={stops.data ?? []} height={180} />
          </ChartCard>
        </div>

        <ChartCard
          title="Average Fare by Season"
          description="Mean fare per season (historical data)"
        >
          <BarChartWrapper data={seasons.data ?? []} height={260} />
        </ChartCard>

        <ChartCard
          title="Average Fare by Booking Channel"
          description="Mean fare per channel (historical data)"
        >
          <BarChartWrapper data={channels.data ?? []} height={260} />
        </ChartCard>

        <ChartCard
          title="Fare vs Duration"
          description={`Historical relationship · Pearson correlation ${duration.data?.correlation ?? '—'}`}
        >
          <ScatterChartWrapper
            data={toScatter(duration.data ?? { points: [], correlation: 0 }, 'duration_minutes')}
            xLabel="Duration (minutes)"
            xFormatter={(v) => formatHours(v)}
          />
        </ChartCard>

        <ChartCard
          title="Fare vs Days Before Departure"
          description={`Booking lead time · Pearson correlation ${daysBefore.data?.correlation ?? '—'}`}
        >
          <ScatterChartWrapper
            data={toScatter(daysBefore.data ?? { points: [], correlation: 0 }, 'days_before_departure')}
            xLabel="Days before departure"
          />
        </ChartCard>

        <ChartCard
          title="Average Fare by Source"
          description="Mean fare per departure city (historical data)"
        >
          <BarChartWrapper data={sources.data ?? []} height={280} />
        </ChartCard>

        <ChartCard
          title="Average Fare by Destination"
          description="Mean fare per arrival city (historical data)"
          className="lg:col-span-2"
        >
          <BarChartWrapper data={destinations.data ?? []} height={280} />
        </ChartCard>
      </div>
    </div>
  )
}
