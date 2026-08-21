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
import SectionHeader from '../components/common/SectionHeader'
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
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

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
      <SectionHeader
        title="Fare Analytics"
        description={
          <>
            Historical dataset analysis — averages computed from the FareSight
            training dataset ({summary.data ? formatNumber(summary.data.rows) : '—'}{' '}
            flights). Not live market data.
          </>
        }
      />

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

        <div className="lg:col-span-6">
          <ChartCard
            title="Average Fare by Season"
            icon="calendar"
            meta="INR (₹)"
            heightClass="h-[300px]"
          >
            <BarChartWrapper data={seasons.data ?? []} height={260} />
          </ChartCard>
        </div>
        <div className="lg:col-span-6">
          <ChartCard
            title="Average Fare by Booking Channel"
            icon="shopping-bag"
            meta="INR (₹)"
            heightClass="h-[300px]"
          >
            <BarChartWrapper data={channels.data ?? []} height={260} />
          </ChartCard>
        </div>

        <div className="lg:col-span-6">
          <ChartCard
            title="Fare vs Flight Duration"
            icon="clock"
            meta={`Pearson r = ${duration.data?.correlation ?? '—'}`}
            heightClass="h-[320px]"
          >
            <ScatterChartWrapper
              data={toScatter(duration.data ?? { points: [], correlation: 0 }, 'duration_minutes')}
              xLabel="Duration (minutes)"
              xFormatter={(v) => formatHours(v)}
              height={280}
            />
          </ChartCard>
        </div>
        <div className="lg:col-span-6">
          <ChartCard
            title="Trend: Days Before Departure"
            icon="timer"
            meta={`Pearson r = ${daysBefore.data?.correlation ?? '—'}`}
            heightClass="h-[320px]"
          >
            <ScatterChartWrapper
              data={toScatter(daysBefore.data ?? { points: [], correlation: 0 }, 'days_before_departure')}
              xLabel="Days before departure"
              height={280}
            />
          </ChartCard>
        </div>

        <div className="lg:col-span-6">
          <ChartCard
            title="Average Fare by Source"
            icon="send"
            meta="INR (₹)"
            heightClass="h-[300px]"
          >
            <BarChartWrapper data={sources.data ?? []} height={260} />
          </ChartCard>
        </div>

        <div className="lg:col-span-6">
          <ChartCard
            title="Average Fare by Destination"
            icon="map-pin"
            meta="INR (₹)"
            heightClass="h-[300px]"
          >
            <BarChartWrapper data={destinations.data ?? []} height={260} />
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
