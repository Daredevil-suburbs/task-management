import pandas as pd
import numpy as np
import os

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Transform raw ADHD logs into ML-ready features."""
    
    # Ensure date is datetime and sort
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').copy()
    
    # ── Time features ──────────────────────────────────────
    df['day_of_week'] = df['date'].dt.dayofweek  # 0=Mon
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
    
    # ── Lag features (yesterday's values) ──────────────────
    # We want to predict today's MOOD based on yesterday's metrics
    for col in ['mood', 'readiness', 'overall_score', 'steps']:
        if col in df.columns:
            df[f'{col}_lag1'] = df[col].shift(1)    # yesterday
            df[f'{col}_lag2'] = df[col].shift(2)    # 2 days ago
    
    # ── Rolling averages (last 3, 7 days) ──────────────────
    for col in ['mood', 'overall_score', 'steps']:
        if col in df.columns:
            df[f'{col}_rolling3'] = df[col].shift(1).rolling(window=3, min_periods=1).mean()
            df[f'{col}_rolling7'] = df[col].shift(1).rolling(window=7, min_periods=1).mean()
    
    # ── Trend features ─────────────────────────────────────
    if 'mood_rolling7' in df.columns:
        df['mood_trend'] = df['mood_lag1'] - df['mood_rolling7']
    
    # ── Specific ADHD Features ─────────────────────────────
    if 'overall_score' in df.columns:
        df['sleep_deficit'] = 80 - df['overall_score'] # Assuming 80 is a good baseline score

    # Activity score (normalized steps)
    if 'steps' in df.columns:
        df['activity_score'] = df['steps'] / 5000 # 5k steps as a unit
    
    return df.dropna().reset_index(drop=True)

def process_and_save(input_csv, output_csv):
    if not os.path.exists(input_csv):
        print(f"Input file not found: {input_csv}")
        return
        
    df = pd.read_csv(input_csv)
    featured_df = engineer_features(df)
    
    featured_df.to_csv(output_csv, index=False)
    print(f"Feature engineering complete! Saved to {output_csv}")
    print(f"Resulting dataset size: {featured_df.shape}")

if __name__ == "__main__":
    process_and_save(
        'adhd-model-prep/adhd_training_data_prepared.csv', 
        'adhd-model-prep/adhd_training_data_featured.csv'
    )
