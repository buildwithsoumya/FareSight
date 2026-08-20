// Shared domain types for FareSight.
// These mirror the shapes the FastAPI backend exposes.

// ---------------------------------------------------------------------------
// PREDICTION
// ---------------------------------------------------------------------------

export interface PredictionRequest {
  airline: string
  source: string
  destination: string
  departure_date: string // YYYY-MM-DD
  departure_time: string // e.g. "10:30 AM" or "07:05"
  arrival_time: string // e.g. "12:45 PM" or "12:55"
  duration: string // e.g. "2h 15m", "177 min", or decimal hours
  total_stops: number
  distance_km: number
  travel_class: string
  days_before_departure: number
  season: string
  weekday: string
  aircraft_type: string
  booking_channel: string
  passenger_count: number
}

export interface PredictionResponse {
  predicted_price: number
  currency: string
}

// ---------------------------------------------------------------------------
// HEALTH
// ---------------------------------------------------------------------------

export interface HealthResponse {
  status: string
  service: string
}

// ---------------------------------------------------------------------------
// ANALYTICS
// ---------------------------------------------------------------------------

export interface CategoryPricePoint {
  name: string
  average_price: number
}

export interface SummaryData {
  dataset: string
  rows: number
  valid_prices: number
  average_price: number
  median_price: number
  min_price: number
  max_price: number
  airlines: number
  sources: number
  destinations: number
}

export interface ScatterResponse {
  points: {
    duration_minutes?: number
    days_before_departure?: number
    price: number
  }[]
  correlation: number
}

export interface FeatureImportanceItem {
  feature: string
  importance: number
}

export interface ScatterPoint {
  x: number
  y: number
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
