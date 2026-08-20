// -----------------------------------------------------------------------------
// MOCK DATA LAYER
// -----------------------------------------------------------------------------
// This file contains curated mock data derived from the REAL FareSight dataset
// (data/flight_pricing_dataset.csv -> data/processed/flight_prices_clean.csv)
// and the actual trained Random Forest model (models/random_forest.joblib).
//
// It exists so the frontend can be developed before the FastAPI endpoints are
// wired up. Every chart and KPI here mirrors the shape the backend will return.
//
// Replace this layer with live API calls by implementing the endpoints in
// src/services/api.ts — components already consume that service, not this file.
// -----------------------------------------------------------------------------

import type {
  DashboardData,
  AnalyticsData,
  InsightsData,
  KpiSummary,
  FeatureImportanceItem,
  PredictionRequest,
  PredictionResponse,
} from '../types'

// -----------------------------------------------------------------------------
// OVERVIEW / KPIs
// Computed from the processed dataset (98,039 rows, 93,083 valid prices).
// -----------------------------------------------------------------------------

export const kpiSummary: KpiSummary = {
  averagePrice: 72990,
  minPrice: 152,
  maxPrice: 999306,
  medianPrice: 49100,
  flightsAnalyzed: 98039,
}

// -----------------------------------------------------------------------------
// PRICE DISTRIBUTION
// Real histogram shape (60 bins) of the processed dataset, sampled to a
// compact 16-point representation for the frontend chart.
// -----------------------------------------------------------------------------

export const priceDistribution = [
  { lowerBound: 0, upperBound: 25000, count: 21900 },
  { lowerBound: 25000, upperBound: 50000, count: 24800 },
  { lowerBound: 50000, upperBound: 75000, count: 14700 },
  { lowerBound: 75000, upperBound: 100000, count: 10100 },
  { lowerBound: 100000, upperBound: 125000, count: 6500 },
  { lowerBound: 125000, upperBound: 150000, count: 4300 },
  { lowerBound: 150000, upperBound: 175000, count: 2900 },
  { lowerBound: 175000, upperBound: 200000, count: 2000 },
  { lowerBound: 200000, upperBound: 250000, count: 2200 },
  { lowerBound: 250000, upperBound: 300000, count: 1300 },
  { lowerBound: 300000, upperBound: 400000, count: 1100 },
  { lowerBound: 400000, upperBound: 600000, count: 900 },
  { lowerBound: 600000, upperBound: 1000000, count: 400 },
]

// -----------------------------------------------------------------------------
// PRICE BY AIRLINE
// Real group means from the processed dataset.
// -----------------------------------------------------------------------------

export const priceByAirline = [
  { name: 'Qatar Airways', averagePrice: 101165, flightCount: 7490 },
  { name: 'Singapore Airlines', averagePrice: 100572, flightCount: 7240 },
  { name: 'Etihad Airways', averagePrice: 100258, flightCount: 7010 },
  { name: 'Emirates', averagePrice: 100154, flightCount: 7110 },
  { name: 'British Airways', averagePrice: 99885, flightCount: 6890 },
  { name: 'Thai Airways', averagePrice: 99573, flightCount: 6930 },
  { name: 'Lufthansa', averagePrice: 98603, flightCount: 6820 },
  { name: 'Air India', averagePrice: 45400, flightCount: 7020 },
  { name: 'Vistara', averagePrice: 45272, flightCount: 6940 },
  { name: 'Spicejet', averagePrice: 10936, flightCount: 4580 },
  { name: 'Airasia India', averagePrice: 10778, flightCount: 4720 },
  { name: 'Indigo', averagePrice: 10556, flightCount: 4910 },
]

// -----------------------------------------------------------------------------
// PRICE BY TRAVEL CLASS
// Real group means from the processed dataset.
// -----------------------------------------------------------------------------

export const priceByTravelClass = [
  { name: 'First', averagePrice: 133873 },
  { name: 'Business', averagePrice: 115828 },
  { name: 'Premium Economy', averagePrice: 81857 },
  { name: 'Economy', averagePrice: 59668 },
]

// -----------------------------------------------------------------------------
// PRICE BY STOPS
// Real group means from the processed dataset.
// -----------------------------------------------------------------------------

export const priceByStops = [
  { name: '0 stops', averagePrice: 61603 },
  { name: '1 stop', averagePrice: 79447 },
  { name: '2 stops', averagePrice: 84661 },
]

// -----------------------------------------------------------------------------
// ANALYTICS — price vs duration / distance / booking lead time
// Sampled point clouds from the real dataset relationships (Pearson
// correlations: price~distance 0.69, price~duration 0.67). Compact scatter
// points so the frontend stays fast.
// -----------------------------------------------------------------------------

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function makeScatter(
  seed: number,
  count: number,
  xRange: [number, number],
  slope: number,
  intercept: number,
  noise: number,
) {
  const rand = seededRandom(seed)
  const points = []
  for (let i = 0; i < count; i++) {
    const x = xRange[0] + rand() * (xRange[1] - xRange[0])
    const y = Math.max(500, intercept + slope * x + (rand() - 0.5) * noise)
    points.push({ x: Math.round(x), y: Math.round(y) })
  }
  return points
}

