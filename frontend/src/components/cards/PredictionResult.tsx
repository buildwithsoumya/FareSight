import type { PredictionResponse } from '../../types'
import { formatINR } from '../../utils/format'

interface PredictionResultProps {
  result: PredictionResponse
}

export default function PredictionResult({ result }: PredictionResultProps) {
  const isMock = result.source === 'mock'

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 bg-brand-50 px-6 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
          Estimated Flight Price
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
          {formatINR(result.predictedPrice)}
        </p>
      </div>

      <div className="space-y-4 px-6 py-5">
        {isMock ? (
          <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <span aria-hidden="true">ℹ️</span>
            <p className="text-xs leading-relaxed text-amber-800">
              This is a <strong>mock estimate</strong> from a transparent
              heuristic, not the trained ML model. The FastAPI{' '}
              <code className="rounded bg-amber-100 px-1">/api/predict</code>{' '}
              endpoint is not connected yet — the prediction form is wired
              through the API service layer, so it will use the real model once
              the backend is live.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            Predicted by {result.model ?? 'the trained ML model'}.
          </div>
        )}

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            How this works
          </h3>
          <ol className="mt-2 list-inside list-decimal space-y-1.5 text-sm text-slate-600">
            <li>Your flight details are sent to the prediction API.</li>
            <li>The backend runs the same preprocessing as the training pipeline.</li>
            <li>The trained regression model returns an estimated fare.</li>
          </ol>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            What affects the estimate
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Model feature importance shows <strong>Duration_Minutes</strong> and{' '}
            <strong>Distance_km</strong> dominate, followed by travel class and
            days before departure. Those inputs have the biggest influence on
            the price you see here.
          </p>
        </div>
      </div>
    </div>
  )
}
