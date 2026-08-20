from pathlib import Path
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_absolute_error,
    root_mean_squared_error,\
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

def evaluate_model(name, model, X_test, y_test):
    """Train/evaluate a model and return metrics."""
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
    print("\n"+"="*60)
    print(name)
    print("="*60)
    print(f"MAE: ₹{mae:,.2f}")
    print(f"RMSE: ₹{rmse:,.2f}")
    print(f"R²: {r2:.4f}")
    return{
        "Model": name,
        "MAE": mae,
        "RMSE": rmse,
        "R²": r2,
    }
def build_random_forest():
    """Create a standard FareSight Random Forest pipeline."""
    preprocessor = build_preprocessor()
    model = Pipeline(
        steps=[
            (
                "preprocessor",
                preprocessor,
            ),
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
    return model

def main():
    print("="*60)
    print("FARESIGHT - FEATURE SELECTION EXPERIMENT")
    print("="*60)
    X, y = load_features_and_target()
    #Remove rows where target is missing
    valid_target = y.notna()
    X = X.loc[valid_target]
    y = y.loc[valid_target]
    print(f"\nRows available: {len(X):,}")
    #Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
    )
    #Feature configuration
    feature_sets = {
        "Both Distance + Duration": (
            NUMERICAL_FEATURES
        ),
        "Distance Only": [
            feature
            for feature in NUMERICAL_FEATURES
            if feature != "Duration_Minutes"
        ],
        "Duration Only": [
            feature
            for feature in NUMERICAL_FEATURES
            if feature != "Distance_km"
        ],
    }
    results = []
    #Train each experiment
    for name, numerical_features in feature_sets.items():
        print("\n" + "-" * 60)
        print(f"Experiment: {name}")
        print("-" * 60)
        # Build a custom preprocessor for this experiment.
        from sklearn.compose import ColumnTransformer
        from sklearn.impute import SimpleImputer
        from sklearn.preprocessing import OneHotEncoder
        from sklearn.pipeline import Pipeline
        numerical_pipeline = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(
                        strategy="median"
                    ),
                )
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
                    numerical_features,
                ),
                (
                    "categorical",
                    categorical_pipeline,
                    CATEGORICAL_FEATURES,
                ),
            ]
        )

        model = Pipeline(
            steps=[
                (
                    "preprocessor",
                    preprocessor,
                ),
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
        X_train_subset = X_train[
            numerical_features
            + CATEGORICAL_FEATURES
        ]
        X_test_subset = X_test[
            numerical_features
            + CATEGORICAL_FEATURES
        ]
        print("Training...")
        model.fit(
            X_train_subset,
            y_train,
        )
        result = evaluate_model(
            name,
            model,
            X_test_subset,
            y_test,
        )
        results.append(result)
    #Comparison
    results_df = pd.DataFrame(results)
    print("\n" + "=" * 60)
    print("FEATURE SELECTION RESULTS")
    print("=" * 60)
    print(
        results_df.to_string(
            index=False,
            formatters={
                "MAE": "₹{:,.2f}".format,
                "RMSE": "₹{:,.2f}".format,
                "R²": "{:.4f}".format,
            },
        )
    )
    #Best model
    best_model = results_df.loc[
        results_df["MAE"].idxmin()
    ]
    print("\n" + "=" * 60)
    print("BEST FEATURE CONFIGURATION")
    print("=" * 60)
    print(
        f"Model : {best_model['Model']}"
    )
    print(
        f"MAE   : ₹{best_model['MAE']:,.2f}"
    )
    print(
        f"RMSE  : ₹{best_model['RMSE']:,.2f}"
    )
    print(
        f"R²    : {best_model['R²']:.4f}"
    )
    print("\nExperiment complete.")

if __name__ == "__main__":
    main()