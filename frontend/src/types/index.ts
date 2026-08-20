// Shared domain types for FareSight.
// These mirror the shapes the FastAPI backend will expose
// (see frontend/src/services/api.ts for the integration plan).

export interface KpiSummary {
  averagePrice: number
  minPrice: number
  maxPrice: number
  flightsAnalyzed: number
  medianPrice: number
}

export interface PriceDistributionPoint {
  lowerBound: number
  upperBound: number
  count: number
}

export interface CategoryPricePoint {
  name: string
  averagePrice: number
  flightCount?: number
}

export interface ScatterPoint {
  x: number
  y: number
}

export interface AnalyticsFilters {
  airline: string
  source: string
  destination: string
  travelClass: string
  totalStops: string
  bookingChannel: string
  season: string
}

export interface AnalyticsData {
  priceVsDuration: ScatterPoint[]
  priceVsDistance: ScatterPoint[]
  priceVsDaysBeforeDeparture: ScatterPoint[]
  priceBySource: CategoryPricePoint[]
  priceByDestination: CategoryPricePoint[]
  priceByBookingChannel: CategoryPricePoint[]
  priceBySeason: CategoryPricePoint[]
}

export interface DashboardData {
  kpis: KpiSummary
  priceDistribution: PriceDistributionPoint[]
  priceByAirline: CategoryPricePoint[]
  priceByTravelClass: CategoryPricePoint[]
  priceByStops: CategoryPricePoint[]
}

export interface FeatureImportanceItem {
  feature: string
  importance: number
}

export interface ModelMetrics {
  name: string
  mae: number
  rmse: number
  r2: number
}

export interface InsightItem {
  title: string
  summary: string
  detail: string
  category: string
}

export interface InsightsData {
  insights: InsightItem[]
  featureImportance: FeatureImportanceItem[]
  modelMetrics: ModelMetrics[]
}

export interface PredictionRequest {
  airline: string
  source: string
  destination: string
  travelClass: string
  totalStops: number
  distanceKm: number
  daysBeforeDeparture: number
  passengerCount: number
  season: string
  weekday: string
  aircraftType: string
  bookingChannel: string
  departureHour: number
  arrivalHour: number
  durationMinutes: number
}

export interface PredictionResponse {
  predictedPrice: number
  currency: string
  source: 'api' | 'mock'
  model?: string
}

export interface DatasetMetadata {
  datasetName: string
  description: string
  rows: number
  features: number
  target: string
}

// ---------------------------------------------------------------------------
// FORM OPTIONS — derived from the real FareSight dataset (flight_pricing_dataset.csv)
// ---------------------------------------------------------------------------

export const AIRLINES = [
  'Air India',
  'Airasia India',
  'British Airways',
  'Emirates',
  'Etihad Airways',
  'Gofirst',
  'Indigo',
  'Lufthansa',
  'Qatar Airways',
  'Singapore Airlines',
  'Spicejet',
  'Thai Airways',
  'Vistara',
] as const

export const CITIES = [
  'Ahmedabad',
  'Bangalore',
  'Bangkok',
  'Chennai',
  'Delhi',
  'Doha',
  'Dubai',
  'Frankfurt',
  'Goa',
  'Hyderabad',
  'Jaipur',
  'Kolkata',
  'London',
  'Mumbai',
  'New York',
  'Pune',
  'Singapore',
  'Sydney',
] as const

export const TRAVEL_CLASSES = [
  'Economy',
  'Premium Economy',
  'Business',
  'First',
] as const

export const SEASONS = ['Winter', 'Spring', 'Summer', 'Autumn', 'Monsoon'] as const

export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export const AIRCRAFT_TYPES = [
  'ATR 72',
  'Airbus A320',
  'Airbus A321',
  'Airbus A350',
  'Airbus A380',
  'Boeing 737',
  'Boeing 777',
  'Boeing 787 Dreamliner',
] as const

export const BOOKING_CHANNELS = [
  'Airport Counter',
  'Mobile App',
  'Third-Party',
  'Travel Agent',
  'Website',
] as const

export const STOP_OPTIONS = [
  { value: '0', label: 'Non-stop (0)' },
  { value: '1', label: '1 stop' },
  { value: '2', label: '2 stops' },
] as const
