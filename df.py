import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Load dataset first
df = pd.read_csv("accidents.csv")  # Make sure this file exists

# Convert categorical columns to numbers
encoder = LabelEncoder()
df['Weather'] = encoder.fit_transform(df['Weather'])
df['Road_Type'] = encoder.fit_transform(df['Road_Type'])
df['Traffic'] = encoder.fit_transform(df['Traffic'])

print(df.head())  # Check transformed data

from sklearn.preprocessing import LabelEncoder

# Convert categorical columns to numbers
encoder = LabelEncoder()
df['Weather'] = encoder.fit_transform(df['Weather'])
df['Road_Type'] = encoder.fit_transform(df['Road_Type'])
df['Traffic'] = encoder.fit_transform(df['Traffic'])

print(df.head())  # Check the transformed data
