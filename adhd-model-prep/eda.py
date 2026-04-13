import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

def perform_eda(csv_path):
    print(f"Starting EDA on {csv_path}...")
    
    if not os.path.exists(csv_path):
        print(f"File not found: {csv_path}")
        return

    df = pd.read_csv(csv_path)
    
    # 1. Basic Info
    print("\n--- Dataset Summary ---")
    print(df.info())
    print("\n--- Descriptive Statistics ---")
    print(df.describe())
    
    # 2. Check for Missing Values
    print("\n--- Missing Values ---")
    print(df.isnull().sum())
    
    # 3. Correlation Matrix
    print("\n--- Correlations (Target Variables) ---")
    correlation_cols = ['mood', 'readiness', 'sleep_score', 'total_steps']
    # filter only columns that exist
    cols_to_corr = [c for c in correlation_cols if c in df.columns]
    if len(cols_to_corr) > 1:
        print(df[cols_to_corr].corr())
    
    # 4. Visualizations (Saving to artifacts folder)
    print("\n--- Generating Plots ---")
    plt.figure(figsize=(12, 6))
    
    # Mood vs Steps
    if 'mood' in df.columns and 'total_steps' in df.columns:
        sns.scatterplot(data=df, x='total_steps', y='mood', alpha=0.5)
        plt.title('Mood vs. Daily Steps')
        plt.savefig('adhd-model-prep/mood_vs_steps.png')
        print("Saved: mood_vs_steps.png")

    # Mood vs Sleep Score
    plt.clf()
    if 'mood' in df.columns and 'sleep_score' in df.columns:
        sns.regplot(data=df, x='sleep_score', y='mood', scatter_kws={'alpha':0.5})
        plt.title('Mood vs. Sleep Score')
        plt.savefig('adhd-model-prep/mood_vs_sleep.png')
        print("Saved: mood_vs_sleep.png")

    print("\nEDA complete!")

if __name__ == "__main__":
    perform_eda('adhd-model-prep/adhd_training_data_prepared.csv')
