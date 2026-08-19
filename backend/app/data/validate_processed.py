from pathlib import Path

import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[3]

DATA_PATH = (
    BASE_DIR
    / "data"
    / "processed"
    / "flight_prices_clean.csv"
)


def main() -> None:
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Processed dataset not found: {DATA_PATH}"
        )

    df = pd.read_csv(DATA_PATH)

    print("\n" + "=" * 60)
    print("PROCESSED DATASET VALIDATION")
    print("=" * 60)

    print(f"Rows    : {df.shape[0]:,}")
    print(f"Columns : {df.shape[1]}")

    print("\n" + "=" * 60)
    print("COLUMNS")
    print("=" * 60)

    for column in df.columns:
        print(f"- {column}")

    print("\n" + "=" * 60)
    print("DATA TYPES")
    print("=" * 60)

    print(df.dtypes.to_string())

    print("\n" + "=" * 60)
    print("MISSING VALUES")
    print("=" * 60)

    missing = df.isna().sum()
    missing = missing[missing > 0]

    if missing.empty:
        print("No missing values.")
    else:
        missing_percentage = (
            missing / len(df) * 100
        ).round(2)

        summary = pd.DataFrame(
            {
                "Missing": missing,
                "Percentage": missing_percentage,
            }
        )

        print(summary.to_string())

    print("\n" + "=" * 60)
    print("DUPLICATES")
    print("=" * 60)

    print(
        f"Duplicate rows: {df.duplicated().sum():,}"
    )

    print("\n" + "=" * 60)
    print("SAMPLE CLEANED ROWS")
    print("=" * 60)

    print(
        df.head(10).to_string(index=False)
    )

    print("\n" + "=" * 60)
    print("DURATION CHECK")
    print("=" * 60)

    print(
        df["Duration_Minutes"]
        .describe()
        .to_string()
    )

    print("\n" + "=" * 60)
    print("PRICE CHECK")
    print("=" * 60)

    print(
        df["Price"]
        .describe()
        .to_string()
    )

    print("\n" + "=" * 60)
    print("LOCATION CHECK")
    print("=" * 60)

    print("\nSources:")
    print(
        df["Source"]
        .value_counts()
        .head(25)
        .to_string()
    )

    print("\nDestinations:")
    print(
        df["Destination"]
        .value_counts()
        .head(25)
        .to_string()
    )


if __name__ == "__main__":
    main()