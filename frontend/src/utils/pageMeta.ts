interface PageMeta {
  title: string
  subtitle: string
}

const PAGE_META: Record<string, PageMeta> = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Operational overview of the FareSight dataset',
  },
  '/prediction': {
    title: 'Predict Fare',
    subtitle: 'Estimate a fare from raw flight characteristics',
  },
  '/analytics': {
    title: 'Fare Analytics',
    subtitle: 'Explore historical pricing patterns in the FareSight dataset',
  },
  '/insights': {
    title: 'Model Insights',
    subtitle: 'Performance metrics across candidate predictive models',
  },
  '/about': {
    title: 'About FareSight',
    subtitle: 'System architecture and machine-learning pipeline',
  },
}

const FALLBACK: PageMeta = {
  title: 'FareSight',
  subtitle: 'AI Travel Analyst',
}

export function getPageMeta(pathname: string): PageMeta {
  return PAGE_META[pathname] ?? FALLBACK
}
