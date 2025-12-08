# Metrics Explanation

The ensemble model now reports three standard metrics for air quality prediction:

## 1. RMSE (Root Mean Squared Error)
- **Formula**: √(Σ(predicted - true)² / n)
- **Interpretation**: Measures the average magnitude of prediction errors
- **Units**: Same as target variable (e.g., μg/m³ for NO2/O3)
- **Lower is better**: RMSE = 0 means perfect predictions
- **Sensitive to outliers**: Large errors are penalized more heavily

## 2. MAE (Mean Absolute Error)
- **Formula**: Σ|predicted - true| / n
- **Interpretation**: Average absolute difference between predictions and true values
- **Units**: Same as target variable
- **Lower is better**: MAE = 0 means perfect predictions
- **Less sensitive to outliers**: All errors weighted equally

## 3. Bias
- **Formula**: Mean(predicted - true) = Σ(predicted - true) / n
- **Interpretation**: Systematic over- or under-prediction
- **Units**: Same as target variable
- **Ideal value**: 0 (no bias)
- **Positive bias**: Model systematically over-predicts
- **Negative bias**: Model systematically under-predicts

## Example Interpretation

For a model with:
- **RMSE**: 5.2 μg/m³
- **MAE**: 3.8 μg/m³
- **Bias**: -0.5 μg/m³

This means:
- On average, predictions are off by about 3.8 μg/m³ (MAE)
- The root mean squared error is 5.2 μg/m³ (RMSE is higher due to some large errors)
- The model slightly under-predicts by 0.5 μg/m³ on average (negative bias)

## Model Comparison

The code now reports metrics for:
1. **LightGBM** (base model)
2. **TFT** (base model)
3. **Ensemble** (LightGBM + TFT with stacking)

This allows you to see:
- Which individual model performs better
- How much the ensemble improves over individual models
- Whether bias is consistent across models

## Output Files

Metrics are saved to:
- `predictions/site{site_id}_{target}_metrics.csv` - Summary table with all metrics
- `predictions/site{site_id}_{target}_test_predictions.csv` - Individual predictions
- `predictions/site{site_id}_{target}_val_predictions.csv` - Validation predictions

