from pathlib import Path
import joblib
import matplotlib.pyplot as plt
import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[3]
MODEL_PATH = BASE_DIR / "models" / "random_forest.joblib"
OUTPUT_DIR = BASE_DIR / "outputs" / "plots"

def main():
    print("=" * 60)
    print("FARESIGHT — FEATURE IMPORTANCE")
    print("=" * 60)
    print("\nLoading Random Forest model...")
    model = joblib.load(MODEL_PATH)
    preprocessor = model.named_steps["preprocessor"]
    random_forest = model.named_steps["model"]
    feature_names = preprocessor.get_feature_names_out()
    importances = random_forest.feature_importances_
    importance_df = pd.DataFrame(
        {
            "feature": feature_names,
            "importance": importances,
        }
    )
    importance_df = importance_df.sort_values(
        by="importance",
        ascending=False,
    )
    print("\nTop 15 Features:")
    print("-" * 60)
    for _, row in importance_df.head(15).iterrows():
        print(
            f"{row['feature']:<40}"
            f"{row['importance']:.4f}"
        )
    top_features = importance_df.head(15).sort_values(
        by="importance"
    )
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    plt.figure(figsize=(10, 7))
    plt.barh(
        top_features["feature"],
        top_features["importance"],
    )
    plt.xlabel("Importance")
    plt.ylabel("Feature")
    plt.title("FareSight — Random Forest Feature Importance")
    plt.tight_layout()
    output_path = OUTPUT_DIR / "11_feature_importance.png"
    plt.savefig(output_path, dpi=150)
    plt.close()
    print("\nSaved:")
    print(output_path)
    print("\nFeature importance analysis complete.")

if __name__ == "__main__":
    main()