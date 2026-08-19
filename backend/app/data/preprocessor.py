from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[3]

RAW_DATA_PATH = BASE_DIR / "data" / "flight_pricing_dataset.csv"

PROCESSED_DIR = BASE_DIR / "data" / "processed"
PROCESSED_DATA_PATH = PROCESSED_DIR / "flight_prices_clean.csv"
# ============================================================
# CONSTANTS
# ============================================================

LOCATION_MAP = {
    # Indian cities
    "BLR": "Bangalore",
    "Bangalore Airport": "Bangalore",

    "BOM": "Mumbai",
    "Mumbai Airport": "Mumbai",

    "DEL": "Delhi",
    "Delhi Airport": "Delhi",

    "HYD": "Hyderabad",
    "Hyderabad Airport": "Hyderabad",

    "MAA": "Chennai",
    "Chennai Airport": "Chennai",

    "CCU": "Kolkata",
    "Kolkata Airport": "Kolkata",

    "PNQ": "Pune",
    "Pune Airport": "Pune",

    "AMD": "Ahmedabad",
    "Ahmedabad Airport": "Ahmedabad",

    "JAI": "Jaipur",
    "Jaipur Airport": "Jaipur",

    "GOI": "Goa",
    "Goa Airport": "Goa",

    # International cities
    "DXB": "Dubai",
    "Dubai Airport": "Dubai",

    "DOH": "Doha",
    "Doha Airport": "Doha",

    "SIN": "Singapore",
    "Singapore Airport": "Singapore",

    "BKK": "Bangkok",
    "Bangkok Airport": "Bangkok",

    "SYD": "Sydney",
    "Sydney Airport": "Sydney",

    "JFK": "New York",
    "New York Airport": "New York",

    "LHR": "London",
    "London Airport": "London",

    "FRA": "Frankfurt",
    "Frankfurt Airport": "Frankfurt",
}


PASSENGER_COUNT_MAP = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
}


# ============================================================
# LOAD DATA
# ============================================================

def load_data(path: Path = RAW_DATA_PATH) -> pd.DataFrame:
    """Load the raw flight pricing dataset."""

    if not path.exists():
        raise FileNotFoundError(
            f"Dataset not found at: {path}"
        )

    return pd.read_csv(path)


# ============================================================
# BASIC CLEANING
# ============================================================

def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """Remove exact duplicate rows."""

    return df.drop_duplicates().copy()


def clean_string_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Strip whitespace from string columns."""

    df = df.copy()

    string_columns = df.select_dtypes(
        include=["string", "object"]
    ).columns

    for column in string_columns:
        df[column] = df[column].astype("string").str.strip()

    return df


# ============================================================
# AIRLINE
# ============================================================

def clean_airline(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize airline names and casing."""

    df = df.copy()

    df["Airline"] = (
        df["Airline"]
        .astype("string")
        .str.strip()
        .str.title()
    )

    return df


# ============================================================
# SOURCE / DESTINATION
# ============================================================

