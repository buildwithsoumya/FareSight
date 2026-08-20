from pathlib import Path

import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


# ============================================================
# FEATURE DEFINITIONS
# ============================================================

NUMERICAL_FEATURES = [
    "Total_Stops",
    "Distance_km",
    "Days_Before_Departure",
    "Passenger_Count",
    "Departure_Year",
    "Departure_Month",
    "Departure_Day",
    "Departure_DayOfWeek",
    "Departure_Hour",
    "Arrival_Hour",
    "Duration_Minutes",
]

CATEGORICAL_FEATURES = [
    "Airline",
    "Source",
    "Destination",
    "Travel_Class",
    "Season",
    "Weekday",
    "Aircraft_Type",
    "Booking_Channel",
]


# ============================================================
# TIME PARSER
# ============================================================

def parse_time(value):
    """
    Parse both 12-hour and 24-hour time formats.

    Examples:
        8:10 PM  -> 20
        5:05 PM  -> 17
        07:05    -> 7
        23:30    -> 23
        00:05    -> 0
    """

    if pd.isna(value):
        return None

    value = str(value).strip()

    # --------------------------------------------------------
    # 12-hour format
    # --------------------------------------------------------

    if "AM" in value.upper() or "PM" in value.upper():

        parsed = pd.to_datetime(
            value,
            format="%I:%M %p",
            errors="coerce",
        )

    # --------------------------------------------------------
    # 24-hour format
    # --------------------------------------------------------

    else:

        parsed = pd.to_datetime(
            value,
            format="%H:%M",
            errors="coerce",
        )

    if pd.isna(parsed):
        return None

    return parsed.hour


# ============================================================
# DURATION PARSER
# ============================================================

def parse_duration(value):
    """
    Convert different duration formats into minutes.

    Supported formats:

        2h 15m  -> 135
        177 min -> 177
        1.67    -> 100.2
    """

    if pd.isna(value):
        return None

    value = str(value).strip()

    # --------------------------------------------------------
    # Format: "2h 15m"
    # --------------------------------------------------------

    if "h" in value:

        hours = 0
        minutes = 0

        parts = value.split()

        for part in parts:

            if part.endswith("h"):
                hours = float(
                    part.replace("h", "")
                )

            elif part.endswith("m"):
                minutes = float(
                    part.replace("m", "")
                )

        return hours * 60 + minutes

    # --------------------------------------------------------
    # Format: "177 min"
    # --------------------------------------------------------

    if "min" in value:

        return float(
            value.replace("min", "").strip()
        )

    # --------------------------------------------------------
    # Decimal hours
    # --------------------------------------------------------

    try:

        return float(value) * 60

    except ValueError:

        return None


# ============================================================
# FEATURE ENGINEERING
# ============================================================

def engineer_features(df):
    """
    Create all engineered features required by FareSight.

    This function is used by BOTH training and prediction.
    """

    df = df.copy()

    # --------------------------------------------------------
    # Departure date
    # --------------------------------------------------------

    departure_date = pd.to_datetime(
        df["Departure_Date"],
        format="%Y-%m-%d",
        errors="coerce",
    )

    df["Departure_Year"] = (
        departure_date.dt.year
    )

    df["Departure_Month"] = (
        departure_date.dt.month
    )

    df["Departure_Day"] = (
        departure_date.dt.day
    )

    df["Departure_DayOfWeek"] = (
        departure_date.dt.dayofweek
    )

    # --------------------------------------------------------
    # Departure time
    # --------------------------------------------------------

    df["Departure_Hour"] = (
        df["Departure_Time"]
        .apply(parse_time)
    )

    # --------------------------------------------------------
    # Arrival time
    # --------------------------------------------------------

    df["Arrival_Hour"] = (
        df["Arrival_Time"]
        .apply(parse_time)
    )

    # --------------------------------------------------------
    # Duration
    # --------------------------------------------------------

    df["Duration_Minutes"] = (
        df["Duration"]
        .apply(parse_duration)
    )

    return df


# ============================================================
# PREPROCESSOR
# ============================================================

def build_preprocessor():

    numerical_pipeline = Pipeline(
        steps=[
            (
                "imputer",
                SimpleImputer(
                    strategy="median"
                ),
            ),
        ]
    )

    categorical_pipeline = Pipeline(
        steps=[
            (
                "imputer",
                SimpleImputer(
                    strategy="most_frequent"
                ),
            ),
            (
                "encoder",
                OneHotEncoder(
                    handle_unknown="ignore",
                    sparse_output=False,
                ),
            ),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "numerical",
                numerical_pipeline,
                NUMERICAL_FEATURES,
            ),
            (
                "categorical",
                categorical_pipeline,
                CATEGORICAL_FEATURES,
            ),
        ]
    )

    return preprocessor


# ============================================================
# DATA LOADING
# ============================================================

def load_features_and_target():

    project_root = (
        Path(__file__).resolve().parents[3]
    )

    dataset_path = (
        project_root
        / "data"
        / "processed"
        / "flight_prices_clean.csv"
    )

    print("Loading processed dataset...")

    df = pd.read_csv(dataset_path)

    # Apply shared feature engineering
    df = engineer_features(df)

    X = df[
        NUMERICAL_FEATURES
        + CATEGORICAL_FEATURES
    ].copy()

    y = df["Price"].copy()

    return X, y


# ============================================================
# CHECK
# ============================================================

if __name__ == "__main__":

    X, y = load_features_and_target()

    print("\n" + "=" * 60)
    print("FEATURE ENGINEERING CHECK")
    print("=" * 60)

    print(
        f"Feature rows : {len(X):,}"
    )

    print(
        f"Feature cols : {X.shape[1]}"
    )

    print(
        f"Target rows  : {len(y):,}"
    )

    print("\nMissing engineered values:")

    engineered_columns = [
        "Departure_Year",
        "Departure_Month",
        "Departure_Day",
        "Departure_DayOfWeek",
        "Departure_Hour",
        "Arrival_Hour",
        "Duration_Minutes",
    ]

    for column in engineered_columns:

        print(
            f"{column:<25}"
            f"{X[column].isna().sum():,}"
        )

    print("\nFeature engineering setup complete.")