"""
Quick test script to verify the setup and data loading.
"""

import pandas as pd
from utils import load_data, prepare_features, get_feature_groups

def test_data_loading():
    """Test data loading for all sites."""
    print("Testing data loading...")
    
    sites = [3, 5, 6, 7]
    for site_id in sites:
        try:
            train_df, val_df, test_df = load_data(site_id, data_dir='F')
            print(f"\nSite {site_id}:")
            print(f"  Train: {len(train_df)} samples, {len(train_df.columns)} columns")
            print(f"  Val: {len(val_df)} samples")
            print(f"  Test: {len(test_df)} samples")
            
            # Check for required columns
            required_cols = ['datetime', 'NO2_target', 'O3_target', '_original_row_marker']
            missing = [col for col in required_cols if col not in train_df.columns]
            if missing:
                print(f"  WARNING: Missing columns: {missing}")
            else:
                print(f"  ✓ All required columns present")
            
            # Check data quality
            print(f"  Original rows in train: {train_df['_original_row_marker'].sum():.0f} ({train_df['_original_row_marker'].sum()/len(train_df)*100:.1f}%)")
            
            # Test feature preparation
            X_train, y_train, sw_train = prepare_features(train_df, target='NO2')
            print(f"  Features for NO2: {len(X_train.columns)}")
            print(f"  Target range: [{y_train.min():.2f}, {y_train.max():.2f}]")
            
        except Exception as e:
            print(f"\nSite {site_id}: ERROR - {e}")
            import traceback
            traceback.print_exc()
    
    print("\n" + "="*60)
    print("Data loading test complete!")
    print("="*60)

if __name__ == '__main__':
    test_data_loading()

