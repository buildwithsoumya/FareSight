from pathlib import Path

import pandas as pd


DATA_PATH = (
    Path(__file__).resolve().parents[3]
    / "data"
    / "flight_pricing_dataset.csv"
)


def main() -> None:
    df = pd.read_csv(DATA_PATH)

    # ---------------------------------------------------------
    # PRICE INVESTIGATION
    # ---------------------------------------------------------

    price = (
        df["Price"]
        .astype("string")
        .str.replace(r"Rs\.\s*", "", regex=True)
        .str.replace(",", "", regex=False)
        .str.strip()
    )

    price = pd.to_numeric(price, errors="coerce")

    print("\n" + "=" * 60)
    print("PRICE QUANTILES")
    print("=" * 60)

    print(
        price.quantile(
            [0.01, 0.05, 0.10, 0.25, 0.50, 0.75, 0.90, 0.95, 0.99]
        )
    )

    print("\n" + "=" * 60)
    print("PRICES ABOVE 500,000")
    print("=" * 60)

    high_price_rows = df.loc[
        price > 500_000,
        ["Flight_ID", "Airline", "Source", "Destination", "Travel_Class", "Price"]
    ]

    print(high_price_rows.head(30).to_string(index=False))

    print(f"\nCount: {len(high_price_rows):,}")

    # ---------------------------------------------------------
    # DECIMAL DURATION VALUES
    # ---------------------------------------------------------

    duration = df["Duration"].astype("string").str.strip()

    decimal_duration = duration[
        duration.str.fullmatch(r"\d+(\.\d+)?", na=False)
    ]

    print("\n" + "=" * 60)
    print("DECIMAL-ONLY DURATION VALUES")
    print("=" * 60)

    print(
        decimal_duration
        .value_counts()
        .head(50)
        .to_string()
    )

    print(f"\nCount: {len(decimal_duration):,}")

    # ---------------------------------------------------------
    # MINUTE-BASED DURATION VALUES
    # ---------------------------------------------------------

    minute_duration = duration[
        duration.str.contains(
            r"\b\d+\s*min\b",
            case=False,
            regex=True,
            na=False,
        )
    ]

    print("\n" + "=" * 60)
    print("MINUTE-BASED DURATION VALUES")
    print("=" * 60)

    print(
        minute_duration
        .value_counts()
        .head(30)
        .to_string()
    )


if __name__ == "__main__":
    main()