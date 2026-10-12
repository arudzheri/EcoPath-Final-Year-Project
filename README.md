# 🌍 EcoPath — Sustainable Itinerary Planner

**EcoPath** is a web application that helps users plan environmentally conscious travel by generating itineraries, calculating CO₂ emissions, and exploring nearby points of interest.
Built as a Final Year Project for BSc Computer Science, it combines real‑time geolocation data, sustainability metrics, and a clean, interactive UI.

---

## 📚 Project Overview

**Goal:**  
EcoPath is a sustainability‑focused itinerary planner designed to help users make environmentally conscious travel decisions. The system calculates estimated carbon emissions for different transport modes and suggests lower-carbon route options.

**Motivation:**  
The project was developed as part of a Final Year Project in BSc Computer Science, with emphasis on:

- Sustainable technology
- API‑driven system design
- Frontend development
- Ethical and transparent carbon estimation

---

## 🚀 Key Features

- 🌱 Carbon‑aware route planning using DEFRA emission factors
- 🗺️ Interactive map interface for selecting destinations
- 🚉 Multi‑modal transport comparison (car, walking, cycling, public transport)
- 📊 Sustainability scoring system
- 🔍 Real‑time location search via OpenTripMap API
- 💡 User‑friendly UI built with React + TypeScript

---

## 🏗️ System Architecture

### Frontend
- React + TypeScript
- Vite build system
- TailwindCSS for styling
- Map rendering and UI components

### Backend (added after submission, October 2026 – work in progress)

- A separate Node.js + Express API in the /server folder
- Carbon calculation and itinerary endpoints
- Not yet connected to the frontend

---

## 📦 Tech Stack

| Component | Technologies |
|-----------|--------------|
| Frontend | React.js, TypeScript, TailwindCSS |
| Backend | Node.js + Express (added after submission, in progress) |
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

---

## How this project was built

The first version of the interface was generated with Lovable (an AI app builder) based on my project requirements. I then developed the project further, using a mix of Lovable prompts and my own code changes, to: 

- add the interactive map and route display 
- integrate the OpenTripMap API for location search and points of interest 
- calculate carbon emissions using DEFRA conversion factors 
- add input validation and warnings (for example, unrealistic distances for walking) 
- refine the layout and styling 

After submission (October 2026) I fixed the car-emissions calculation so it no longer grows with group size, and moved the API key to an environment variable.