def clean_locations(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize city, airport-name and IATA-code representations."""

    df = df.copy()

    for column in ["Source", "Destination"]:
        df[column] = (
            df[column]
            .astype("string")
            .str.strip()
            .replace(LOCATION_MAP)
        )

    return df


# ============================================================
# DATE
# ============================================================

def clean_departure_date(df: pd.DataFrame) -> pd.DataFrame:
    """Convert departure date and derive useful calendar features."""

    df = df.copy()

    df["Departure_Date"] = pd.to_datetime(
        df["Departure_Date"],
        errors="coerce",
    )

    df["Departure_Year"] = df["Departure_Date"].dt.year
    df["Departure_Month"] = df["Departure_Date"].dt.month
    df["Departure_Day"] = df["Departure_Date"].dt.day
    df["Departure_DayOfWeek"] = (
        df["Departure_Date"].dt.dayofweek
    )

    return df


# ============================================================
# TIME
# ============================================================

def extract_hour(time_series: pd.Series) -> pd.Series:
    """
    Convert mixed 12-hour and 24-hour time strings into hour values.

    Examples:
        8:10 PM -> 20
        07:05   -> 7
        23:30   -> 23
    """

    parsed = pd.to_datetime(
        time_series,
        format="mixed",
        errors="coerce",
    )

    return parsed.dt.hour


def clean_times(df: pd.DataFrame) -> pd.DataFrame:
    """Extract departure and arrival hour from mixed time formats."""

    df = df.copy()

    df["Departure_Hour"] = extract_hour(
        df["Departure_Time"]
    )

    df["Arrival_Hour"] = extract_hour(
        df["Arrival_Time"]
    )

    return df


# ============================================================
# DURATION
# ============================================================

def convert_duration_to_minutes(value) -> float:
    """
    Convert supported duration formats to minutes.

    Supported examples:
        1.67      -> decimal hours
        0.75      -> decimal hours
        3h 11m    -> 191 minutes
        177 min   -> 177 minutes
    """

    if pd.isna(value):
        return float("nan")

    value = str(value).strip().lower()

    # --------------------------------------------------------
    # Format: "3h 11m"
    # --------------------------------------------------------

    if "h" in value:

        hours = 0
        minutes = 0

        parts = value.split("h")

        try:
            hours = float(parts[0].strip())

            if len(parts) > 1:
                minute_part = (
                    parts[1]
                    .replace("m", "")
                    .strip()
                )

                if minute_part:
                    minutes = float(minute_part)

            return hours * 60 + minutes

        except ValueError:
            return float("nan")

    # --------------------------------------------------------
    # Format: "177 min"
    # --------------------------------------------------------

    if "min" in value:

        try:
            return float(
                value.replace("min", "").strip()
            )

        except ValueError:
            return float("nan")

    # --------------------------------------------------------
    # Format: decimal hours
    # --------------------------------------------------------

    try:
        decimal_hours = float(value)

        return decimal_hours * 60

    except ValueError:
        return float("nan")


def clean_duration(df: pd.DataFrame) -> pd.DataFrame:
    """Convert all duration formats to minutes."""

    df = df.copy()

    df["Duration_Minutes"] = (
        df["Duration"]
        .apply(convert_duration_to_minutes)
        .round()
    )

    return df


# ============================================================
# TOTAL STOPS
# ============================================================

def clean_total_stops(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize stop descriptions into numeric values."""

    df = df.copy()

    stops = (
        df["Total_Stops"]
        .astype("string")
        .str.strip()
        .str.lower()
    )

    stops = stops.replace(
        {
            "non-stop": "0",
            "non stop": "0",
            "0 stops": "0",
            "1 stop": "1",
            "2 stops": "2",
        }
    )

    df["Total_Stops"] = pd.to_numeric(
        stops,
        errors="coerce",
    )

    return df


# ============================================================
# NUMERICAL COLUMNS
# ============================================================

def clean_numeric_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Convert numeric columns from strings to numeric values."""

    df = df.copy()

    numeric_columns = [
        "Distance_km",
        "Days_Before_Departure",
    ]

    for column in numeric_columns:
        df[column] = pd.to_numeric(
            df[column],
            errors="coerce",
        )

    return df


# ============================================================
# PASSENGER COUNT
# ============================================================

def clean_passenger_count(df: pd.DataFrame) -> pd.DataFrame:
    """Convert numeric and word-based passenger counts to integers."""

    df = df.copy()

    passenger_count = (
        df["Passenger_Count"]
        .astype("string")
        .str.strip()
        .str.lower()
        .replace(PASSENGER_COUNT_MAP)
    )

    df["Passenger_Count"] = pd.to_numeric(
        passenger_count,
        errors="coerce",
    )

    return df


# ============================================================
# PRICE
# ============================================================

def clean_price(df: pd.DataFrame) -> pd.DataFrame:
    """Convert formatted price strings into numeric values."""

    df = df.copy()

    price = (
        df["Price"]
        .astype("string")
        .str.strip()
        .str.replace(
            r"Rs\.\s*",
            "",
            regex=True,
        )
        .str.replace(
            ",",
            "",
            regex=False,
        )
    )

    df["Price"] = pd.to_numeric(
        price,
        errors="coerce",
    )

    return df


# ============================================================
# CATEGORICAL MISSING VALUES
# ============================================================

def handle_categorical_missing_values(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Fill missing categorical values with 'Unknown'.

    We do this only for categorical columns where
    retaining the row is useful for analysis.
    """

    df = df.copy()

    categorical_columns = [
        "Airline",
        "Source",
        "Destination",
        "Travel_Class",
        "Season",
        "Weekday",
        "Aircraft_Type",
        "Booking_Channel",
    ]

    for column in categorical_columns:
        df[column] = (
            df[column]
            .astype("string")
            .fillna("Unknown")
        )

    return df


# ============================================================
# VALIDATION
# ============================================================

def validate_data(df: pd.DataFrame) -> None:
    """Run basic validation checks on the processed dataset."""

    required_columns = [
        "Flight_ID",
        "Airline",
        "Source",
        "Destination",
        "Duration_Minutes",
        "Total_Stops",
        "Distance_km",
        "Passenger_Count",
        "Price",
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    if df["Flight_ID"].duplicated().any():
        print(
            "Warning: duplicate Flight_ID values detected."
        )

    if (df["Duration_Minutes"] < 0).any():
        raise ValueError(
            "Negative duration values detected."
        )

    if (df["Distance_km"] < 0).any():
        raise ValueError(
            "Negative distance values detected."
        )

    if (df["Price"] < 0).any():
        raise ValueError(
            "Negative price values detected."
        )


# ============================================================
# MAIN PIPELINE
# ============================================================

def preprocess(
    input_path: Path = RAW_DATA_PATH,
    output_path: Path = PROCESSED_DATA_PATH,
) -> pd.DataFrame:
    """Run the complete preprocessing pipeline."""

    print("Loading dataset...")
    df = load_data(input_path)

    original_rows = len(df)

    print(f"Original rows: {original_rows:,}")

    # Basic cleaning
    df = remove_duplicates(df)

    print(
        f"Rows after duplicate removal: {len(df):,}"
    )

    df = clean_string_columns(df)

    # Feature-specific cleaning
    df = clean_airline(df)
    df = clean_locations(df)
    df = clean_departure_date(df)
    df = clean_times(df)
    df = clean_duration(df)
    df = clean_total_stops(df)
    df = clean_numeric_columns(df)
    df = clean_passenger_count(df)
    df = clean_price(df)

    # Missing categorical values
    df = handle_categorical_missing_values(df)

    # Validation
    validate_data(df)

    # Create output directory
    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    # Save processed dataset
    df.to_csv(
        output_path,
        index=False,
    )

    print("\nPreprocessing complete.")
    print(f"Final rows    : {len(df):,}")
    print(f"Final columns : {len(df.columns)}")
    print(f"Saved to      : {output_path}")

    return df


if __name__ == "__main__":
    preprocess()