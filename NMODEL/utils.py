"""
Utility functions for data loading, time-series cross-validation, and feature engineering.
"""

import pandas as pd
import numpy as np
from typing import List, Tuple, Optional
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')


def load_data(site_id: int, data_dir: str = "F") -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Load train, validation, and test data for a given site.
    
    Args:
        site_id: Site ID (3, 5, 6, or 7)
        data_dir: Directory containing the data files
        
    Returns:
        Tuple of (train_df, val_df, test_df)
    """
    train_path = f"{data_dir}/site{site_id}_train.csv"
    val_path = f"{data_dir}/site{site_id}_val.csv"
    test_path = f"{data_dir}/site{site_id}_test.csv"
    
    train_df = pd.read_csv(train_path)
    val_df = pd.read_csv(val_path)
    test_df = pd.read_csv(test_path)
    
    # Convert datetime column and sort (explicit assignments to preserve sorting)
    train_df['datetime'] = pd.to_datetime(train_df['datetime'])
    train_df = train_df.sort_values('datetime').reset_index(drop=True)
    
    val_df['datetime'] = pd.to_datetime(val_df['datetime'])
    val_df = val_df.sort_values('datetime').reset_index(drop=True)
    
    test_df['datetime'] = pd.to_datetime(test_df['datetime'])
    test_df = test_df.sort_values('datetime').reset_index(drop=True)
    
    return train_df, val_df, test_df


def prepare_features(df: pd.DataFrame, target: str = 'NO2') -> Tuple[pd.DataFrame, pd.Series, pd.Series]:
    """
    Prepare features and targets from dataframe.
    
    Args:
        df: Input dataframe
        target: Target variable ('NO2' or 'O3')
        
    Returns:
        Tuple of (X, y, sample_weights)
    """
    # Exclude target columns and metadata
    exclude_cols = ['datetime', 'NO2_target', 'O3_target', '_original_row_marker']
    
    # Get target column
    target_col = f'{target}_target'
    
    # Create sample weights: 1.0 for original rows, 0.5 for imputed rows
    if '_original_row_marker' in df.columns:
        sample_weights = df['_original_row_marker'].map({True: 1.0, False: 0.5})
    else:
        sample_weights = pd.Series(1.0, index=df.index)
    
    # Get feature columns
    feature_cols = [col for col in df.columns if col not in exclude_cols]
    X = df[feature_cols].copy()
    y = df[target_col].copy()
    
    # Handle missing values in features (fill with median)
    X = X.fillna(X.median())
    
    return X, y, sample_weights


def time_series_cv_splits(df: pd.DataFrame, n_splits: int = 5, test_size: Optional[int] = None) -> List[Tuple[np.ndarray, np.ndarray]]:
    """
    Generate time-series cross-validation splits (expanding window).
    
    Args:
        df: Dataframe with datetime index
        n_splits: Number of CV splits
        test_size: Size of test set for each split (default: len(df) // (n_splits + 1))
        
    Returns:
        List of (train_idx, val_idx) tuples
    """
    n = len(df)
    if test_size is None:
        test_size = n // (n_splits + 1)
    
    splits = []
    for i in range(1, n_splits + 1):
        train_end = n - test_size * (n_splits - i + 1)
        val_start = train_end
        val_end = val_start + test_size
        
        if train_end > 0 and val_end <= n:
            train_idx = np.arange(0, train_end)
            val_idx = np.arange(val_start, val_end)
            splits.append((train_idx, val_idx))
    
    return splits


def get_feature_groups(df: pd.DataFrame) -> dict:
    """
    Identify feature groups for TFT model.
    
    Returns:
        Dictionary with 'static', 'known_future', and 'observed' feature lists
    """
    # Static features (site-specific, constant over time)
    static_features = ['Year']  # Could add site_id if available
    
    # Known future covariates (forecasted variables)
    known_future = [col for col in df.columns if 'forecast' in col.lower()]
    
    # Observed features (everything else except targets and metadata)
    exclude = ['datetime', 'NO2_target', 'O3_target', '_original_row_marker'] + static_features + known_future
    observed = [col for col in df.columns if col not in exclude]
    
    return {
        'static': static_features,
        'known_future': known_future,
        'observed': observed
    }


def create_lag_features(df: pd.DataFrame, target: str, lags: List[int] = [1, 3, 6, 12, 24, 48]) -> pd.DataFrame:
    """
    Create lag features for target variable (if not already present).
    
    Args:
        df: Input dataframe
        target: Target variable name ('NO2' or 'O3')
        lags: List of lag periods
        
    Returns:
        Dataframe with additional lag features
    """
    df = df.copy()
    target_col = f'{target}_target'
    
    if target_col not in df.columns:
        return df
    
    for lag in lags:
        col_name = f'{target}_target_lag{lag}'
        if col_name not in df.columns:
            df[col_name] = df[target_col].shift(lag)
    
    return df


def create_rolling_features(df: pd.DataFrame, target: str, windows: List[int] = [3, 6, 24]) -> pd.DataFrame:
    """
    Create rolling mean features for target variable.
    
    Args:
        df: Input dataframe
        target: Target variable name ('NO2' or 'O3')
        windows: List of window sizes for rolling means
        
    Returns:
        Dataframe with additional rolling features
    """
    df = df.copy()
    target_col = f'{target}_target'
    
    if target_col not in df.columns:
        return df
    
    for window in windows:
        col_name = f'{target}_target_rolling_mean_{window}'
        df[col_name] = df[target_col].rolling(window=window, min_periods=1).mean()
    
    return df


def scale_features(X_train: pd.DataFrame, X_val: pd.DataFrame, X_test: Optional[pd.DataFrame] = None,
                   numeric_cols: Optional[List[str]] = None) -> Tuple[pd.DataFrame, pd.DataFrame, Optional[pd.DataFrame], StandardScaler]:
    """
    Scale numeric features using StandardScaler.
    
    Args:
        X_train: Training features
        X_val: Validation features
        X_test: Test features (optional)
        numeric_cols: List of numeric columns to scale (if None, scales all numeric columns)
        
    Returns:
        Tuple of (scaled_X_train, scaled_X_val, scaled_X_test, scaler)
    """
    if numeric_cols is None:
        numeric_cols = X_train.select_dtypes(include=[np.number]).columns.tolist()
    
    scaler = StandardScaler()
    X_train_scaled = X_train.copy()
    X_val_scaled = X_val.copy()
    
    X_train_scaled[numeric_cols] = scaler.fit_transform(X_train[numeric_cols])
    X_val_scaled[numeric_cols] = scaler.transform(X_val[numeric_cols])
    
    if X_test is not None:
        X_test_scaled = X_test.copy()
        X_test_scaled[numeric_cols] = scaler.transform(X_test[numeric_cols])
        return X_train_scaled, X_val_scaled, X_test_scaled, scaler
    
    return X_train_scaled, X_val_scaled, None, scaler


def calculate_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    """
    Calculate regression metrics including RMSE, MAE, and Bias.
    
    Args:
        y_true: True values
        y_pred: Predicted values
        
    Returns:
        Dictionary of metrics
    """
    from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
    
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    
    # Bias: mean of (predicted - true)
    bias = np.mean(y_pred - y_true)
    
    return {
        'MSE': mse,
        'RMSE': rmse,
        'MAE': mae,
        'R2': r2,
        'Bias': bias
    }

