import SectionHeader from '../components/common/SectionHeader'
import Icon, { type IconName } from '../components/common/Icon'

interface TechItem {
  name: string
  description: string
  icon: IconName
}

const TECH_STACK: TechItem[] = [
  {
    name: 'Python',
    description: 'Data pipeline, feature engineering and model training.',
    icon: 'code',
  },
  {
    name: 'Scikit-learn',
    description: 'HistGradientBoosting, preprocessing and evaluation.',
    icon: 'cpu',
  },
  {
    name: 'FastAPI',
    description: 'Typed REST API with Pydantic validation and OpenAPI docs.',
    icon: 'server',
  },
  {
    name: 'React + Vite',
    description: 'TypeScript dashboard with Recharts visualizations.',
    icon: 'dashboard',
  },
]

interface PipelineStep {
  title: string
  description: string
  icon: IconName
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    title: 'Dataset Preprocessing',
    description:
      'Duplicate removal, string normalization, date/time/duration parsing, and categorical cleanup across 100,000 rows.',
    icon: 'filter',
  },
  {
    title: 'Exploratory Data Analysis',
    description:
      'Eleven visualizations establishing the fare drivers: travel class, distance, duration, stops, season and lead time.',
    icon: 'sparkles',
  },
  {
    title: 'Hyperparameter Tuning',
    description:
      'HistGradientBoosting tuned to learning_rate 0.05, max_iter 400, max_leaf_nodes 63, l2_regularization 1.0.',
    icon: 'sliders',
  },
]

const FLOW: { step: string; icon: IconName }[] = [
  { step: 'User', icon: 'user' },
  { step: 'React UI', icon: 'dashboard' },
  { step: 'FastAPI', icon: 'server' },
  { step: 'Prediction Engine', icon: 'zap' },
  { step: 'Feature Engineering', icon: 'sliders' },
  { step: 'ML Pipeline', icon: 'cpu' },
  { step: 'Prediction', icon: 'banknote' },
]

export default function About() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="About FareSight"
        description="An AI travel-fare analyst: explore historical pricing, understand the drivers, and predict fares from raw flight details."
      />

      <section className="card p-5 md:p-6">
        <h3 className="text-sm font-semibold text-slate-900">Project Overview</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          FareSight cleans and explores a 100,000-row flight-pricing dataset,
          trains regression models to predict fares, and exposes the result
          through a FastAPI backend and a React dashboard. The project
          demonstrates the complete ML lifecycle — preprocessing, EDA, feature
          engineering, model comparison, hyperparameter tuning, model selection,
          a prediction REST API, and a production-style frontend.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Architecture Flow</h3>
        <div className="card flex flex-wrap items-center gap-2 p-5">
          {FLOW.map(({ step, icon }, index) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-brand-600">
                  <Icon name={icon} size={15} />
                </span>
                <span className="text-[13px] font-medium text-slate-700">
                  {step}
                </span>
              </div>
              {index < FLOW.length - 1 && (
                <span className="text-slate-300">
                  <Icon name="arrow-right" size={14} />
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Tech Stack</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TECH_STACK.map((tech) => (
            <div key={tech.name} className="card card-hover p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon name={tech.icon} size={19} />
              </span>
              <h4 className="mt-3 text-[15px] font-semibold text-slate-900">
                {tech.name}
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">ML Pipeline Details</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.title} className="card card-hover p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon name={step.icon} size={19} />
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  Step {i + 1}
                </span>
              </div>
              <h4 className="mt-3 text-[15px] font-semibold text-slate-900">
                {step.title}
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
