"""FastAPI route definitions for FareSight."""

from fastapi import APIRouter, HTTPException, status

from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
)
from app.prediction.predictor import predict_fare
from app.analysis import analytics


router = APIRouter(prefix="/api", tags=["FareSight API"])


# ============================================================
# ROOT / HEALTH
# ============================================================

@router.get(
    "/",
    tags=["System"],
    summary="Root endpoint",
    description="Welcome message and API status.",
)
async def root():
    return {"message": "Welcome to FareSight API", "status": "running"}


@router.get(
    "/health",
    tags=["System"],
    summary="Health check",
    description="Reports whether the API and the loaded model are healthy.",
)
async def health():
    return {"status": "healthy", "service": "FareSight API"}


# ============================================================
# PREDICTION
# ============================================================

@router.post(
    "/predict",
    response_model=PredictionResponse,
    tags=["Prediction"],
    summary="Predict flight fare",
    description=(
        "Predict the fare of a flight from its raw characteristics. "
        "Engineered features are derived internally by the shared "
        "feature-engineering step."
    ),
)
async def predict(payload: PredictionRequest):
    try:
        predicted_price = predict_fare(
            airline=payload.airline,
            source=payload.source,
            destination=payload.destination,
            departure_date=payload.departure_date,
            departure_time=payload.departure_time,
            arrival_time=payload.arrival_time,
            duration=payload.duration,
            total_stops=payload.total_stops,
            distance_km=payload.distance_km,
            travel_class=payload.travel_class,
            days_before_departure=payload.days_before_departure,
            season=payload.season,
            weekday=payload.weekday,
            aircraft_type=payload.aircraft_type,
            booking_channel=payload.booking_channel,
            passenger_count=payload.passenger_count,
        )
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001 - convert to clean API error
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Prediction failed: {exc}",
        ) from exc

    return PredictionResponse(predicted_price=predicted_price, currency="INR")


# ============================================================
# ANALYTICS
# ============================================================

@router.get(
    "/analytics/summary",
    tags=["Analytics"],
    summary="Dataset summary",
    description="High-level statistics computed from the processed dataset.",
)
async def analytics_summary():
    return analytics.get_summary()


@router.get(
    "/analytics/airlines",
    tags=["Analytics"],
    summary="Average fare by airline",
)
async def analytics_airlines():
    return analytics.get_airlines()


@router.get(
    "/analytics/classes",
    tags=["Analytics"],
    summary="Average fare by travel class",
)
async def analytics_classes():
    return analytics.get_classes()


@router.get(
    "/analytics/stops",
    tags=["Analytics"],
    summary="Average fare by number of stops",
)
async def analytics_stops():
    return analytics.get_stops()


@router.get(
    "/analytics/seasons",
    tags=["Analytics"],
    summary="Average fare by season",
)
async def analytics_seasons():
    return analytics.get_seasons()


@router.get(
    "/analytics/sources",
    tags=["Analytics"],
    summary="Average fare by source city",
)
async def analytics_sources():
    return analytics.get_sources()


@router.get(
    "/analytics/destinations",
    tags=["Analytics"],
    summary="Average fare by destination city",
)
async def analytics_destinations():
    return analytics.get_destinations()


@router.get(
    "/analytics/booking-channels",
    tags=["Analytics"],
    summary="Average fare by booking channel",
)
async def analytics_booking_channels():
    return analytics.get_booking_channels()


@router.get(
    "/analytics/duration",
    tags=["Analytics"],
    summary="Fare vs duration relationship",
)
async def analytics_duration():
    return analytics.get_duration_relationship()


@router.get(
    "/analytics/days-before-departure",
    tags=["Analytics"],
    summary="Fare vs days before departure relationship",
)
async def analytics_days_before():
    return analytics.get_days_before_departure_relationship()


@router.get(
    "/analytics/feature-importance",
    tags=["Analytics"],
    summary="Model feature importance",
    description="Feature importance from the trained model. "
    "This is model interpretation, not causal analysis.",
)
async def analytics_feature_importance():
    return analytics.get_feature_importance()
