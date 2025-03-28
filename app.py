import streamlit as st
import pickle
from sklearn.preprocessing import LabelEncoder

# Load your model if needed
# model = pickle.load(open("model.pkl", "rb"))

# Define all possible values for encoding
all_weathers = ["Clear", "Rainy", "Foggy", "Snowy", "Cloudy"]
all_road_types = ["Highway", "City", "Rural"]
all_traffic = ["Low", "Medium", "High"]

# Fit LabelEncoders with all possible values
weather_encoder = LabelEncoder()
weather_encoder.fit(all_weathers)

road_encoder = LabelEncoder()
road_encoder.fit(all_road_types)

traffic_encoder = LabelEncoder()
traffic_encoder.fit(all_traffic)

# Streamlit UI
st.title("🚗 Accident Prediction Web App")

weather = st.selectbox("Weather Condition", all_weathers)
road_type = st.selectbox("Road Type", all_road_types)
traffic = st.selectbox("Traffic Level", all_traffic)

# Check if the input value is in trained labels before transforming
if weather in weather_encoder.classes_:
    weather_encoded = weather_encoder.transform([weather])[0]
else:
    weather_encoded = -1  # Assign a default value for unseen labels

if road_type in road_encoder.classes_:
    road_type_encoded = road_encoder.transform([road_type])[0]
else:
    road_type_encoded = -1  

if traffic in traffic_encoder.classes_:
    traffic_encoded = traffic_encoder.transform([traffic])[0]
else:
    traffic_encoded = -1  

st.write(f"Encoded Values - Weather: {weather_encoded}, Road: {road_type_encoded}, Traffic: {traffic_encoded}")

# Uncomment to predict using model
# prediction = model.predict([[weather_encoded, road_type_encoded, traffic_encoded]])
# st.write(f"Accident Risk Prediction: {'High' if prediction[0] == 1 else 'Low'}")
