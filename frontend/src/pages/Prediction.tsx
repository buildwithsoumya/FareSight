import { useState } from 'react'
import type { FormEvent } from 'react'
import { predictFare } from '../services/api'
import type { PredictionRequest, PredictionResponse } from '../types'
import {
  AIRLINES,
  AIRCRAFT_TYPES,
  BOOKING_CHANNELS,
  CITIES,
  SEASONS,
  STOP_OPTIONS,
  TRAVEL_CLASSES,
  WEEKDAYS,
} from '../types'
import SelectField from '../components/forms/SelectField'
import NumberInput from '../components/forms/NumberInput'
import TextInput from '../components/forms/TextInput'
import DateInput from '../components/forms/DateInput'
import TimeInput from '../components/forms/TimeInput'
import PredictionResult from '../components/cards/PredictionResult'
import Icon from '../components/common/Icon'

interface FormState {
  airline: string
  source: string
  destination: string
  departure_date: string
  departure_time: string
  arrival_time: string
  duration: string
  total_stops: string
  distance_km: string
  travel_class: string
  days_before_departure: string
  season: string
  weekday: string
  aircraft_type: string
  booking_channel: string
  passenger_count: string
}

const INITIAL_STATE: FormState = {
  airline: 'Indigo',
  source: 'Delhi',
  destination: 'Mumbai',
  departure_date: '2026-09-15',
  departure_time: '10:30 AM',
  arrival_time: '12:45 PM',
  duration: '2h 15m',
  total_stops: '0',
  distance_km: '1150',
  travel_class: 'Economy',
  days_before_departure: '30',
  season: 'Monsoon',
  weekday: 'Tuesday',
  aircraft_type: 'Airbus A320',
  booking_channel: 'Website',
  passenger_count: '1',
}

function toOptions(values: readonly string[]) {
  return values.map((v) => ({ value: v, label: v }))
}

function buildRequest(form: FormState): PredictionRequest {
  return {
    airline: form.airline,
    source: form.source,
    destination: form.destination,
    departure_date: form.departure_date,
    departure_time: form.departure_time,
    arrival_time: form.arrival_time,
    duration: form.duration,
    total_stops: Number(form.total_stops),
    distance_km: Number(form.distance_km),
    travel_class: form.travel_class,
    days_before_departure: Number(form.days_before_departure),
    season: form.season,
    weekday: form.weekday,
    aircraft_type: form.aircraft_type,
    booking_channel: form.booking_channel,
    passenger_count: Number(form.passenger_count),
  }
}

function validate(form: FormState): string | null {
  if (!form.airline || !form.source || !form.destination) {
    return 'Airline, source and destination are required.'
  }
  if (form.source.trim().toLowerCase() === form.destination.trim().toLowerCase()) {
    return 'Source and destination must be different cities.'
  }
  if (!form.departure_date) {
    return 'Departure date is required.'
  }
  if (!form.departure_time || !form.arrival_time) {
    return 'Departure and arrival times are required.'
  }
  if (!form.duration.trim()) {
    return 'Duration is required (e.g. "2h 15m" or "177 min").'
  }
  const stops = Number(form.total_stops)
  if (Number.isNaN(stops) || stops < 0 || stops > 10) {
    return 'Total stops must be between 0 and 10.'
  }
  const distance = Number(form.distance_km)
  if (Number.isNaN(distance) || distance <= 0) {
    return 'Distance must be greater than 0 km.'
  }
  const days = Number(form.days_before_departure)
  if (Number.isNaN(days) || days < 0) {
    return 'Days before departure cannot be negative.'
  }
  const passengers = Number(form.passenger_count)
  if (Number.isNaN(passengers) || passengers < 1 || passengers > 9) {
    return 'Passenger count must be between 1 and 9.'
  }
  return null
}

