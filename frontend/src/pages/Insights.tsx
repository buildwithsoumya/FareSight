import { useAsyncData } from '../hooks/useAsyncData'
import { getFeatureImportance } from '../services/api'
import ChartCard from '../components/cards/ChartCard'
import SectionHeader from '../components/common/SectionHeader'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorState from '../components/common/ErrorState'
import FeatureImportanceChart from '../components/charts/FeatureImportanceChart'
import BarChartWrapper from '../components/charts/BarChartWrapper'
import Icon, { type IconName } from '../components/common/Icon'

interface ModelEntry {
  name: string
  icon: IconName
  mae: number
  rmse: number
  r2: number
  selected: boolean
}

const MODELS: ModelEntry[] = [
  {
    name: 'Linear Regression',
    icon: 'activity',
    mae: 23097.4,
    rmse: 45456.32,
    r2: 0.6238,
    selected: false,
  },
  {
    name: 'Random Forest',
    icon: 'bar-chart',
    mae: 15394.65,
    rmse: 42214.69,
    r2: 0.6756,
    selected: false,
  },
  {
    name: 'HistGradientBoosting',
    icon: 'cpu',
    mae: 13851.14,
    rmse: 40048.69,
    r2: 0.708,
    selected: true,
  },
]

const HYPERPARAMS = [
  { label: 'learning_rate', value: '0.05' },
  { label: 'max_iter', value: '400' },
  { label: 'max_leaf_nodes', value: '63' },
  { label: 'l2_regularization', value: '1.0' },
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
  const style =
    CATEGORY_STYLES[insight.category] ?? CATEGORY_STYLES['Data insight']
  return (
    <article className="card card-hover flex h-full flex-col p-5">
      <span
        className={`mb-3 self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
      >
        {insight.category}
      </span>
      <h3 className="text-[15px] font-semibold leading-snug text-slate-900">
        {insight.title}
      </h3>
      <p className="mt-1.5 text-sm font-medium text-brand-600">{insight.summary}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">{insight.detail}</p>
    </article>
  )
}

function MetricBar({
  label,
  value,
  max,
  selected,
}: {
  label: string
  value: string
  max: number
  selected: boolean
}) {
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ''))
  const pct = Number.isFinite(numeric) ? Math.min((numeric / max) * 100, 100) : 0
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span
          className={`text-sm font-semibold tabular-nums ${
            selected ? 'text-brand-600' : 'text-slate-800'
          }`}
        >
          {value}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${selected ? 'bg-brand-600' : 'bg-slate-300'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function Insights() {
  const { data, loading, error, reload } = useAsyncData(getFeatureImportance)

  if (loading) return <LoadingSpinner label="Loading model insights..." />
  if (error) return <ErrorState message={error} onRetry={reload} />

  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <SectionHeader
          title="Model Comparison"
          description="Performance metrics across candidate predictive models, evaluated on the held-out test split."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {MODELS.map((model) => (
            <div
              key={model.name}
              className={`card card-hover relative flex flex-col gap-4 p-5 ${
                model.selected ? 'border-brand-300 ring-1 ring-brand-200' : ''
              }`}
            >
              {model.selected && (
                <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                  <Icon name="check" size={11} strokeWidth={3} />
                  Selected
                </span>
              )}
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    model.selected
                      ? 'bg-brand-50 text-brand-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon name={model.icon} size={17} />
                </span>
                <h3 className="text-sm font-semibold text-slate-900">
                  {model.name}
                </h3>
              </div>
              <div className="space-y-3">
                <MetricBar
                  label="MAE"
                  value={`₹${Math.round(model.mae).toLocaleString('en-IN')}`}
                  max={23097.4}
                  selected={model.selected}
                />
                <MetricBar
                  label="RMSE"
                  value={`₹${Math.round(model.rmse).toLocaleString('en-IN')}`}
                  max={45456.32}
                  selected={model.selected}
                />
                <MetricBar
                  label="R² Score"
                  value={model.r2.toFixed(3)}
                  max={1}
                  selected={model.selected}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5 md:p-6">
        <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Relative Performance Analysis
          </h3>
          <span className="text-xs text-slate-400">Test-set metrics</span>
        </div>
        <div className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-4">
            <p className="text-sm leading-relaxed text-slate-600">
              HistGradientBoosting demonstrates superior performance across all
              primary metrics. The reduction in Mean Absolute Error (MAE) by{' '}
              <strong className="font-semibold text-brand-600">~40%</strong>{' '}
              compared to baseline Linear Regression indicates robust handling of
              non-linear relationships and outlier resilience within the fare
              dataset.
            </p>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-slate-700">
                <Icon name="sliders" size={14} className="text-slate-400" />
                Final hyperparameters
              </p>
              <div className="flex flex-wrap gap-2">
                {HYPERPARAMS.map((p) => (
                  <span
                    key={p.label}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600"
                  >
                    {p.label} = {p.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <h4 className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-slate-400">
              R² Score Comparison
            </h4>
            <BarChartWrapper
              data={MODELS.map((m) => ({ name: m.name, average_price: m.r2 }))}
              height={180}
              color="#8b5cf6"
            />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader
          title="Feature Importance"
          description="Relative importance from the trained model. Model interpretation — not causal analysis."
        />
        <ChartCard
          title="Top Features by Importance"
          icon="sparkles"
          meta="Normalized to top feature"
          heightClass="h-[360px]"
        >
          <FeatureImportanceChart data={data ?? []} height={330} />
        </ChartCard>
      </section>

      <section className="space-y-5">
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
