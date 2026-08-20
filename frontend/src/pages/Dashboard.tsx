import { useAsyncData } from '../hooks/useAsyncData'
import { getOverview } from '../services/api'
import { formatINR, formatNumber } from '../utils/format'
import KpiCard from '../components/cards/KpiCard'
import ChartCard from '../components/cards/ChartCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorState from '../components/common/ErrorState'
import PriceDistributionChart from '../components/charts/PriceDistributionChart'
import BarChartWrapper from '../components/charts/BarChartWrapper'

export default function Dashboard() {
  const { data, loading, error, reload } = useAsyncData(getOverview)

  if (loading) return <LoadingSpinner label="Loading flight analytics..." />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!data) return null

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Average Flight Price"
          value={formatINR(data.kpis.averagePrice)}
          icon="💸"
          hint="Mean fare across the dataset"
        />
        <KpiCard
          label="Minimum Price"
          value={formatINR(data.kpis.minPrice)}
          icon="🟢"
          hint="Cheapest observed fare"
        />
        <KpiCard
          label="Maximum Price"
          value={formatINR(data.kpis.maxPrice)}
          icon="🔺"
          hint="Most expensive observed fare"
        />
        <KpiCard
          label="Flights Analyzed"
          value={formatNumber(data.kpis.flightsAnalyzed)}
          icon="✈️"
          hint={`Median fare ${formatINR(data.kpis.medianPrice)}`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Flight Price Distribution"
          description="Number of flights across price ranges"
          className="lg:col-span-2"
        >
          <PriceDistributionChart data={data.priceDistribution} height={280} />
        </ChartCard>

        <ChartCard
          title="Average Price by Airline"
          description="Mean fare per airline"
        >
          <BarChartWrapper
            data={data.priceByAirline}
            horizontal
            height={300}
          />
        </ChartCard>

        <div className="space-y-4">
          <ChartCard title="Average Price by Travel Class">
            <BarChartWrapper data={data.priceByTravelClass} height={170} />
          </ChartCard>

          <ChartCard title="Average Price by Number of Stops">
            <BarChartWrapper data={data.priceByStops} height={170} />
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
