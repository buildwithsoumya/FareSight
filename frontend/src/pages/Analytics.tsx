import { useState } from 'react'
import { useAsyncData } from '../hooks/useAsyncData'
import { getAnalytics } from '../services/api'
import type { AnalyticsFilters } from '../types'
import FilterBar from '../components/forms/FilterBar'
import ChartCard from '../components/cards/ChartCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorState from '../components/common/ErrorState'
import EmptyState from '../components/common/EmptyState'
import ScatterChartWrapper from '../components/charts/ScatterChartWrapper'
import BarChartWrapper from '../components/charts/BarChartWrapper'
import { formatHours } from '../utils/format'

const DEFAULT_FILTERS: AnalyticsFilters = {
  airline: 'all',
  source: 'all',
  destination: 'all',
  travelClass: 'all',
  totalStops: 'all',
  bookingChannel: 'all',
  season: 'all',
}

export default function Analytics() {
  const [filters, setFilters] = useState<AnalyticsFilters>(DEFAULT_FILTERS)

  const { data, loading, error, reload } = useAsyncData(
    () => getAnalytics(filters),
    [filters],
  )

  if (loading) return <LoadingSpinner label="Loading flight analytics..." />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!data) return null

  const hasData = Object.values(data).some((v) => v.length > 0)

  return (
    <div className="space-y-6">
      <FilterBar filters={filters} onChange={setFilters} />

      {!hasData ? (
        <div className="card">
          <EmptyState message="No analytics data available for the current filter selection." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard
            title="Price vs Duration"
            description="Each point is a sampled flight"
          >
            <ScatterChartWrapper
              data={data.priceVsDuration}
              xLabel="Duration (minutes)"
              xFormatter={(v) => formatHours(v)}
            />
          </ChartCard>

          <ChartCard
            title="Price vs Distance"
            description="Each point is a sampled flight"
          >
            <ScatterChartWrapper
              data={data.priceVsDistance}
              xLabel="Distance (km)"
            />
          </ChartCard>

          <ChartCard
            title="Price vs Days Before Departure"
            description="Booking lead time vs fare"
          >
            <ScatterChartWrapper
              data={data.priceVsDaysBeforeDeparture}
              xLabel="Days before departure"
            />
          </ChartCard>

          <ChartCard
            title="Average Price by Booking Channel"
            description="Mean fare per channel"
          >
            <BarChartWrapper data={data.priceByBookingChannel} height={280} />
          </ChartCard>

          <ChartCard
            title="Average Price by Season"
            description="Mean fare per season"
          >
            <BarChartWrapper data={data.priceBySeason} height={280} />
          </ChartCard>

          <ChartCard
            title="Average Price by Source"
            description="Mean fare per departure city"
          >
            <BarChartWrapper data={data.priceBySource} height={280} />
          </ChartCard>

          <ChartCard
            title="Average Price by Destination"
            description="Mean fare per arrival city"
            className="lg:col-span-2"
          >
            <BarChartWrapper data={data.priceByDestination} height={280} />
          </ChartCard>
        </div>
      )}

    </div>
  )
}
