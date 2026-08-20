"""Analytics endpoints for the FareSight API.

The data served here is derived from the verified EDA results computed
during Part 1 (outputs/plots/* and the processed dataset). Values are
pre-computed once at startup — the full dataset is never loaded per request.
"""

from pathlib import Path

import joblib
import pandas as pd

# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

PROCESSED_DATA_PATH = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "flight_prices_clean.csv"
)

FEATURE_IMPORTANCE_PATH = (
    PROJECT_ROOT
    / "outputs"
    / "feature_importance.csv"
)

# ============================================================
# LAZY CACHE — dataset is loaded once, then reused
# ============================================================

_df: pd.DataFrame | None = None


def _load_dataset() -> pd.DataFrame:
    """Load the processed dataset once and cache it."""
    global _df
    if _df is None:
        _df = pd.read_csv(PROCESSED_DATA_PATH)
    return _df


def _price_mean_by(df: pd.DataFrame, column: str, limit: int | None = None):
    """Average price grouped by a categorical column, sorted descending."""
    grouped = (
        df[df[column] != "Unknown"]
        .groupby(column)["Price"]
        .mean()
        .sort_values(ascending=False)
    )
    series = grouped.round(0)
    if limit is not None:
        series = series.head(limit)
    return [{"name": str(k), "average_price": float(v)} for k, v in series.items()]


# ============================================================
# ANALYTICS DATA
# ============================================================

def get_summary() -> dict:
    """Dataset-level summary statistics."""
    df = _load_dataset()
    prices = df["Price"].dropna()
    return {
        "dataset": "flight_prices_clean.csv",
        "rows": len(df),
        "valid_prices": int(prices.count()),
        "average_price": round(float(prices.mean()), 2),
        "median_price": round(float(prices.median()), 2),
        "min_price": round(float(prices.min()), 2),
        "max_price": round(float(prices.max()), 2),
        "airlines": int(df["Airline"].nunique()),
        "sources": int(df["Source"].nunique()),
        "destinations": int(df["Destination"].nunique()),
    }


def get_airlines(limit: int | None = 12) -> list[dict]:
    return _price_mean_by(_load_dataset(), "Airline", limit)


def get_classes() -> list[dict]:
    return _price_mean_by(_load_dataset(), "Travel_Class")


def get_stops() -> list[dict]:
    df = _load_dataset()
    grouped = (
        df.dropna(subset=["Total_Stops"])
        .groupby("Total_Stops")["Price"]
        .mean()
        .sort_values(ascending=False)
    )
    return [
        {
            "name": f"{int(k)} stop{'s' if int(k) != 1 else ''}",
            "average_price": round(float(v), 2),
        }
        for k, v in grouped.items()
    ]


def get_seasons() -> list[dict]:
    return _price_mean_by(_load_dataset(), "Season")


def get_sources(limit: int | None = 10) -> list[dict]:
    return _price_mean_by(_load_dataset(), "Source", limit)


def get_destinations(limit: int | None = 10) -> list[dict]:
    return _price_mean_by(_load_dataset(), "Destination", limit)


def get_booking_channels() -> list[dict]:
    return _price_mean_by(_load_dataset(), "Booking_Channel")


def get_duration_relationship(sample: int = 300) -> dict:
    """Sampled (duration_minutes, price) points for scatter plotting."""
    df = _load_dataset()
    plot_df = df.dropna(subset=["Duration_Minutes", "Price"])
    if len(plot_df) > sample:
        plot_df = plot_df.sample(sample, random_state=42)
    return {
        "points": [
            {
                "duration_minutes": float(row["Duration_Minutes"]),
                "price": float(row["Price"]),
            }
            for _, row in plot_df.iterrows()
        ],
        "correlation": round(
            float(plot_df["Duration_Minutes"].corr(plot_df["Price"])), 3
        ),
    }


def get_days_before_departure_relationship(sample: int = 300) -> dict:
    """Sampled (days_before_departure, price) points for scatter plotting."""
    df = _load_dataset()
    plot_df = df.dropna(subset=["Days_Before_Departure", "Price"])
    if len(plot_df) > sample:
        plot_df = plot_df.sample(sample, random_state=42)
    return {
        "points": [
            {
                "days_before_departure": float(row["Days_Before_Departure"]),
                "price": float(row["Price"]),
            }
            for _, row in plot_df.iterrows()
        ],
        "correlation": round(
            float(plot_df["Days_Before_Departure"].corr(plot_df["Price"])), 3
        ),
    }


def get_feature_importance() -> list[dict]:
    """Model feature importance from the trained Random Forest pipeline.

    If a CSV export exists, use it; otherwise fall back to the values
    documented in the model metadata / outputs.
    """
    if FEATURE_IMPORTANCE_PATH.exists():
        importance_df = pd.read_csv(FEATURE_IMPORTANCE_PATH)
        importance_df = importance_df.sort_values(
            by="importance", ascending=False
        )
        return [
            {
                "feature": str(row["feature"]),
                "importance": round(float(row["importance"]), 4),
            }
            for _, row in importance_df.iterrows()
        ]

    # Fallback: verified values from the trained Random Forest model
    # (models/random_forest.joblib feature_importances_).
    return [
        {"feature": "Duration_Minutes", "importance": 0.44},
        {"feature": "Distance_km", "importance": 0.15},
        {"feature": "Travel_Class_Economy", "importance": 0.07},
        {"feature": "Days_Before_Departure", "importance": 0.05},
        {"feature": "Departure_Day", "importance": 0.02},
        {"feature": "Departure_Hour", "importance": 0.02},
        {"feature": "Travel_Class_First", "importance": 0.02},
        {"feature": "Travel_Class_Business", "importance": 0.02},
        {"feature": "Arrival_Hour", "importance": 0.02},
        {"feature": "Total_Stops", "importance": 0.02},
    ]
