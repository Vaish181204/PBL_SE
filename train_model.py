# train_model.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load dataset
url = "https://raw.githubusercontent.com/Vaish181204/PBL_SE/main/Accident_Dataset.csv"
df = pd.read_csv(url)

# Preprocess (you can expand this depending on your columns)
df.dropna(inplace=True)

# Assume 'Severity' is the target column
X = df.drop("Severity", axis=1)
y = df["Severity"]

# Split & Train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "accident_model.pkl")
joblib.dump(list(X.columns), "features.pkl")
