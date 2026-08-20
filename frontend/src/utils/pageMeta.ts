interface PageMeta {
  title: string
  subtitle: string
}

const PAGE_META: Record<string, PageMeta> = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'High-level view of the flight-price dataset',
  },
  '/analytics': {
    title: 'Analytics',
    subtitle: 'Interactive exploration of the factors that drive flight prices',
  },
  '/prediction': {
    title: 'Price Prediction',
    subtitle: 'Estimate a flight price from its characteristics',
  },
  '/insights': {
    title: 'Insights',
    subtitle: 'Key findings from exploratory analysis and the ML model',
  },
}

const FALLBACK: PageMeta = {
  title: 'FareSight',
  subtitle: 'AI Travel Analyst',
}

export function getPageMeta(pathname: string): PageMeta {
  return PAGE_META[pathname] ?? FALLBACK
}
