// -----------------------------------------------------------------------------
// API SERVICE LAYER
// -----------------------------------------------------------------------------
// Central Axios configuration for the FareSight FastAPI backend.
//
// Integration status:
//   GET  /api/overview  — endpoint does NOT exist on the backend yet
//   GET  /api/analysis  — endpoint does NOT exist on the backend yet
//   POST /api/predict   — endpoint does NOT exist on the backend yet
//
// The service functions below define the expected response shapes and attempt
// a live call, falling back to bundled mock data when the backend is
// unreachable (or when the endpoint is not implemented). Once the FastAPI
// routes are live, these functions work unchanged.
//
// To point at a deployed backend, set VITE_API_BASE_URL (see .env.example).
// -----------------------------------------------------------------------------

import axios from 'axios'
import type {
  AnalyticsData,
  AnalyticsFilters,
  DashboardData,
  InsightsData,
  PredictionRequest,
  PredictionResponse,
} from '../types'
import {
  analyticsData as mockAnalytics,
  dashboardData as mockDashboard,
  insightsData as mockInsights,
  mockPredict,
} from '../data/mockData'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// True when the app is using bundled mock data instead of live endpoints.
export const isMockMode = true

// -----------------------------------------------------------------------------
// Dashboard
// -----------------------------------------------------------------------------

export async function getOverview(): Promise<DashboardData> {
  try {
    const { data } = await apiClient.get<DashboardData>('/api/overview')
    return data
  } catch {
    // TODO: connect GET /api/overview when the FastAPI endpoint is live.
    return mockDashboard
  }
}

// -----------------------------------------------------------------------------
// Analytics
// -----------------------------------------------------------------------------

// Filtered analytics. The backend will accept filters as query parameters;
// the mock layer applies a light client-side filter to stay honest.
export async function getAnalytics(
  filters: AnalyticsFilters,
): Promise<AnalyticsData> {
  try {
    const { data } = await apiClient.get<AnalyticsData>('/api/analytics', {
      params: filters,
    })
    return data
  } catch {
    // TODO: connect GET /api/analytics when the FastAPI endpoint is live.
    return applyMockAnalyticsFilters(mockAnalytics, filters)
  }
}

// -----------------------------------------------------------------------------
// Prediction
// -----------------------------------------------------------------------------

export async function predictPrice(
  payload: PredictionRequest,
): Promise<PredictionResponse> {
  try {
    const { data } = await apiClient.post<PredictionResponse>('/api/predict', payload)
    return data
  } catch {
    // TODO: connect POST /api/predict when the FastAPI endpoint is live.
    // Clearly a mock fallback — the UI labels results from this path as such.
    return mockPredict(payload)
  }
}

// -----------------------------------------------------------------------------
// Insights
// -----------------------------------------------------------------------------

export async function getInsights(): Promise<InsightsData> {
  try {
    const { data } = await apiClient.get<InsightsData>('/api/insights')
    return data
  } catch {
    // TODO: connect GET /api/insights when the FastAPI endpoint is live.
    return mockInsights
  }
}

// -----------------------------------------------------------------------------
// Mock filter helper (removed once the backend serves filtered aggregates)
// -----------------------------------------------------------------------------

function applyMockAnalyticsFilters(
  data: AnalyticsData,
  filters: AnalyticsFilters,
): AnalyticsData {
  const active = Object.entries(filters).filter(([, value]) => value !== 'all')
  if (active.length === 0) return data

  // Charts that have a matching dimension get filtered;
  // scatter relationships are dataset-wide and stay intact.
  return {
    ...data,
    priceBySource: filterByName(data.priceBySource, filters.source, filters.airline),
    priceByDestination: filterByName(data.priceByDestination, filters.destination),
    priceByBookingChannel: filterByName(
      data.priceByBookingChannel,
      filters.bookingChannel,
    ),
    priceBySeason: filterByName(data.priceBySeason, filters.season),
  }
}

function filterByName(
  items: { name: string; averagePrice: number }[],
  ...allowed: string[]
) {
  const allowedValues = allowed.filter((v) => v && v !== 'all')
  if (allowedValues.length === 0) return items
  return items.filter((item) => allowedValues.includes(item.name))
}
