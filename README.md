# 🛰️ Cyber Threat Map

A real-time interactive map visualizing global cyber attacks using live data from the [ThreatFox API](https://threatfox.abuse.ch/). Built with **Node.js**, **Socket.IO**, **React**, and **Mapbox**.

## 📸 Preview

![Screenshot 2025-05-22 090155](https://github.com/user-attachments/assets/e527a465-8551-4c06-b81e-04fb1cf0e4c9)
![Screenshot 2025-05-22 090206](https://github.com/user-attachments/assets/7d7d66fd-577a-4a0a-b5b3-22840fea317c)
![Screenshot 2025-05-22 090222](https://github.com/user-attachments/assets/5916d12b-1d17-4da4-8f03-b6de6d751d3f)
![Screenshot 2025-05-22 090232](https://github.com/user-attachments/assets/85be3802-538d-4c6e-9fea-d7494932f518)

## 🔥 Features

- 🌍 Real-time attack data from ThreatFox
- 📡 WebSocket updates using Socket.IO
- 🗺️ Animated attack lines on a 2D or 3D map (Mapbox / Globe.gl)
- 📍 GeoIP lookup for attack sources 
- 📊 Filter by malware family and threat type
- 🧠 Caching + rate limit-friendly backend
- 🌐 Proxy API endpoint to avoid CORS
- 🔐 `.env`-based secure API key management

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v16+)
- NPM
- A ThreatFox API Key (register on [abuse.ch](https://abuse.ch/))

---

### 📦 Backend Setup
````
cd backend
npm install
````
- Create a .env file in the backend/ folder:
  
THREATFOX_AUTH_KEY=your_api_key_here

- Then run:
````
npm start
````

---

### 🖥️ Frontend Setup
````
cd frontend
npm install
npm start
````

--- 

### 🌐 Environment Variables
- backend
API Key	= THREATFOX_AUTH_KEY	Your API key from abuse.ch
- frontend
API Key = REACT_APP_MAPBOX_TOKEN Your API key from mapbox

--- 

## 🛠️ Tech Stack
- Frontend: React, react-map-gl (Mapbox), CSS

- Backend: Node.js, Express, Socket.IO, Axios

- APIs: ThreatFox, ip-api.com

Hosting: (Optional: Vercel/Render/Heroku)

--- 

## 🔒 Security Notes
Your .env file is never committed (via .gitignore)

--- 

## 📜 License
MIT License © 2025
