# 🌍 EcoPath — Sustainable Itinerary Planner

**EcoPath** is a full‑stack web application that helps users plan environmentally conscious travel by generating itineraries, calculating CO₂ emissions, and exploring nearby points of interest (POIs).
Built as a Final Year Project for BSc Computer Science, it combines real‑time geolocation data, sustainability metrics, and a clean, interactive UI.

---

## 📚 Project Overview

**Goal:**  
EcoPath is a sustainability‑focused itinerary planner designed to help users make environmentally conscious travel decisions. The system calculates estimated carbon emissions for different travel modes and provides users with greener alternatives.

**Motivation:**  
The project was developed as part of a Final Year Project in BSc Computer Science, with emphasis on:

- Sustainable technology
- API‑driven system design
- Full‑stack development
- Ethical and transparent carbon estimation

---

## 🚀 Key Features

- 🌱 Carbon‑aware route planning using DEFRA emission factors
- 🗺️ Interactive map interface for selecting destinations
- 🚉 Multi‑modal transport comparison (car, walking, cycling, public transport)
- 📊 Sustainability scoring system
- 🔍 Real‑time location search via OpenTripMap API
- 💡 User‑friendly UI built with React + TypeScript
- ⚙️ Backend API for carbon calculations and data processing

---

## 🏗️ System Architecture

### Frontend
- React + TypeScript
- Vite build system
- TailwindCSS for styling
- Map rendering and UI components

### Backend
- Node.js + Express
- Carbon calculation logic
- API endpoints for itinerary generation
- Integration with OpenTripMap

---

## 📦 Tech Stack

| Component | Technologies |
|-----------|--------------|
| Frontend | React.js, TypeScript, TailwindCSS |
| Backend | Node.js + Express |
| APIs | OpenTripMap (geocoding & routing) |
| Data | DEFRA CO₂ Emission Factors |
| Tools | Vite |

---

## 💻 Installation & Setup

### Requirements
- Node.js
- npm

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/arudzheri/EcoPath-Final-Year-Project.git

# Navigate to the project directory
cd EcoPath-Final-Year-Project

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 📊 Carbon Calculation Method

EcoPath uses **DEFRA 2024 emission factors**, which provide standardised values for:

- Car
- Bus
- Rail
- Cycling
- Walking

**Note:** DEFRA factors are averaged values and do not account for real‑time variables such as traffic or vehicle efficiency. 
This introduces limitations, but the method was chosen for its transparency and suitability for a prototype system.

---

## 🧪 Testing

Testing included:

- Unit tests for carbon calculations
- API endpoint validation
- UI usability checks
- Map interaction testing

Limitations of testing:

- Small number of users
- No large‑scale performance testing
- API dependency may affect reliability

---

## 📄 License

This project is for academic use as part of the Final Year Project at the University of Westminster.

---

## 🙌 Acknowledgements

- DEFRA for emission factor datasets
- OpenTripMap for location data
- University of Westminster – Final Year Project
- Supervisor support and guidance

---

## 👤 Author

**Andzhelo Rudzheri**  
BSc Computer Science
University of Westminster
