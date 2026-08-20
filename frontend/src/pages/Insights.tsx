import { useAsyncData } from '../hooks/useAsyncData'
import { getInsights } from '../services/api'
import { formatINR } from '../utils/format'
import ChartCard from '../components/cards/ChartCard'
import SectionHeader from '../components/common/SectionHeader'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorState from '../components/common/ErrorState'
import FeatureImportanceChart from '../components/charts/FeatureImportanceChart'
import type { InsightItem } from '../types'

const CATEGORY_STYLES: Record<string, string> = {
  'Fare drivers': 'bg-brand-50 text-brand-700',
  'Data insight': 'bg-slate-100 text-slate-600',
  'Booking timing': 'bg-amber-50 text-amber-700',
  'Route effect': 'bg-emerald-50 text-emerald-700',
  'Model insights': 'bg-violet-50 text-violet-700',
}

function InsightCard({ insight }: { insight: InsightItem }) {
  const style = CATEGORY_STYLES[insight.category] ?? CATEGORY_STYLES['Data insight']
  return (
    <article className="card flex h-full flex-col p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${style}`}>
          {insight.category}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{insight.title}</h3>
      <p className="mt-1.5 text-sm font-medium text-brand-700">{insight.summary}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{insight.detail}</p>
    </article>
  )
}

export default function Insights() {
  const { data, loading, error, reload } = useAsyncData(getInsights)

  if (loading) return <LoadingSpinner label="Loading insights..." />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!data) return null

  return (
    <div className="space-y-8">
      {/* Feature importance */}
      <section>
        <SectionHeader
          title="What's driving fares?"
          description="Random Forest feature importance from the trained model — Duration and Distance dominate."
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ChartCard
            title="Model Feature Importance"
            description="Relative importance, normalized to the top feature"
            className="lg:col-span-2"
          >
            <FeatureImportanceChart data={data.featureImportance} />
          </ChartCard>

          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-800">
                Model comparison
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Current baseline results — may change after tuning.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                      <th className="pb-2 pr-3 font-medium">Model</th>
                      <th className="pb-2 pr-3 font-medium">MAE</th>
                      <th className="pb-2 pr-3 font-medium">RMSE</th>
                      <th className="pb-2 font-medium">R²</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.modelMetrics.map((m) => (
                      <tr key={m.name}>
                        <td className="py-2.5 pr-3 font-medium text-slate-800">
                          {m.name}
                        </td>
                        <td className="py-2.5 pr-3 text-slate-600">
                          {formatINR(m.mae)}
                        </td>
                        <td className="py-2.5 pr-3 text-slate-600">
                          {formatINR(m.rmse)}
                        </td>
                        <td className="py-2.5 font-semibold text-slate-800">
                          {m.r2.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card bg-brand-50 p-5">
              <h3 className="text-sm font-semibold text-brand-900">
                Key takeaway
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-800">
                Distance and duration carry more than half of the model's
                predictive weight. Travel class and booking lead time come next.
                Seasonal and channel effects are real but secondary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Insight cards */}
      <section>
        <SectionHeader
          title="Findings"
          description="Key patterns established during exploratory analysis and modeling."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.insights.map((insight) => (
            <InsightCard key={insight.title} insight={insight} />
          ))}
        </div>
      </section>
    </div>
  )
}
