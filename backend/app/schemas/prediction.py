"""Pydantic schemas for the FareSight API."""

from pydantic import BaseModel, Field, field_validator


# ============================================================
# PREDICTION REQUEST
# ============================================================

class PredictionRequest(BaseModel):
    """Raw flight inputs used to predict a fare.

    Mirrors the columns of the raw FareSight dataset. Engineered
    features (year, month, day, hours, duration minutes) are derived
    inside the shared feature-engineering step — never passed in.
    """

    airline: str = Field(..., min_length=1, description="Airline name")
    source: str = Field(..., min_length=1, description="Departure city")
    destination: str = Field(..., min_length=1, description="Arrival city")
    departure_date: str = Field(
        ...,
        pattern=r"^\d{4}-\d{2}-\d{2}$",
        description="Departure date as YYYY-MM-DD",
    )
    departure_time: str = Field(
        ...,
        min_length=1,
        description="Departure time (12h or 24h, e.g. 10:30 AM or 07:05)",
    )
    arrival_time: str = Field(
        ...,
        min_length=1,
        description="Arrival time (12h or 24h)",
    )
    duration: str = Field(
        ...,
        min_length=1,
        description="Flight duration, e.g. '2h 15m', '177 min' or decimal hours",
    )
    total_stops: float = Field(
        ...,
        ge=0,
        le=10,
        description="Number of stops",
    )
    distance_km: float = Field(
        ...,
        gt=0,
        le=25_000,
        description="Route distance in kilometres",
    )
    travel_class: str = Field(..., min_length=1, description="Travel class")
    days_before_departure: float = Field(
        ...,
        ge=0,
        le=370,
        description="Booking lead time in days",
    )
    season: str = Field(..., min_length=1, description="Season")
    weekday: str = Field(..., min_length=1, description="Day of week")
    aircraft_type: str = Field(..., min_length=1, description="Aircraft type")
    booking_channel: str = Field(..., min_length=1, description="Booking channel")
    passenger_count: float = Field(
        ...,
        ge=1,
        le=9,
        description="Number of passengers",
    )

    @field_validator("destination")
    @classmethod
    def destination_must_differ(cls, v, info):
        source = info.data.get("source")
        if source is not None and v.strip().lower() == source.strip().lower():
            raise ValueError("source and destination must be different")
        return v


# ============================================================
# PREDICTION RESPONSE
# ============================================================

class PredictionResponse(BaseModel):
    """Prediction result returned by the API."""

    predicted_price: float
    currency: str = "INR"


# ============================================================
# HEALTH / ROOT RESPONSES
# ============================================================

class HealthResponse(BaseModel):
    status: str
    service: str
    model: str = "HistGradientBoostingRegressor"


class RootResponse(BaseModel):
    message: str
    status: str
