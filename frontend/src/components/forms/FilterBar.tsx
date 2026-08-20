import SelectField from './SelectField'
import {
  AIRLINES,
  BOOKING_CHANNELS,
  CITIES,
  SEASONS,
  TRAVEL_CLASSES,
} from '../../types'
import type { AnalyticsFilters } from '../../types'

interface FilterBarProps {
  filters: AnalyticsFilters
  onChange: (filters: AnalyticsFilters) => void
}

function toOptions(values: readonly string[]) {
  return values.map((v) => ({ value: v, label: v }))
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const update = (key: keyof AnalyticsFilters, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="card p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <SelectField
          id="filter-airline"
          label="Airline"
          value={filters.airline}
          onChange={(v) => update('airline', v)}
          options={toOptions(AIRLINES)}
        />
        <SelectField
          id="filter-source"
          label="Source"
          value={filters.source}
          onChange={(v) => update('source', v)}
          options={toOptions(CITIES)}
        />
        <SelectField
          id="filter-destination"
          label="Destination"
          value={filters.destination}
          onChange={(v) => update('destination', v)}
          options={toOptions(CITIES)}
        />
        <SelectField
          id="filter-class"
          label="Travel Class"
          value={filters.travelClass}
          onChange={(v) => update('travelClass', v)}
          options={toOptions(TRAVEL_CLASSES)}
        />
        <SelectField
          id="filter-stops"
          label="Stops"
          value={filters.totalStops}
          onChange={(v) => update('totalStops', v)}
          options={[
            { value: '0', label: '0 (Non-stop)' },
            { value: '1', label: '1 stop' },
            { value: '2', label: '2 stops' },
          ]}
        />
        <SelectField
          id="filter-channel"
          label="Booking Channel"
          value={filters.bookingChannel}
          onChange={(v) => update('bookingChannel', v)}
          options={toOptions(BOOKING_CHANNELS)}
        />
        <SelectField
          id="filter-season"
          label="Season"
          value={filters.season}
          onChange={(v) => update('season', v)}
          options={toOptions(SEASONS)}
        />
      </div>
    </div>
  )
}
