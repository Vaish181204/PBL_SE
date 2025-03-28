import pandas as pd

# Sample accident dataset
data = {
    'Weather': ['Clear', 'Rainy', 'Foggy', 'Clear', 'Rainy', 'Foggy', 'Clear', 'Rainy'],
    'Road_Type': ['Highway', 'City', 'Highway', 'City', 'Rural', 'Rural', 'Highway', 'City'],
    'Traffic': ['High', 'Medium', 'Low', 'High', 'Low', 'Low', 'High', 'Medium'],
    'Accident': [0, 1, 1, 0, 1, 1, 0, 1]  # 0 = No Accident, 1 = Accident
}

df = pd.DataFrame(data)
df.to_csv("accidents.csv", index=False)  # Save as CSV
print("Dataset saved as accidents.csv")
import pandas as pd

# Load the dataset
df = pd.read_csv("accidents.csv")

# Show first few rows
print(df.head())

# Check for missing values
print(df.isnull().sum())
from sklearn.preprocessing import LabelEncoder

# Convert categorical columns to numbers
encoder = LabelEncoder()
df['Weather'] = encoder.fit_transform(df['Weather'])
df['Road_Type'] = encoder.fit_transform(df['Road_Type'])
df['Traffic'] = encoder.fit_transform(df['Traffic'])

print(df.head())  # Check the transformed data
from sklearn.model_selection import train_test_split

# Features (input data)
X = df[['Weather', 'Road_Type', 'Traffic']]
# Target (output data) - Accident occurrence
y = df['Accident']

# Split into training (80%) and testing (20%)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Train the model
model = LogisticRegression()
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Check accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")
# New data example: Rainy, City Road, High Traffic
new_data = [[1, 1, 2]]  # Values based on label encoding

# Predict accident risk
prediction = model.predict(new_data)
print("Accident Likely" if prediction[0] == 1 else "No Accident")
import seaborn as sns
import matplotlib.pyplot as plt

# Set theme
sns.set_theme(style="darkgrid")

# Count plot of accidents by weather type
plt.figure(figsize=(8, 5))
sns.countplot(x="Weather", hue="Accident", data=df, palette="coolwarm")

plt.xlabel("Weather Conditions")
plt.ylabel("Number of Accidents")
plt.title("Accidents Based on Weather Conditions")
plt.xticks(ticks=[0, 1, 2], labels=['Clear', 'Rainy', 'Foggy'])
plt.show()
print(encoder.classes_)

