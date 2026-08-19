from pathlib import Path
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

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

def build_preprocessor():
    """
    Build the preprocessing pipeline for numerical
    and categorical features.
    """
    numerical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
        ]
    )
    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
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
            ("numerical", numerical_pipeline, NUMERICAL_FEATURES),
            ("categorical", categorical_pipeline, CATEGORICAL_FEATURES),
        ]
    )
    return preprocessor

def load_features_and_target():
    """
    Load processed dataset and separate features from target.
    """
    project_root = Path(__file__).resolve().parents[3]
    dataset_path = (
        project_root
        / "data"
        / "processed"
        / "flight_prices_clean.csv"
    )
    print("Loading processed dataset...")
    df = pd.read_csv(dataset_path)
    X = df[NUMERICAL_FEATURES + CATEGORICAL_FEATURES].copy()
    y = df["Price"].copy()
    return X, y


if __name__ == "__main__":
    X, y = load_features_and_target()
    print("\n" + "=" * 60)
    print("FEATURE ENGINEERING CHECK")
    print("=" * 60)
    print(f"Feature rows : {len(X):,}")
    print(f"Feature cols : {X.shape[1]}")
    print(f"Target rows  : {len(y):,}")
    print("\nNumerical features:")
    for feature in NUMERICAL_FEATURES:
        print(f"- {feature}")
    print("\nCategorical features:")
    for feature in CATEGORICAL_FEATURES:
        print(f"- {feature}")
    print("\nTarget:")
    print("- Price")
    print("\nFeature engineering setup complete.")