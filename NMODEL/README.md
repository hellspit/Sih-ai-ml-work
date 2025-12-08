# Ensemble Model for Air Quality Prediction

This repository contains an ensemble model combining LightGBM and Temporal Fusion Transformer (TFT) for predicting NO2 and O3 air quality concentrations.

## Model Architecture

### Base Model A: LightGBM
- **Purpose**: Strong non-linear tabular baseline, handles mixed features, fast tuning
- **Key Features**:
  - Sample weights: 1.0 for original rows, 0.5 for imputed rows
  - Time-series cross-validation with expanding window
  - Optional Optuna hyperparameter tuning
  - Default hyperparameters:
    - `objective = 'regression'`
    - `num_boost_round = 3000`
    - `early_stopping_rounds = 200`
    - `learning_rate = 0.03`
    - `num_leaves = 128`
    - `max_depth = 10`
    - `min_data_in_leaf = 50`
    - `feature_fraction = 0.8`
    - `bagging_fraction = 0.8`
    - `lambda_l2 = 0.1`

### Base Model B: Temporal Fusion Transformer (TFT)
- **Purpose**: Multi-horizon forecasting, handles static + known/future covariates, captures complex temporal dynamics
- **Architecture**:
  - `input_window = 72` (tunable: 48-168)
  - `output_horizon = 24` or `48`
  - `hidden_size = 96`
  - `lstm_layers = 2`
  - `num_heads = 4` (attention heads)
  - `dropout = 0.1`
  - `batch_size = 128`
  - `optimizer = Adam, lr = 1e-3` with `ReduceLROnPlateau`
  - `loss = MAE` (weighted by original/imputed flags)
  - `epochs = 100`, `early_stopping = 10`

### Meta-Learner: Stacking Ensemble
- **Type**: Ridge regression (simple, regularized) or shallow LightGBM (`max_depth=3`)
- **Training**: Fit on OOF predictions from base models, tune on validation set (optimize RMSE)

## Data Structure

The data should be in the `F/` folder with the following structure:
```
F/
  site3_train.csv
  site3_val.csv
  site3_test.csv
  site5_train.csv
  site5_val.csv
  site5_test.csv
  site6_train.csv
  site6_val.csv
  site6_test.csv
  site7_train.csv
  site7_val.csv
  site7_test.csv
```

Each CSV file should contain:
- `datetime`: Timestamp column
- `NO2_target`: NO2 target values
- `O3_target`: O3 target values
- `_original_row_marker`: Boolean flag indicating original (True) vs imputed (False) rows
- Various feature columns (lags, rolling means, ERA5/CAMS variables, satellite data, etc.)

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage

Train ensemble model for a specific site and target:
```bash
python ensemble_main.py --site 3 --target NO2
```

### Options

- `--site`: Site ID (3, 5, 6, or 7) - default: 3
- `--target`: Target variable ('NO2' or 'O3') - default: 'NO2'
- `--data-dir`: Data directory - default: 'F'
- `--no-cv`: Disable cross-validation for OOF predictions
- `--n-splits`: Number of CV splits - default: 5
- `--use-optuna`: Use Optuna for LightGBM hyperparameter tuning
- `--both-targets`: Train models for both NO2 and O3

### Examples

Train for both targets on site 3:
```bash
python ensemble_main.py --site 3 --both-targets
```

Train with Optuna hyperparameter tuning:
```bash
python ensemble_main.py --site 3 --target NO2 --use-optuna
```

Train without cross-validation (faster, but less robust):
```bash
python ensemble_main.py --site 3 --target NO2 --no-cv
```

## Output

The script will:
1. Train the ensemble model using time-series cross-validation
2. Evaluate on validation and test sets
3. Save predictions to `predictions/` directory:
   - `site{site_id}_{target}_test_predictions.csv`
   - `site{site_id}_{target}_val_predictions.csv`

## Model Components

- `utils.py`: Utility functions for data loading, time-series CV, and feature engineering
- `lightgbm_model.py`: LightGBM model implementation
- `tft_model.py`: Temporal Fusion Transformer model implementation
- `stacking.py`: Stacking/ensemble meta-learner
- `ensemble_main.py`: Main script for training and evaluation

## Features Used

The model uses various feature types:
- **Lags**: 1, 3, 6, 12, 24, 48 hour lags
- **Rolling means**: 3, 6, 24 hour windows
- **ERA5/CAMS variables**: Meteorological and air quality forecast variables
- **Satellite data**: Tropospheric columns (NO2, HCHO)
- **Temporal features**: sin/cos hour/day, day of week, is_weekend
- **Boundary layer height (BLH)**
- **Wind components**: u, v, w
- **Imputation flags**: Indicator for original vs imputed rows
- **Forecast residuals**: Differences between forecasts and observations

## Notes

- The model trains separate models for NO2 and O3 (or can use multioutput wrapper)
- Sample weights are applied: w=1.0 for original rows, w=0.4-0.6 for imputed rows
- Time-series cross-validation uses expanding window approach
- TFT model requires scaled numeric features
- Static features (site ID) and known future covariates (forecasted meteo) are provided to TFT