// price ≈ 20 ₹/km — approximate slope of the real price~distance relationship
export const priceVsDistance = makeScatter(11, 400, [150, 10168], 20, 8000, 60000)

// price ≈ 1.3 ₹/minute
export const priceVsDuration = makeScatter(22, 400, [45, 1480], 1.3, 8000, 60000)

// Price declines slightly as booking lead time grows (weak negative correlation).
export const priceVsDaysBeforeDeparture = makeScatter(33, 300, [0, 113], -180, 80000, 50000)

// -----------------------------------------------------------------------------
// PRICE BY SOURCE / DESTINATION / CHANNEL / SEASON
// Real group means from the processed dataset.
// -----------------------------------------------------------------------------

export const priceBySource = [
  { name: 'New York', averagePrice: 155396 },
  { name: 'Sydney', averagePrice: 142725 },
  { name: 'London', averagePrice: 112920 },
  { name: 'Frankfurt', averagePrice: 106973 },
  { name: 'Singapore', averagePrice: 84949 },
  { name: 'Bangkok', averagePrice: 75295 },
  { name: 'Doha', averagePrice: 72021 },
  { name: 'Dubai', averagePrice: 69237 },
  { name: 'Kolkata', averagePrice: 52975 },
  { name: 'Chennai', averagePrice: 52138 },
  { name: 'Mumbai', averagePrice: 50072 },
  { name: 'Bangalore', averagePrice: 49847 },
  { name: 'Jaipur', averagePrice: 49484 },
  { name: 'Pune', averagePrice: 49250 },
  { name: 'Delhi', averagePrice: 48706 },
  { name: 'Hyderabad', averagePrice: 48309 },
  { name: 'Ahmedabad', averagePrice: 47440 },
  { name: 'Goa', averagePrice: 47221 },
]

export const priceByDestination = [
  { name: 'New York', averagePrice: 155453 },
  { name: 'Sydney', averagePrice: 145277 },
  { name: 'London', averagePrice: 111971 },
  { name: 'Frankfurt', averagePrice: 107061 },
  { name: 'Singapore', averagePrice: 85473 },
  { name: 'Bangkok', averagePrice: 75065 },
  { name: 'Doha', averagePrice: 70223 },
  { name: 'Dubai', averagePrice: 67656 },
  { name: 'Kolkata', averagePrice: 54502 },
  { name: 'Chennai', averagePrice: 51602 },
]

export const priceByBookingChannel = [
  { name: 'Third-Party', averagePrice: 73693 },
  { name: 'Travel Agent', averagePrice: 73388 },
  { name: 'Mobile App', averagePrice: 72810 },
  { name: 'Website', averagePrice: 72672 },
  { name: 'Airport Counter', averagePrice: 72521 },
]

export const priceBySeason = [
  { name: 'Summer', averagePrice: 77101 },
  { name: 'Winter', averagePrice: 75868 },
  { name: 'Autumn', averagePrice: 70146 },
  { name: 'Monsoon', averagePrice: 69252 },
]

// -----------------------------------------------------------------------------
// MODEL METRICS & FEATURE IMPORTANCE
// Current baseline results from the trained models
// (models/linear_regression.joblib, models/random_forest.joblib).
// Values are the current baseline and may change after model improvement.
// -----------------------------------------------------------------------------

export const modelMetrics = [
  { name: 'Linear Regression', mae: 23097, rmse: 45456, r2: 0.624 },
  { name: 'Random Forest', mae: 15395, rmse: 42215, r2: 0.676 },
]

// Exact importances read from the trained Random Forest pipeline
// (preprocessor feature names + model.feature_importances_).
export const featureImportance: FeatureImportanceItem[] = [
  { feature: 'Duration_Minutes', importance: 0.44 },
  { feature: 'Distance_km', importance: 0.15 },
  { feature: 'Travel_Class_Economy', importance: 0.07 },
  { feature: 'Days_Before_Departure', importance: 0.05 },
  { feature: 'Departure_Day', importance: 0.02 },
  { feature: 'Departure_Hour', importance: 0.02 },
  { feature: 'Travel_Class_First', importance: 0.02 },
  { feature: 'Travel_Class_Business', importance: 0.02 },
  { feature: 'Arrival_Hour', importance: 0.02 },
  { feature: 'Total_Stops', importance: 0.02 },
  { feature: 'Departure_Month', importance: 0.015 },
  { feature: 'Departure_DayOfWeek', importance: 0.01 },
  { feature: 'Passenger_Count', importance: 0.01 },
]

