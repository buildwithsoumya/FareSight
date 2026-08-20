from pathlib import Path
import sys

import joblib
import pandas as pd


# ============================================================
# PROJECT PATH
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

BACKEND_PATH = PROJECT_ROOT / "backend"

sys.path.insert(0, str(BACKEND_PATH))


from app.models.feature_engineering import engineer_features
MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "faresight_model.joblib"
)


# ============================================================
# MODEL LOADING
# ============================================================

print("Loading FareSight model...")

model = joblib.load(MODEL_PATH)

print("FareSight model loaded successfully.")


# ============================================================
# PREDICTION
# ============================================================

def predict_fare(
    airline: str,
    source: str,
    destination: str,
    departure_date: str,
    departure_time: str,
    arrival_time: str,
    duration: str,
    total_stops: float,
    distance_km: float,
    travel_class: str,
    days_before_departure: float,
    season: str,
    weekday: str,
    aircraft_type: str,
    booking_channel: str,
    passenger_count: float,
):
    """
    Predict flight fare using the trained FareSight model.

    Raw user inputs are converted into the same engineered
    features used during model training.
    """

    # --------------------------------------------------------
    # 1. Create DataFrame from user input
    # --------------------------------------------------------

    input_data = pd.DataFrame(
        [
            {
                "Airline": airline,
                "Source": source,
                "Destination": destination,
                "Departure_Date": departure_date,
                "Departure_Time": departure_time,
                "Arrival_Time": arrival_time,
                "Duration": duration,
                "Total_Stops": total_stops,
                "Distance_km": distance_km,
                "Travel_Class": travel_class,
                "Days_Before_Departure": days_before_departure,
                "Season": season,
                "Weekday": weekday,
                "Aircraft_Type": aircraft_type,
                "Booking_Channel": booking_channel,
                "Passenger_Count": passenger_count,
            }
        ]
    )

    # --------------------------------------------------------
    # 2. Apply shared feature engineering
    # --------------------------------------------------------

    input_data = engineer_features(input_data)

    # --------------------------------------------------------
    # 3. Predict fare
    # --------------------------------------------------------

    prediction = model.predict(input_data)

    return float(prediction[0])


# ============================================================
# MANUAL TEST
# ============================================================

if __name__ == "__main__":

    predicted_price = predict_fare(
        airline="Indigo",
        source="Delhi",
        destination="Mumbai",
        departure_date="2026-09-15",
        departure_time="10:30 AM",
        arrival_time="12:45 PM",
        duration="2h 15m",
        total_stops=0,
        distance_km=1150,
        travel_class="Economy",
        days_before_departure=30,
        season="Monsoon",
        weekday="Tuesday",
        aircraft_type="Airbus A320",
        booking_channel="Website",
        passenger_count=1,
    )

    print("\n" + "=" * 60)
    print("FARESIGHT PREDICTION TEST")
    print("=" * 60)

    print(
        f"Predicted Fare: ₹{predicted_price:,.2f}"
    )