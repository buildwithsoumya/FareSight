from pathlib import Path
import pandas as pd
DATA_PATH = (
    Path(__file__).resolve().parents[3]
    / "data"
    / "flight_pricing_dataset.csv"
)

def main() -> None:
    df = pd.read_csv(DATA_PATH)
    print("\n"+"="*60)
    print("1. DATASET SHAPE")
    print("=" * 60)
    print(f"Rows    : {df.shape[0]:,}")
    print(f"Columns : {df.shape[1]}")
    # ---------------------------------------------------------
    # SOURCE / DESTINATION
    # ---------------------------------------------------------
    print("\n" + "=" * 60)
    print("2. SOURCE VALUES")
    print("=" * 60)
    print(
        df["Source"]
        .value_counts(dropna=False)
        .to_string()
    )
    print("\n" + "=" * 60)
    print("3. DESTINATION VALUES")
    print("=" * 60)
    print(
        df["Destination"]
        .value_counts(dropna=False)
        .to_string()
    )
    # ---------------------------------------------------------
    # DURATION
    # ---------------------------------------------------------
    print("\n" + "=" * 60)
    print("4. DURATION — RAW VALUES")
    print("=" * 60)
    print(
        df["Duration"]
        .value_counts(dropna=False)
        .head(50)
        .to_string()
    )
    # ---------------------------------------------------------
    # PRICE
    # ---------------------------------------------------------
    print("\n" + "=" * 60)
    print("5. PRICE — RAW DATA")
    print("=" * 60)
    print("Data type:")
    print(df["Price"].dtype)
    print("\nMissing prices:")
    print(df["Price"].isna().sum())
    print("\nPrice examples:")
    print(df["Price"].dropna().head(30).to_string(index=False))
    # ---------------------------------------------------------
    # CLEAN PRICE TEMPORARILY FOR ANALYSIS
    # ---------------------------------------------------------
    price_numeric = (
        df["Price"]
        .astype("string")
        .str.replace(r"Rs\.\s*", "", regex=True)
        .str.replace(",", "", regex=False)
        .str.strip()
    )
    price_numeric = pd.to_numeric(
        price_numeric,
        errors="coerce"
    )
    print("\n" + "=" * 60)
    print("6. PRICE — TEMPORARY NUMERICAL ANALYSIS")
    print("=" * 60)
    print(price_numeric.describe())
    print("\nLowest 10 prices:")
    print(
        price_numeric
        .nsmallest(10)
        .to_string(index=False)
    )
    print("\nHighest 10 prices:")
    print(
        price_numeric
        .nlargest(10)
        .to_string(index=False)
    )
    # ---------------------------------------------------------
    # DUPLICATES
    # ---------------------------------------------------------
    print("\n" + "=" * 60)
    print("7. DUPLICATES")
    print("=" * 60)
    duplicate_count = df.duplicated().sum()
    print(f"Duplicate rows: {duplicate_count:,}")
    # ---------------------------------------------------------
    # MISSING VALUES
    # ---------------------------------------------------------
    print("\n" + "=" * 60)
    print("8. MISSING VALUES")
    print("=" * 60)
    missing = df.isna().sum()
    missing_percentage = (
        missing / len(df) * 100
    ).round(2)
    missing_summary = pd.DataFrame(
        {
            "Missing": missing,
            "Percentage": missing_percentage,
        }
    )
    print(
        missing_summary
        .sort_values("Missing", ascending=False)
        .to_string()
    )

if __name__ == "__main__":
    main()