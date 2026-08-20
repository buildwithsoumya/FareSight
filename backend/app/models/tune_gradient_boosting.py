from pathlib import Path
import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import(
    mean_absolute_error,
    root_mean_squared_error,
    r2_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from feature_engineering import(
    build_preprocessor,
    load_features_and_target,
)

def evaluate_model(model, X_test, y_test):
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    rmse = root_mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    return mae, rmse, r2

def main():
    print("=" * 60)
    print("FARESIGHT - HISTGRADIENTBOOSTING TUNING")
    print("=" * 60)
    # ---------------------------------------------------------
    # 1. Load dataset
    # ---------------------------------------------------------
    print("\nLoading processed dataset...")
    X, y = load_features_and_target()
    valid_target = y.notna()
    X = X.loc[valid_target]
    y = y.loc[valid_target]
    print(f"Rows available: {len(X):,}")
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
    # 3. Hyperparameter configurations
    # ---------------------------------------------------------
    experiments = [
        {
            "name": "Baseline",
            "learning_rate": 0.08,
            "max_iter": 200,
            "max_leaf_nodes": 31,
            "l2_regularization": 1.0,
        },
        {
            "name": "Lower Learning Rate",
            "learning_rate": 0.05,
            "max_iter": 300,
            "max_leaf_nodes": 31,
            "l2_regularization": 1.0,
        },
        {
            "name": "More Iterations",
            "learning_rate": 0.08,
            "max_iter": 300,
            "max_leaf_nodes": 31,
            "l2_regularization": 1.0,
        },
        {
            "name": "More Leaves",
            "learning_rate": 0.05,
            "max_iter": 400,
            "max_leaf_nodes": 63,
            "l2_regularization": 1.0,
        },
        {
            "name": "Lower LR + More Leaves",
            "learning_rate": 0.08,
            "max_iter": 300,
            "max_leaf_nodes": 63,
            "l2_regularization": 1.0,
        },
        {
            "name": "High Capacity",
            "learning_rate": 0.05,
            "max_iter": 500,
            "max_leaf_nodes": 63,
            "l2_regularization": 1.0,
        },
    ]
    results = []
    # ---------------------------------------------------------
    # 4. Run experiments
    # ---------------------------------------------------------
    for i, config in enumerate(experiments, start=1):
        print("\n" + "-" * 60)
        print(f"Experiment {i}: {config['name']}")
        print("-" * 60)

        print(
            f"learning_rate  = {config['learning_rate']}"
        )
        print(
            f"max_iter       = {config['max_iter']}"
        )
        print(
            f"max_leaf_nodes = {config['max_leaf_nodes']}"
        )
        print(
            f"l2_regularization = "
            f"{config['l2_regularization']}"
        )
        preprocessor = build_preprocessor()
        model = Pipeline(
            steps=[
                (
                    "preprocessor",
                    preprocessor,
                ),
                (
                    "model",
                    HistGradientBoostingRegressor(
                        learning_rate=config["learning_rate"],
                        max_iter=config["max_iter"],
                        max_leaf_nodes=config["max_leaf_nodes"],
                        l2_regularization=config[
                            "l2_regularization"
                        ],
                        random_state=42,
                    ),
                ),
            ]
        )
        print("\nTraining...")
        model.fit(
            X_train,
            y_train,
        )
        mae, rmse, r2 = evaluate_model(
            model,
            X_test,
            y_test,
        )
        print("\nResults:")
        print(f"MAE  : ₹{mae:,.2f}")
        print(f"RMSE : ₹{rmse:,.2f}")
        print(f"R²   : {r2:.4f}")
        results.append(
            {
                "Experiment": config["name"],
                "Learning_Rate": config["learning_rate"],
                "Max_Iter": config["max_iter"],
                "Max_Leaf_Nodes": config["max_leaf_nodes"],
                "L2_Regularization": config[
                    "l2_regularization"
                ],
                "MAE": mae,
                "RMSE": rmse,
                "R2": r2,
            }
        )
    # ---------------------------------------------------------
    # 5. Results table
    # ---------------------------------------------------------
    results_df = pd.DataFrame(results)
    print("\n" + "=" * 60)
    print("HYPERPARAMETER TUNING RESULTS")
    print("=" * 60)
    print(
        results_df.to_string(
            index=False,
            formatters={
                "MAE": lambda x: f"₹{x:,.2f}",
                "RMSE": lambda x: f"₹{x:,.2f}",
                "R2": lambda x: f"{x:.4f}",
            },
        )
    )
    # ---------------------------------------------------------
    # 6. Select best model
    # ---------------------------------------------------------
    best_index = results_df["MAE"].idxmin()
    best_result = results_df.loc[best_index]
    print("\n" + "=" * 60)
    print("BEST CONFIGURATION")
    print("=" * 60)
    print(
        f"Experiment : {best_result['Experiment']}"
    )
    print(
        f"MAE        : ₹{best_result['MAE']:,.2f}"
    )
    print(
        f"RMSE       : ₹{best_result['RMSE']:,.2f}"
    )
    print(
        f"R²         : {best_result['R2']:.4f}"
    )
    # ---------------------------------------------------------
    # 7. Save experiment results
    # ---------------------------------------------------------
    project_root = Path(__file__).resolve().parents[3]
    output_directory = (
        project_root
        / "outputs"
        / "experiments"
    )
    output_directory.mkdir(
        parents=True,
        exist_ok=True,
    )
    output_path = (
        output_directory
        / "gradient_boosting_tuning.csv"
    )
    results_df.to_csv(
        output_path,
        index=False,
    )
    print("\nExperiment results saved to:")
    print(output_path)
    print("\nExperiment complete.")

if __name__ == "__main__":
    main()