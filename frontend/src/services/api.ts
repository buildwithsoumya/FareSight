// -----------------------------------------------------------------------------
// API SERVICE LAYER
// -----------------------------------------------------------------------------
// Central Axios configuration for the FareSight FastAPI backend.
//
// Live endpoints:
//   GET  /                          — welcome message
//   GET  /api/health                — health check
//   POST /api/predict               — fare prediction
//   GET  /api/analytics/summary     — dataset summary
//   GET  /api/analytics/airlines    — avg fare by airline
//   GET  /api/analytics/classes     — avg fare by travel class
//   GET  /api/analytics/stops       — avg fare by stops
//   GET  /api/analytics/seasons     — avg fare by season
//   GET  /api/analytics/sources     — avg fare by source
//   GET  /api/analytics/destinations
//   GET  /api/analytics/booking-channels
//   GET  /api/analytics/duration    — fare vs duration scatter
//   GET  /api/analytics/days-before-departure
//   GET  /api/analytics/feature-importance
//
// To point at a deployed backend, set VITE_API_BASE_URL (see .env.example).
// -----------------------------------------------------------------------------

import axios from 'axios'
import type {
  CategoryPricePoint,
  FeatureImportanceItem,
  HealthResponse,
  PredictionRequest,
  PredictionResponse,
  RouteInfo,
  ScatterResponse,
  SummaryData,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// -----------------------------------------------------------------------------
// HEALTH
// -----------------------------------------------------------------------------

export async function checkHealth(): Promise<HealthResponse> {
  const { data } = await apiClient.get<HealthResponse>('/api/health')
  return data
}

// -----------------------------------------------------------------------------
// PREDICTION
// -----------------------------------------------------------------------------

export async function predictFare(
  payload: PredictionRequest,
): Promise<PredictionResponse> {
  const { data } = await apiClient.post<PredictionResponse>('/api/predict', payload)
  return data
}

// -----------------------------------------------------------------------------
// ANALYTICS
// -----------------------------------------------------------------------------

export async function getSummary(): Promise<SummaryData> {
  const { data } = await apiClient.get<SummaryData>('/api/analytics/summary')
  return data
}

export async function getAirlineAnalytics(): Promise<CategoryPricePoint[]> {
  const { data } = await apiClient.get<CategoryPricePoint[]>('/api/analytics/airlines')
  return data
}

export async function getClassAnalytics(): Promise<CategoryPricePoint[]> {
  const { data } = await apiClient.get<CategoryPricePoint[]>('/api/analytics/classes')
  return data
}

export async function getStopsAnalytics(): Promise<CategoryPricePoint[]> {
  const { data } = await apiClient.get<CategoryPricePoint[]>('/api/analytics/stops')
  return data
}

export async function getSeasonAnalytics(): Promise<CategoryPricePoint[]> {
  const { data } = await apiClient.get<CategoryPricePoint[]>('/api/analytics/seasons')
  return data
}

export async function getSourceAnalytics(): Promise<CategoryPricePoint[]> {
  const { data } = await apiClient.get<CategoryPricePoint[]>('/api/analytics/sources')
  return data
}

export async function getDestinationAnalytics(): Promise<CategoryPricePoint[]> {
  const { data } = await apiClient.get<CategoryPricePoint[]>(
    '/api/analytics/destinations',
  )
  return data
}

export async function getBookingChannelAnalytics(): Promise<CategoryPricePoint[]> {
  const { data } = await apiClient.get<CategoryPricePoint[]>(
    '/api/analytics/booking-channels',
  )
  return data
}

export async function getDurationAnalytics(): Promise<ScatterResponse> {
  const { data } = await apiClient.get<ScatterResponse>('/api/analytics/duration')
  return data
}

export async function getDaysBeforeDepartureAnalytics(): Promise<ScatterResponse> {
  const { data } = await apiClient.get<ScatterResponse>(
    '/api/analytics/days-before-departure',
  )
  return data
}

export async function getFeatureImportance(): Promise<FeatureImportanceItem[]> {
  const { data } = await apiClient.get<FeatureImportanceItem[]>(
    '/api/analytics/feature-importance',
  )
  return data
}

export async function getRouteInfo(
  source: string,
  destination: string,
  stops?: number,
): Promise<RouteInfo> {
  const params = new URLSearchParams({ source, destination })
  if (stops !== undefined) params.set('stops', String(stops))
  const { data } = await apiClient.get<RouteInfo>(
    `/api/routes/info?${params.toString()}`,
  )
  return data
}
