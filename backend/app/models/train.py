from pathlib import Path
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
    mean_absolute_error,
    root_mean_squared_error,
    r2_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from feature_engineering import build_preprocessor, load_features_and_target

def evaluate_model(name, model, X_test, y_test):
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    rmse = root_mean_squared_error(
    y_test,
    predictions,
    )
    r2 = r2_score(y_test, predictions)
    print("\n" + "=" * 60)
    print(name)
    print("=" * 60)
    print(f"MAE  : ₹{mae:,.2f}")
    print(f"RMSE : ₹{rmse:,.2f}")
    print(f"R²   : {r2:.4f}")
    return {
        "model": name,
        "mae": mae,
        "rmse": rmse,
        "r2": r2,
    }


def main():
    print("=" * 60)
    print("FARESIGHT — MODEL TRAINING")
    print("=" * 60)
    # ---------------------------------------------------------
    # 1. Load data
    # ---------------------------------------------------------
    X, y = load_features_and_target()
    # Remove rows where target price is missing.
    valid_target = y.notna()
    X = X.loc[valid_target]
    y = y.loc[valid_target]
    print(f"\nRows available for training: {len(X):,}")
    # ---------------------------------------------------------
    # 2. Train/test split
    # ---------------------------------------------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
    )
    print(f"Training rows: {len(X_train):,}")
    print(f"Testing rows : {len(X_test):,}")
    # ---------------------------------------------------------
    # 3. Preprocessor
    # ---------------------------------------------------------
    preprocessor = build_preprocessor()
    # ---------------------------------------------------------
    # 4. Linear Regression
    # ---------------------------------------------------------
    linear_model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", LinearRegression()),
        ]
    )
    print("\nTraining Linear Regression...")
    linear_model.fit(X_train, y_train)
    linear_results = evaluate_model(
        "Linear Regression",
        linear_model,
        X_test,
        y_test,
    )
    # ---------------------------------------------------------
    # 5. Random Forest
    # ---------------------------------------------------------
    preprocessor_rf = build_preprocessor()
    random_forest_model = Pipeline(
        steps=[
            ("preprocessor", preprocessor_rf),
            (
                "model",
                RandomForestRegressor(
                    n_estimators=150,
                    max_depth=20,
                    min_samples_split=5,
                    random_state=42,
                    n_jobs=-1,
                ),
            ),
        ]
    )
    print("\nTraining Random Forest...")
    random_forest_model.fit(X_train, y_train)
    rf_results = evaluate_model(
        "Random Forest",
        random_forest_model,
        X_test,
        y_test,
    )
    # ---------------------------------------------------------
    # 6. Compare
    # ---------------------------------------------------------
    results = pd.DataFrame(
        [
            linear_results,
            rf_results,
        ]
    )
    print("\n" + "=" * 60)
    print("MODEL COMPARISON")
    print("=" * 60)
    print(results.to_string(index=False))
    # ---------------------------------------------------------
    # 7. Save models
    # ---------------------------------------------------------
    project_root = Path(__file__).resolve().parents[3]
    model_directory = project_root / "models"
    model_directory.mkdir(exist_ok=True)
    joblib.dump(
        linear_model,
        model_directory / "linear_regression.joblib",
    )
    joblib.dump(
        random_forest_model,
        model_directory / "random_forest.joblib",
    )
    print("\nModels saved to:")
    print(model_directory)

if __name__ == "__main__":
    main()