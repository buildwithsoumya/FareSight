# FareSight — ML Experiment Log

| Experiment | Model | Key Change | MAE | RMSE | R² | Decision |
|---|---|---|---:|---:|---:|---|
| Baseline | Linear Regression | Initial | ₹23,097.40 | ₹45,456.32 | 0.6238 | Baseline |
| Baseline | Random Forest | Initial | ₹15,394.65 | ₹42,214.69 | 0.6756 | Current best |
| Feature Selection | Random Forest | Distance + Duration | ₹15,394.65 | ₹42,214.69 | 0.6756 | Keep |
| Feature Selection | Random Forest | Distance only | ₹15,667.57 | ₹42,169.56 | 0.6763 | Reject |
| Feature Selection | Random Forest | Duration only | ₹16,091.45 | ₹42,789.61 | 0.6667 | Reject |