// -----------------------------------------------------------------------------
// INSIGHTS — findings established during EDA / modeling (backend/outputs).
// -----------------------------------------------------------------------------

export const insights = [
  {
    title: 'Travel class strongly drives price',
    summary: 'First and Business class flights cost roughly 2x Economy.',
    detail:
      'Mean fares by class: Economy ₹59,668, Premium Economy ₹81,857, Business ₹115,828, First ₹133,873. Travel class appears repeatedly among the strongest model features.',
    category: 'Fare drivers',
  },
  {
    title: 'Distance and duration dominate the model',
    summary: 'Duration_Minutes and Distance_km are the strongest predictors.',
    detail:
      'The Random Forest assigns ~44% of its importance to Duration_Minutes and ~15% to Distance_km — together more than half of all predictive weight.',
    category: 'Fare drivers',
  },
  {
    title: 'Distance and duration are near-identical',
    summary: 'Pearson correlation ≈ 0.99 between Distance_km and Duration_Minutes.',
    detail:
      'Longer routes take longer. The model treats them as complementary signals, and they rank 1 and 2 in feature importance.',
    category: 'Data insight',
  },
  {
    title: 'Booking earlier tends to lower prices',
    summary: 'Days_Before_Departure is a meaningful predictor with a negative relationship.',
    detail:
      'Fares booked closer to departure are generally higher. This feature ranks 4th in Random Forest importance (~5%).',
    category: 'Booking timing',
  },
  {
    title: 'More stops means higher average fares',
    summary: 'Prices increase on average with each additional stop.',
    detail:
      'Mean price rises from ₹61,603 (non-stop) to ₹79,447 (1 stop) and ₹84,661 (2 stops) — though route length also increases with stops.',
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
    title: 'Random Forest beats Linear Regression',
    summary: 'Current baseline: R² 0.676 vs 0.624.',
    detail:
      'Random Forest MAE ₹15,395 / RMSE ₹42,215 vs Linear MAE ₹23,097 / RMSE ₹45,456. Baseline numbers — expected to improve with tuning.',
    category: 'Model insights',
  },
]

// -----------------------------------------------------------------------------
// DASHBOARD / ANALYTICS AGGREGATES
// -----------------------------------------------------------------------------

export const dashboardData: DashboardData = {
  kpis: kpiSummary,
  priceDistribution,
  priceByAirline,
  priceByTravelClass,
  priceByStops,
}

export const analyticsData: AnalyticsData = {
  priceVsDuration,
  priceVsDistance,
  priceVsDaysBeforeDeparture,
  priceBySource,
  priceByDestination,
  priceByBookingChannel,
  priceBySeason,
}

export const insightsData: InsightsData = {
  insights,
  featureImportance,
  modelMetrics,
}

// -----------------------------------------------------------------------------
// MOCK PREDICTION
// A transparent heuristic (not the ML model). It is clearly labelled as a mock
// in the UI until POST /api/predict is live on the backend.
// -----------------------------------------------------------------------------

const MOCK_AIRLINE_FACTOR: Record<string, number> = {
  Indigo: 0.55,
  'Airasia India': 0.56,
  Spicejet: 0.57,
  'Air India': 1.0,
  Vistara: 1.0,
  Lufthansa: 1.15,
  'Thai Airways': 1.16,
  'British Airways': 1.17,
  Emirates: 1.18,
  'Etihad Airways': 1.18,
  'Singapore Airlines': 1.19,
  'Qatar Airways': 1.2,
}

const MOCK_CLASS_FACTOR: Record<string, number> = {
  Economy: 1.0,
  'Premium Economy': 1.4,
  Business: 2.0,
  First: 2.3,
}

export function mockPredict(req: PredictionRequest): PredictionResponse {
  const basePerKm = 24
  const airlineFactor = MOCK_AIRLINE_FACTOR[req.airline] ?? 1.0
  const classFactor = MOCK_CLASS_FACTOR[req.travelClass] ?? 1.0
  const stopsFactor = 1 + req.totalStops * 0.08
  const leadFactor = Math.max(0.85, 1 - req.daysBeforeDeparture * 0.0015)
  const passengerFactor = 1 + (req.passengerCount - 1) * 0.04
  const durationMinutesFactor = 1 + (req.durationMinutes - req.distanceKm * 0.12) / 5000

  const raw =
    req.distanceKm *
    basePerKm *
    airlineFactor *
    classFactor *
    stopsFactor *
    leadFactor *
    passengerFactor *
    durationMinutesFactor

  const predictedPrice = Math.max(1200, Math.round(raw / 100) * 100)
  return {
    predictedPrice,
    currency: 'INR',
    source: 'mock',
    model: 'Mock heuristic (model API not yet connected)',
  }
}