export default function Prediction() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PredictionResponse | null>(null)

  const update = <K extends keyof FormState>(key: K, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setResult(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationError = validate(form)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await predictFare(buildRequest(form))
      setResult(response)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to generate a prediction.'
      setError(
        `Prediction failed: ${message}. Please check the flight details and try again.`,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} noValidate className="card p-5 md:p-6">
            <div className="mb-5 border-b border-slate-100 pb-5">
              <h2 className="text-base font-semibold text-slate-900">
                Flight Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Raw flight characteristics — engineered features are derived by
                the backend.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectField
                id="pred-airline"
                label="Airline"
                value={form.airline}
                onChange={(v) => update('airline', v)}
                options={toOptions(AIRLINES)}
              />
              <SelectField
                id="pred-class"
                label="Travel Class"
                value={form.travel_class}
                onChange={(v) => update('travel_class', v)}
                options={toOptions(TRAVEL_CLASSES)}
              />
              <SelectField
                id="pred-source"
                label="Source"
                value={form.source}
                onChange={(v) => update('source', v)}
                options={toOptions(CITIES)}
              />
              <SelectField
                id="pred-destination"
                label="Destination"
                value={form.destination}
                onChange={(v) => update('destination', v)}
                options={toOptions(CITIES)}
              />
              <SelectField
                id="pred-stops"
                label="Total Stops"
                value={form.total_stops}
                onChange={(v) => update('total_stops', v)}
                options={STOP_OPTIONS.map((s) => ({
                  value: s.value,
                  label: s.label,
                }))}
              />
              <SelectField
                id="pred-aircraft"
                label="Aircraft Type"
                value={form.aircraft_type}
                onChange={(v) => update('aircraft_type', v)}
                options={toOptions(AIRCRAFT_TYPES)}
              />
              <SelectField
                id="pred-channel"
                label="Booking Channel"
                value={form.booking_channel}
                onChange={(v) => update('booking_channel', v)}
                options={toOptions(BOOKING_CHANNELS)}
              />
              <SelectField
                id="pred-season"
                label="Season"
                value={form.season}
                onChange={(v) => update('season', v)}
                options={toOptions(SEASONS)}
              />
              <SelectField
                id="pred-weekday"
                label="Weekday"
                value={form.weekday}
                onChange={(v) => update('weekday', v)}
                options={toOptions(WEEKDAYS)}
              />

              <DateInput
                id="pred-date"
                label="Departure Date"
                value={form.departure_date}
                onChange={(v) => update('departure_date', v)}
                required
              />
              <TextInput
                id="pred-duration"
                label="Duration"
                value={form.duration}
                onChange={(v) => update('duration', v)}
                required
                placeholder="e.g. 2h 15m"
                hint='Formats: "2h 15m", "177 min", or decimal hours'
              />
              <TimeInput
                id="pred-departure-time"
                label="Departure Time"
                value={form.departure_time}
                onChange={(v) => update('departure_time', v)}
                required
              />
              <TimeInput
                id="pred-arrival-time"
                label="Arrival Time"
                value={form.arrival_time}
                onChange={(v) => update('arrival_time', v)}
                required
              />

              <NumberInput
                id="pred-distance"
                label="Distance"
                value={form.distance_km}
                onChange={(v) => update('distance_km', String(v))}
                min={1}
                max={25000}
                required
                suffix="km"
              />
              <NumberInput
                id="pred-days"
                label="Days Before Departure"
                value={form.days_before_departure}
                onChange={(v) => update('days_before_departure', String(v))}
                min={0}
                max={370}
                required
                suffix="days"
              />
              <NumberInput
                id="pred-passengers"
                label="Passenger Count"
                value={form.passenger_count}
                onChange={(v) => update('passenger_count', String(v))}
                min={1}
                max={9}
                required
              />
            </div>

            {error && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <span className="mt-0.5 shrink-0">
                  <Icon name="alert-circle" size={16} />
                </span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-5 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />
                  Predicting fare...
                </>
              ) : (
                <>
                  <Icon name="zap" size={16} />
                  Predict fare
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="card flex min-h-[280px] flex-col items-center justify-center gap-3">
              <span
                className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-brand-600"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-slate-500">Predicting fare...</p>
            </div>
          ) : result ? (
            <PredictionResult result={result} />
          ) : (
            <div className="card flex min-h-[280px] flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon name="search" size={22} />
              </div>
              <p className="text-base font-semibold text-slate-900">
                Ready when you are
              </p>
              <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                Fill in the flight details and submit the form to see an estimated
                fare.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
