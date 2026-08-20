import { useAsyncData } from '../hooks/useAsyncData'
import { getFeatureImportance } from '../services/api'
import ChartCard from '../components/cards/ChartCard'
import SectionHeader from '../components/common/SectionHeader'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorState from '../components/common/ErrorState'
import FeatureImportanceChart from '../components/charts/FeatureImportanceChart'

const MODEL_METRICS = [
  {
    name: 'Linear Regression',
    mae: 23097.4,
    rmse: 45456.32,
    r2: 0.6238,
    source: 'Baseline experiment',
  },
  {
    name: 'Random Forest',
    mae: 15394.65,
    rmse: 42214.69,
    r2: 0.6756,
    source: 'Baseline experiment',
  },
  {
    name: 'HistGradientBoosting',
    mae: 13998.13,
    rmse: 40133.49,
    r2: 0.7068,
    source: 'Baseline experiment',
  },
  {
    name: 'HistGradientBoosting (tuned)',
    mae: 13851.14,
    rmse: 40048.69,
    r2: 0.708,
    source: 'Final selected model',
  },
]

const INSIGHTS = [
  {
    title: 'Travel class strongly relates to fare',
    summary:
      'First and Business class flights cost roughly 2x Economy on average.',
    detail:
      'Mean fares by class: Economy ₹59,668, Premium Economy ₹81,857, Business ₹115,828, First ₹133,873. Travel class also appears repeatedly among the strongest model features.',
    category: 'Fare drivers',
  },
  {
    title: 'Distance and duration dominate the model',
    summary:
      'Duration_Minutes and Distance_km are the strongest predictors.',
    detail:
      'The model assigns the largest share of feature importance to Duration and Distance — together more than half of all predictive weight.',
    category: 'Model insights',
  },
  {
    title: 'Distance and duration are near-identical',
    summary: 'Pearson correlation ≈ 0.99 between Distance_km and Duration_Minutes.',
    detail:
      'Longer routes take longer. The model treats them as complementary signals and they rank 1 and 2 in feature importance.',
    category: 'Data insight',
  },
  {
    title: 'Booking earlier tends to lower fares',
    summary:
      'Days_Before_Departure is a meaningful predictor with a negative relationship.',
    detail:
      'Fares booked closer to departure are generally higher. This feature ranks 4th in importance.',
    category: 'Booking timing',
  },
  {
    title: 'More stops means higher average fares',
    summary: 'Fares increase on average with each additional stop.',
    detail:
      'Mean fare rises from ₹61,603 (non-stop) to ₹79,447 (1 stop) and ₹84,661 (2 stops) — though route length also increases with stops.',
    category: 'Route effect',
  },
  {
    title: 'Booking channel matters little',
    summary: 'Channel differences are small — under ₹1,200 across all options.',
    detail:
      'Means range from ₹72,521 (Airport Counter) to ₹73,693 (Third-Party). Channel is not a major fare driver.',
    category: 'Data insight',
  },
  {
    title: 'Seasonal variation is modest',
    summary: 'Summer is the most expensive season; Monsoon the cheapest.',
    detail:
      'Summer ₹77,101 vs Monsoon ₹69,252 (~11% gap). Real but smaller than class, distance, or duration effects.',
    category: 'Booking timing',
  },
  {
    title: 'Gradient boosting beats the baselines',
    summary: 'Final R² 0.708 vs Linear 0.624 and Random Forest 0.676.',
    detail:
      'The tuned HistGradientBoostingRegressor achieves MAE ₹13,851 and RMSE ₹40,049 on the held-out test split.',
    category: 'Model insights',
  },
]

const CATEGORY_STYLES: Record<string, string> = {
  'Fare drivers': 'bg-brand-50 text-brand-700',
  'Data insight': 'bg-slate-100 text-slate-600',
  'Booking timing': 'bg-amber-50 text-amber-700',
  'Route effect': 'bg-emerald-50 text-emerald-700',
  'Model insights': 'bg-violet-50 text-violet-700',
}

function InsightCard({ insight }: { insight: (typeof INSIGHTS)[number] }) {
  const style = CATEGORY_STYLES[insight.category] ?? CATEGORY_STYLES['Data insight']
  return (
    <article className="card flex h-full flex-col p-5">
      <span className={`mb-3 self-start rounded-full px-2.5 py-0.5 text-[11px] font-medium ${style}`}>
        {insight.category}
      </span>
      <h3 className="text-sm font-semibold text-slate-800">{insight.title}</h3>
      <p className="mt-1.5 text-sm font-medium text-brand-700">{insight.summary}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{insight.detail}</p>
    </article>
  )
}

export default function Insights() {
  const { data, loading, error, reload } = useAsyncData(getFeatureImportance)

  if (loading) return <LoadingSpinner label="Loading model insights..." />
  if (error) return <ErrorState message={error} onRetry={reload} />

  return (
    <div className="space-y-8">
      {/* Feature importance */}
      <section>
        <SectionHeader
          title="What's driving fare estimates?"
          description="Model feature importance from the trained model — Duration and Distance dominate."
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ChartCard
            title="Model Feature Importance"
            description="Relative importance, normalized to the top feature. Model interpretation — not causal analysis."
            className="lg:col-span-2"
          >
            <FeatureImportanceChart data={data ?? []} />
          </ChartCard>

          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-800">
                Model comparison
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Test-set metrics from the training experiments.
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
                    {MODEL_METRICS.map((m) => (
                      <tr key={m.name}>
                        <td className="py-2.5 pr-3 font-medium text-slate-800">
                          {m.name}
                        </td>
                        <td className="py-2.5 pr-3 text-slate-600">
                          ₹{Math.round(m.mae).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 pr-3 text-slate-600">
                          ₹{Math.round(m.rmse).toLocaleString('en-IN')}
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
          {INSIGHTS.map((insight) => (
            <InsightCard key={insight.title} insight={insight} />
          ))}
        </div>
      </section>
    </div>
  )
}
