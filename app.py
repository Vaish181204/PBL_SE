import streamlit as st
import pickle

# Load model and encoders
model = pickle.load(open("model.pkl", "rb"))
encoders = pickle.load(open("encoders.pkl", "rb"))

# Define options
weather_options = encoders['Weather_Condition'].classes_.tolist()
road_options = encoders['Road_Type'].classes_.tolist()
traffic_options = encoders['Traffic_Density'].classes_.tolist()

# Streamlit UI
st.title("🚗 Accident Prediction Web App")

weather = st.selectbox("Weather Condition", weather_options)
road_type = st.selectbox("Road Type", road_options)
traffic = st.selectbox("Traffic Level", traffic_options)

# Encode inputs
weather_encoded = encoders['Weather_Condition'].transform([weather])[0]
road_encoded = encoders['Road_Type'].transform([road_type])[0]
traffic_encoded = encoders['Traffic_Density'].transform([traffic])[0]

# Predict
prediction = model.predict([[weather_encoded, road_encoded, traffic_encoded]])
st.write(f"Accident Risk Prediction: {'High' if prediction[0] == 0 else 'Low'}")
