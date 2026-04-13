import pandas as pd
import json
import os

# Paths to the data files
WELLNESS_FILE = 'pmsys/wellness.csv'
SLEEP_SCORE_FILE = 'fitbit/sleep_score.csv'
STEPS_FILE = 'fitbit/steps.json'

def load_wellness():
    print(f"Loading {WELLNESS_FILE}...")
    df = pd.read_csv(WELLNESS_FILE)
    # Convert effective_time_frame to datetime and extract date
    df['date'] = pd.to_datetime(df['effective_time_frame']).dt.date
    return df

def load_sleep_score():
    print(f"Loading {SLEEP_SCORE_FILE}...")
    df = pd.read_csv(SLEEP_SCORE_FILE)
    df['date'] = pd.to_datetime(df['timestamp']).dt.date
    return df

def load_steps():
    print(f"Loading {STEPS_FILE}...")
    with open(STEPS_FILE, 'r') as f:
        data = json.load(f)
    
    df = pd.DataFrame(data)
    df['dateTime'] = pd.to_datetime(df['dateTime'])
    df['date'] = df['dateTime'].dt.date
    
    # Ensure value is numeric (it's often a string in the JSON)
    df['value'] = pd.to_numeric(df['value'], errors='coerce').fillna(0)
    
    # Aggregate steps by day
    daily_steps = df.groupby('date')['value'].sum().reset_index()
    daily_steps.columns = ['date', 'steps']
    return daily_steps

def main():
    if not all(os.path.exists(f) for f in [WELLNESS_FILE, SLEEP_SCORE_FILE, STEPS_FILE]):
        print("Error: Missing data files. Please ensure pmsys/ and fitbit/ contain the required files.")
        return

    # Load datasets
    wellness_df = load_wellness()
    sleep_df = load_sleep_score()
    steps_df = load_steps()

    # Merge datasets on 'date'
    print("Merging datasets...")
    # Participant p01 data in wellness starts from 2019-11-01
    merged_df = wellness_df.merge(sleep_df, on='date', how='outer')
    merged_df = merged_df.merge(daily_steps := steps_df, on='date', how='outer')

    # Sort by date
    merged_df = merged_df.sort_values('date')

    # Save processed data
    output_file = 'adhd_training_data_prepared.csv'
    merged_df.to_csv(output_file, index=False)
    print(f"Success! Prepared data saved to {output_file}")
    print(f"Total rows: {len(merged_df)}")

if __name__ == "__main__":
    main()
