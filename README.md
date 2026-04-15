# 🌍 EcoPath — Sustainable Itinerary Planner

**EcoPath** is a full‑stack web application that helps users plan environmentally conscious travel by generating itineraries, calculating CO₂ emissions, and exploring nearby points of interest (POIs).
Built as a Final Year Project for BSc Computer Science, it combines real‑time geolocation data, sustainability metrics, and a clean, interactive UI.

---

## 📚 Project Overview

**Goal:**  
Travel emissions are a major contributor to climate change.

**Motivation:**  
EcoPath empowers users to make informed, sustainable travel decisions by visualising the environmental impact of different transport modes and exploring eco‑friendly destinations.

---

## 📌 Key Features (Prototype Stage)

- 📍 User enters **Origin** and **Destination**
- 🔢 Calculates estimated **Distance**
- 🌱 Computes **CO₂ Emissions** using predefined emission factors
- 📊 Displays **Comparison across modes**

---

## 📥 Inputs & Outputs

### Inputs
- **Origin location** (string)
- **Destination location** (string)
- **Transport mode** (dropdown selection: car, train, bus, flight)

### Outputs
- Calculated travel **distance**
- Estimated **CO₂ emissions** for selected mode(s)
- A table/graph view comparing emissions

---

## 📦 Tech Stack

| Component | Technologies |
|-----------|--------------|
| Frontend | React.js |
| Backend | Node.js + Express |
| APIs | OpenTripMap (geocoding & routing) |
| Data | DEFRA CO₂ Emission Factors |
| Tools | Vite |

---

## 💻 Local Development

### Requirements
- Node.js
- npm

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/arudzheri/EcoPath-Final-Year-Project.git

# Navigate to the project directory
cd EcoPath-Final-Year-Project

# Install frontend dependencies
npm install
npm run dev

# Setup backend
cd backend
npm install

# Start backend
npm run dev
```

---

## 📄 License

This project is for academic use as part of the Final Year Project at the University of Westminster.

---

## 👤 Author

**Andzhelo Rudzheri**  
BSc Computer Science
University of Westminster
