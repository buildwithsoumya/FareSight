from pathlib import Path
import joblib
import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import (
    mean_absolute_error,
    root_mean_squared_error,
    r2_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from feature_engineering import (
    CATEGORICAL_FEATURES,
    NUMERICAL_FEATURES,
    build_preprocessor,
    load_features_and_target,
)
def evaluate_model(model, X_test, y_test):
    """Evaluate the trained model."""
    predictions = model.predict(X_test)
    mae = mean_absolute_error(
        y_test,
        predictions,
    )
    rmse = root_mean_squared_error(
        y_test,
        predictions,
    )
    r2 = r2_score(
        y_test,
        predictions,
    )
    print("\n" + "=" * 60)
    print("HISTOGRAM GRADIENT BOOSTING")
    print("=" * 60)
    print(f"MAE  : ₹{mae:,.2f}")
    print(f"RMSE : ₹{rmse:,.2f}")
    print(f"R²   : {r2:.4f}")
    return {
        "Model": "HistGradientBoosting",
        "MAE": mae,
        "RMSE": rmse,
        "R²": r2,
    }
def main():
    print("=" * 60)
    print("FARESIGHT — GRADIENT BOOSTING EXPERIMENT")
    print("=" * 60)
    # ---------------------------------------------------------
    # 1. Load data
    # ---------------------------------------------------------
    X, y = load_features_and_target()
    valid_target = y.notna()
    X = X.loc[valid_target]
    y = y.loc[valid_target]
    print(
        f"\nRows available: {len(X):,}"
    )
    # ---------------------------------------------------------
    # 2. Train/test split
    # ---------------------------------------------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
    )
    print(
        f"Training rows: {len(X_train):,}"
    )
    print(
        f"Testing rows : {len(X_test):,}"
    )
    # ---------------------------------------------------------
    # 3. Preprocessor
    # ---------------------------------------------------------
    preprocessor = build_preprocessor()
    # ---------------------------------------------------------
    # 4. Model
    # ---------------------------------------------------------
    model = Pipeline(
        steps=[
            (
                "preprocessor",
                preprocessor,
            ),
            (
                "model",
                HistGradientBoostingRegressor(
                    max_iter=200,
                    learning_rate=0.08,
                    max_leaf_nodes=31,
                    l2_regularization=1.0,
                    random_state=42,
                ),
            ),
        ]
    )
    # ---------------------------------------------------------
    # 5. Train
    # ---------------------------------------------------------
    print("\nTraining HistGradientBoosting...")
    model.fit(
        X_train,
        y_train,
    )
    # ---------------------------------------------------------
    # 6. Evaluate
    # ---------------------------------------------------------
    results = evaluate_model(
        model,
        X_test,
        y_test,
    )
    # ---------------------------------------------------------
    # 7. Save model
    # ---------------------------------------------------------
    project_root = Path(__file__).resolve().parents[3]
    model_directory = (
        project_root / "models"
    )
    model_directory.mkdir(
        exist_ok=True
    )
    model_path = (
        model_directory
        / "hist_gradient_boosting.joblib"
    )
    joblib.dump(
        model,
        model_path,
    )
    print("\nModel saved to:")
    print(model_path)
    # ---------------------------------------------------------
    # 8. Summary
    # ---------------------------------------------------------
    print("\n" + "=" * 60)
    print("RESULT SUMMARY")
    print("=" * 60)
    print(
        f"MAE  : ₹{results['MAE']:,.2f}"
    )
    print(
        f"RMSE : ₹{results['RMSE']:,.2f}"
    )
    print(
        f"R²   : {results['R²']:.4f}"
    )
    print("\nExperiment complete.")

if __name__ == "__main__":
    main()