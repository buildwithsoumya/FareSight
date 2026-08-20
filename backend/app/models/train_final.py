from pathlib import Path
import json
import joblib
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.pipeline import Pipeline
from feature_engineering import (
    build_preprocessor,
    load_features_and_target,
)

def main():
    print("=" * 60)
    print("FARESIGHT — FINAL MODEL TRAINING")
    print("=" * 60)
    # ---------------------------------------------------------
    # 1. Load data
    # ---------------------------------------------------------
    print("\nLoading processed dataset...")
    X, y = load_features_and_target()
    valid_target = y.notna()
    X = X.loc[valid_target]
    y = y.loc[valid_target]
    print(f"Rows used for final training: {len(X):,}")
    # ---------------------------------------------------------
    # 2. Build preprocessing pipeline
    # ---------------------------------------------------------
    print("\nBuilding preprocessing pipeline...")
    preprocessor = build_preprocessor()
    # ---------------------------------------------------------
    # 3. Winning model configuration
    # ---------------------------------------------------------
    model_config = {
        "model": "HistGradientBoostingRegressor",
        "learning_rate": 0.05,
        "max_iter": 400,
        "max_leaf_nodes": 63,
        "l2_regularization": 1.0,
        "random_state": 42,
    }
    print("\nSelected configuration:")
    print("-" * 60)
    for key, value in model_config.items():
        print(f"{key}: {value}")
    # ---------------------------------------------------------
    # 4. Build final pipeline
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
                    learning_rate=model_config["learning_rate"],
                    max_iter=model_config["max_iter"],
                    max_leaf_nodes=model_config["max_leaf_nodes"],
                    l2_regularization=model_config[
                        "l2_regularization"
                    ],
                    random_state=model_config[
                        "random_state"
                    ],
                ),
            ),
        ]
    )
    # ---------------------------------------------------------
    # 5. Train on complete dataset
    # ---------------------------------------------------------
    print("\nTraining final model...")
    model.fit(
        X,
        y,
    )
    print("Training complete.")
    # ---------------------------------------------------------
    # 6. Save model
    # ---------------------------------------------------------
    project_root = Path(__file__).resolve().parents[3]
    model_directory = project_root / "models"
    model_directory.mkdir(
        parents=True,
        exist_ok=True,
    )
    model_path = (
        model_directory
        / "faresight_model.joblib"
    )
    joblib.dump(
        model,
        model_path,
    )
    print("\nFinal model saved to:")
    print(model_path)
    # ---------------------------------------------------------
    # 7. Save metadata
    # ---------------------------------------------------------
    metadata = {
        "model_name": "FareSight Final Model",
        "algorithm": "HistGradientBoostingRegressor",
        "training_rows": int(len(X)),
        "features": list(X.columns),
        "hyperparameters": model_config,
        "validation_metrics": {
            "mae": 13851.14,
            "rmse": 40048.69,
            "r2": 0.7080,
        },
    }
    metadata_path = (
        model_directory
        / "faresight_model_metadata.json"
    )
    with open(
        metadata_path,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            metadata,
            file,
            indent=4,
        )
    print("\nModel metadata saved to:")
    print(metadata_path)
    print("\n" + "=" * 60)
    print("FINAL MODEL READY")
    print("=" * 60)

if __name__ == "__main__":
    main()