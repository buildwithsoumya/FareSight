import type { PredictionResponse } from '../../types'
import { formatINR } from '../../utils/format'
import Icon from '../common/Icon'

interface PredictionResultProps {
  result: PredictionResponse
}

const STEPS = [
  'Your flight details are sent to POST /api/predict.',
  'The backend derives the same engineered features used during training.',
  'The trained regression model returns an estimated fare.',
]

export default function PredictionResult({ result }: PredictionResultProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-brand-600 via-brand-600 to-violet-600 shadow-card">
        <div className="p-6">
          <div className="flex items-center gap-2 text-brand-100">
            <Icon name="zap" size={16} />
            <p className="text-[13px] font-semibold uppercase tracking-wider">
              Estimated Fare
            </p>
          </div>
          <p className="mt-2 text-5xl font-bold tracking-tight text-white">
            {formatINR(result.predicted_price)}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium text-white">
              {result.currency}
            </span>
            <span className="text-xs text-brand-100">
              HistGradientBoosting model
            </span>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3.5">
          <span className="mt-0.5 shrink-0 text-amber-500">
            <Icon name="info" size={18} />
          </span>
          <p className="text-sm leading-relaxed text-slate-600">
            ML-based estimate — actual fares vary with demand, promotions, and
            booking dynamics not present in a static dataset.
          </p>
        </div>

        <h3 className="mt-5 text-[13px] font-semibold uppercase tracking-wider text-slate-400">
          How this works
        </h3>
        <ol className="mt-3 space-y-3">
          {STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-slate-600">{step}</p>
            </li>
          ))}
        </ol>

        <h3 className="mt-5 text-[13px] font-semibold uppercase tracking-wider text-slate-400">
          What affects the estimate
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Feature importance shows <strong className="font-semibold text-slate-900">duration</strong> and{' '}
          <strong className="font-semibold text-slate-900">distance</strong> dominate,
          followed by travel class and days before departure.
        </p>
      </div>
    </div>
  )
}
