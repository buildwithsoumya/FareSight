# FareSight — Feature Selection Experiment

## Objective

The FareSight dataset contains both `Distance_km` and
`Duration_Minutes`.

During exploratory data analysis, these two features showed
an extremely strong correlation:

> Distance ↔ Duration correlation = 0.99

Because highly correlated features may contain redundant
information, an experiment was conducted to determine whether
both features are necessary for flight-price prediction.

---

## Experimental Setup

Three Random Forest configurations were evaluated:

### Experiment A — Distance + Duration

Features included:

- `Distance_km`
- `Duration_Minutes`

All other selected numerical and categorical features remained
unchanged.

### Experiment B — Distance Only

`Duration_Minutes` was removed.

### Experiment C — Duration Only

`Distance_km` was removed.

The same train/test split and Random Forest configuration
were used for all three experiments.

### Model Configuration

- Algorithm: Random Forest Regressor
- Estimators: 150
- Maximum depth: 20
- Minimum samples split: 5
- Random state: 42
- Test size: 20%

---

## Results

| Feature Configuration | MAE | RMSE | R² |
|---|---:|---:|---:|
| Distance + Duration | ₹15,394.65 | ₹42,214.69 | 0.6756 |
| Distance Only | ₹15,667.57 | ₹42,169.56 | 0.6763 |
| Duration Only | ₹16,091.45 | ₹42,789.61 | 0.6667 |

---

## Analysis

### Distance + Duration

This configuration achieved the lowest MAE:

**₹15,394.65**

This means it produced the lowest average absolute
prediction error among the three configurations.

### Distance Only

Distance alone produced:

- Slightly lower RMSE
- Slightly higher R²
- Slightly higher MAE

The difference from the combined configuration is very small.

### Duration Only

Removing distance while retaining duration resulted in
noticeably worse performance:

- MAE increased to ₹16,091.45
- RMSE increased to ₹42,789.61
- R² decreased to 0.6667

This indicates that distance contains useful predictive
information that cannot be completely replaced by duration.

---

## Decision

For the current FareSight model, both `Distance_km` and
`Duration_Minutes` will be retained.

The primary reason is that the combined configuration achieves
the lowest MAE.

Although Distance Only has marginally better RMSE and R²,
the differences are extremely small.

Therefore:

> **Final feature decision: retain both Distance_km and Duration_Minutes.**

This decision can be revisited during further model
optimization if another model or feature-selection technique
shows a meaningful improvement.

---

## Key ML Insight

The experiment demonstrates that high correlation between
features does not automatically mean that one feature should
be removed.

Instead, the impact should be evaluated empirically using
model performance.

In FareSight, Distance and Duration have a correlation of
approximately 0.99, yet retaining both produced the lowest MAE
in the current Random Forest experiment.

---

## Current Baseline

The selected Random Forest configuration currently achieves:

- **MAE:** ₹15,394.65
- **RMSE:** ₹42,214.69
- **R²:** 0.6756

These metrics represent the current baseline before further
model optimization.