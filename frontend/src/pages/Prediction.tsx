import { useState } from 'react'
import type { FormEvent } from 'react'
import { predictPrice } from '../services/api'
import type {
  PredictionRequest,
  PredictionResponse,
} from '../types'
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
import PredictionResult from '../components/cards/PredictionResult'

interface FormState {
  airline: string
  source: string
  destination: string
  travelClass: string
  totalStops: string
  distanceKm: string
  daysBeforeDeparture: string
  passengerCount: string
  season: string
  weekday: string
  aircraftType: string
  bookingChannel: string
  departureHour: string
  arrivalHour: string
  durationMinutes: string
}

const INITIAL_STATE: FormState = {
  airline: 'Indigo',
  source: 'Delhi',
  destination: 'Mumbai',
  travelClass: 'Economy',
  totalStops: '0',
  distanceKm: '1147',
  daysBeforeDeparture: '30',
  passengerCount: '1',
  season: 'Summer',
  weekday: 'Monday',
  aircraftType: 'Airbus A320',
  bookingChannel: 'Mobile App',
  departureHour: '10',
  arrivalHour: '12',
  durationMinutes: '150',
}

function toOptions(values: readonly string[]) {
  return values.map((v) => ({ value: v, label: v }))
}

function buildRequest(form: FormState): PredictionRequest {
  return {
    airline: form.airline,
    source: form.source,
    destination: form.destination,
    travelClass: form.travelClass,
    totalStops: Number(form.totalStops),
    distanceKm: Number(form.distanceKm),
    daysBeforeDeparture: Number(form.daysBeforeDeparture),
    passengerCount: Number(form.passengerCount),
    season: form.season,
    weekday: form.weekday,
    aircraftType: form.aircraftType,
    bookingChannel: form.bookingChannel,
    departureHour: Number(form.departureHour),
    arrivalHour: Number(form.arrivalHour),
    durationMinutes: Number(form.durationMinutes),
  }
}

function validate(form: FormState): string | null {
  if (form.source === form.destination) {
    return 'Source and destination must be different cities.'
  }
  if (Number(form.distanceKm) <= 0) {
    return 'Distance must be greater than 0 km.'
  }
  if (Number(form.durationMinutes) <= 0) {
    return 'Duration must be greater than 0 minutes.'
  }
  if (Number(form.daysBeforeDeparture) < 0) {
    return 'Days before departure cannot be negative.'
  }
  if (
    Number(form.passengerCount) < 1 ||
    Number(form.passengerCount) > 6
  ) {
    return 'Passenger count must be between 1 and 6.'
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
      const response = await predictPrice(buildRequest(form))
      setResult(response)
    } catch {
      setError('Unable to generate a prediction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Form */}
      <div className="lg:col-span-3">
        <form onSubmit={handleSubmit} noValidate className="card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-800">
              Flight details
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Inputs mirror the FareSight ML feature space.
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
              value={form.travelClass}
              onChange={(v) => update('travelClass', v)}
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
              value={form.totalStops}
              onChange={(v) => update('totalStops', v)}
              options={STOP_OPTIONS.map((s) => ({
                value: s.value,
                label: s.label,
              }))}
            />
            <SelectField
              id="pred-aircraft"
              label="Aircraft Type"
              value={form.aircraftType}
              onChange={(v) => update('aircraftType', v)}
              options={toOptions(AIRCRAFT_TYPES)}
            />
            <SelectField
              id="pred-channel"
              label="Booking Channel"
              value={form.bookingChannel}
              onChange={(v) => update('bookingChannel', v)}
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

            <NumberInput
              id="pred-distance"
              label="Distance"
              value={form.distanceKm}
              onChange={(v) => update('distanceKm', String(v))}
              min={50}
              max={20000}
              required
              suffix="km"
            />
            <NumberInput
              id="pred-duration"
              label="Duration"
              value={form.durationMinutes}
              onChange={(v) => update('durationMinutes', String(v))}
              min={30}
              max={1800}
              required
              suffix="min"
            />
            <NumberInput
              id="pred-days"
              label="Days Before Departure"
              value={form.daysBeforeDeparture}
              onChange={(v) => update('daysBeforeDeparture', String(v))}
              min={0}
              max={120}
              required
              suffix="days"
            />
            <NumberInput
              id="pred-passengers"
              label="Passenger Count"
              value={form.passengerCount}
              onChange={(v) => update('passengerCount', String(v))}
              min={1}
              max={6}
              required
            />
            <NumberInput
              id="pred-departure-hour"
              label="Departure Hour"
              value={form.departureHour}
              onChange={(v) => update('departureHour', String(v))}
              min={0}
              max={23}
              required
              suffix="24h"
            />
            <NumberInput
              id="pred-arrival-hour"
              label="Arrival Hour"
              value={form.arrivalHour}
              onChange={(v) => update('arrivalHour', String(v))}
              min={0}
              max={23}
              required
              suffix="24h"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden="true"
                />
                Generating prediction...
              </>
            ) : (
              <>Predict price</>
            )}
          </button>
        </form>
      </div>

      {/* Result */}
      <div className="lg:col-span-2">
        {loading ? (
          <div className="card flex min-h-[280px] flex-col items-center justify-center gap-3 text-slate-500">
            <span
              className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-brand-500"
              aria-hidden="true"
            />
            <p className="text-sm font-medium">Generating prediction...</p>
          </div>
        ) : result ? (
          <PredictionResult result={result} />
        ) : (
          <div className="card flex min-h-[280px] flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="text-3xl" aria-hidden="true">
              🎯
            </span>
            <p className="text-sm font-semibold text-slate-700">
              Ready when you are
            </p>
            <p className="max-w-xs text-sm text-slate-500">
              Fill in the flight details and submit the form to see an estimated
              price.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
