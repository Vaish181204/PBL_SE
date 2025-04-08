import pandas as pd

# Load the dataset
df = pd.read_csv("accidents.csv")

# Show first few rows
print(df.head())

# Check for missing values
print(df.isnull().sum())
