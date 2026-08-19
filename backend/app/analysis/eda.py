from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[3]

DATA_PATH = (
    BASE_DIR
    / "data"
    / "processed"
    / "flight_prices_clean.csv"
)

OUTPUT_DIR = (
    BASE_DIR
    / "outputs"
    / "plots"
)

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# LOAD DATA
# ============================================================

def load_data() -> pd.DataFrame:
    """Load the processed flight dataset."""

    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Processed dataset not found: {DATA_PATH}"
        )

    return pd.read_csv(DATA_PATH)


# ============================================================
# HELPER
# ============================================================

def save_plot(filename: str) -> None:
    """Save the current matplotlib figure."""

    output_path = OUTPUT_DIR / filename

    plt.tight_layout()
    plt.savefig(
        output_path,
        dpi=150,
        bbox_inches="tight",
    )

    plt.close()

    print(f"Saved: {output_path}")


# ============================================================
# 1. PRICE DISTRIBUTION
# ============================================================

def plot_price_distribution(df: pd.DataFrame) -> None:
    """Visualize the distribution of flight prices."""

    plt.figure(figsize=(10, 6))

    sns.histplot(
        data=df,
        x="Price",
        bins=60,
        kde=True,
    )

    plt.title("Flight Price Distribution")
    plt.xlabel("Price")
    plt.ylabel("Number of Flights")

    save_plot("01_price_distribution.png")


# ============================================================
# 2. PRICE BY AIRLINE
# ============================================================

def plot_price_by_airline(df: pd.DataFrame) -> None:
    """Compare average flight prices across airlines."""

    airline_prices = (
        df[df["Airline"] != "Unknown"]
        .groupby("Airline")["Price"]
        .mean()
        .sort_values(ascending=False)
    )

    plt.figure(figsize=(12, 7))

    sns.barplot(
        x=airline_prices.values,
        y=airline_prices.index,
    )

    plt.title("Average Flight Price by Airline")
    plt.xlabel("Average Price")
    plt.ylabel("Airline")

    save_plot("02_price_by_airline.png")


# ============================================================
# 3. PRICE BY TRAVEL CLASS
# ============================================================

def plot_price_by_class(df: pd.DataFrame) -> None:
    """Compare flight prices across travel classes."""

    class_order = [
        "Economy",
        "Premium Economy",
        "Business",
        "First",
    ]

    plt.figure(figsize=(10, 6))

    sns.boxplot(
        data=df,
        x="Travel_Class",
        y="Price",
        order=class_order,
    )

    plt.title("Flight Price Distribution by Travel Class")
    plt.xlabel("Travel Class")
    plt.ylabel("Price")

    save_plot("03_price_by_travel_class.png")


# ============================================================
# 4. PRICE BY STOPS
# ============================================================

def plot_price_by_stops(df: pd.DataFrame) -> None:
    """Analyze the relationship between stops and price."""

    stops = (
        df.dropna(subset=["Total_Stops"])
        .groupby("Total_Stops")["Price"]
        .mean()
        .reset_index()
    )

    plt.figure(figsize=(9, 6))

    sns.barplot(
        data=stops,
        x="Total_Stops",
        y="Price",
    )

    plt.title("Average Price by Number of Stops")
    plt.xlabel("Number of Stops")
    plt.ylabel("Average Price")

    save_plot("04_price_by_stops.png")


# ============================================================
# 5. PRICE VS DURATION
# ============================================================

def plot_price_vs_duration(df: pd.DataFrame) -> None:
    """Analyze the relationship between duration and price."""

    plot_df = df.dropna(
        subset=[
            "Duration_Minutes",
            "Price",
        ]
    )

    # Sample for faster plotting with large datasets
    if len(plot_df) > 10_000:
        plot_df = plot_df.sample(
            10_000,
            random_state=42,
        )

    plt.figure(figsize=(10, 6))

    sns.scatterplot(
        data=plot_df,
        x="Duration_Minutes",
        y="Price",
        alpha=0.35,
    )

    plt.title("Flight Price vs Duration")
    plt.xlabel("Duration (Minutes)")
    plt.ylabel("Price")

    save_plot("05_price_vs_duration.png")


# ============================================================
# 6. PRICE BY BOOKING CHANNEL
# ============================================================

def plot_price_by_booking_channel(
    df: pd.DataFrame,
) -> None:
    """Compare average prices across booking channels."""

    channel_prices = (
        df[df["Booking_Channel"] != "Unknown"]
        .groupby("Booking_Channel")["Price"]
        .mean()
        .sort_values(ascending=False)
    )

    plt.figure(figsize=(10, 6))

    sns.barplot(
        x=channel_prices.values,
        y=channel_prices.index,
    )

    plt.title("Average Flight Price by Booking Channel")
    plt.xlabel("Average Price")
    plt.ylabel("Booking Channel")

    save_plot("06_price_by_booking_channel.png")


# ============================================================
# 7. PRICE BY SOURCE
# ============================================================

def plot_price_by_source(df: pd.DataFrame) -> None:
    """Compare average prices across departure cities."""

    source_prices = (
        df[df["Source"] != "Unknown"]
        .groupby("Source")["Price"]
        .mean()
        .sort_values(ascending=False)
    )

    plt.figure(figsize=(11, 7))

    sns.barplot(
        x=source_prices.values,
        y=source_prices.index,
    )

    plt.title("Average Flight Price by Source")
    plt.xlabel("Average Price")
    plt.ylabel("Source")

    save_plot("07_price_by_source.png")


# ============================================================
# 8. PRICE BY SEASON
# ============================================================

def plot_price_by_season(df: pd.DataFrame) -> None:
    """Compare average prices across seasons."""

    season_prices = (
        df[df["Season"] != "Unknown"]
        .groupby("Season")["Price"]
        .mean()
        .sort_values(ascending=False)
    )

    plt.figure(figsize=(9, 6))

    sns.barplot(
        x=season_prices.index,
        y=season_prices.values,
    )

    plt.title("Average Flight Price by Season")
    plt.xlabel("Season")
    plt.ylabel("Average Price")

    save_plot("08_price_by_season.png")


# ============================================================
# 9. PRICE BY ADVANCE BOOKING
# ============================================================

def plot_price_vs_days_before_departure(
    df: pd.DataFrame,
) -> None:
    """Analyze how booking lead time relates to price."""

    plot_df = df.dropna(
        subset=[
            "Days_Before_Departure",
            "Price",
        ]
    )

    if len(plot_df) > 10_000:
        plot_df = plot_df.sample(
            10_000,
            random_state=42,
        )

    plt.figure(figsize=(10, 6))

    sns.scatterplot(
        data=plot_df,
        x="Days_Before_Departure",
        y="Price",
        alpha=0.35,
    )

    plt.title(
        "Flight Price vs Days Before Departure"
    )
    plt.xlabel("Days Before Departure")
    plt.ylabel("Price")

    save_plot("09_price_vs_days_before_departure.png")


# ============================================================
# 10. CORRELATION MATRIX
# ============================================================

def plot_correlation_matrix(
    df: pd.DataFrame,
) -> None:
    """Visualize correlations between numerical features."""

    numerical_columns = [
        "Price",
        "Total_Stops",
        "Distance_km",
        "Days_Before_Departure",
        "Passenger_Count",
        "Departure_Year",
        "Departure_Month",
        "Departure_DayOfWeek",
        "Departure_Hour",
        "Arrival_Hour",
        "Duration_Minutes",
    ]

    correlation = (
        df[numerical_columns]
        .corr()
    )

    plt.figure(figsize=(11, 9))

    sns.heatmap(
        correlation,
        annot=True,
        fmt=".2f",
        cmap="coolwarm",
        center=0,
    )

    plt.title(
        "Correlation Matrix — Numerical Features"
    )

    save_plot("10_correlation_matrix.png")


# ============================================================
# SUMMARY STATISTICS
# ============================================================

def print_eda_summary(df: pd.DataFrame) -> None:
    """Print useful numerical EDA findings."""

    print("\n" + "=" * 60)
    print("EDA SUMMARY")
    print("=" * 60)

    print("\nDataset:")
    print(f"Rows: {len(df):,}")

    print("\nPrice:")
    print(
        df["Price"]
        .describe()
        .to_string()
    )

    print("\nAverage price by airline:")
    print(
        df[df["Airline"] != "Unknown"]
        .groupby("Airline")["Price"]
        .mean()
        .sort_values(ascending=False)
        .round(2)
        .to_string()
    )

    print("\nAverage price by travel class:")
    print(
        df[df["Travel_Class"] != "Unknown"]
        .groupby("Travel_Class")["Price"]
        .mean()
        .sort_values(ascending=False)
        .round(2)
        .to_string()
    )

    print("\nAverage price by number of stops:")
    print(
        df.groupby("Total_Stops")["Price"]
        .mean()
        .round(2)
        .to_string()
    )

    print("\nAverage price by season:")
    print(
        df[df["Season"] != "Unknown"]
        .groupby("Season")["Price"]
        .mean()
        .sort_values(ascending=False)
        .round(2)
        .to_string()
    )


# ============================================================
# MAIN
# ============================================================

def main() -> None:
    print("Loading processed dataset...")

    df = load_data()

    print(
        f"Loaded {len(df):,} rows."
    )

    print("\nGenerating EDA visualizations...\n")

    plot_price_distribution(df)
    plot_price_by_airline(df)
    plot_price_by_class(df)
    plot_price_by_stops(df)
    plot_price_vs_duration(df)
    plot_price_by_booking_channel(df)
    plot_price_by_source(df)
    plot_price_by_season(df)
    plot_price_vs_days_before_departure(df)
    plot_correlation_matrix(df)

    print_eda_summary(df)

    print("\nEDA complete.")


if __name__ == "__main__":
    main()