const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const axios = require("axios");
require("dotenv").config();

const TARGET_CITIES = [
  { name: "New York, USA", lat: 40.7128, lon: -74.006 },
  { name: "London, UK", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo, Japan", lat: 35.6895, lon: 139.6917 },
  { name: "Berlin, Germany", lat: 52.52, lon: 13.405 },
  { name: "Sydney, Australia", lat: -33.8688, lon: 151.2093 },
  { name: "São Paulo, Brazil", lat: -23.5505, lon: -46.6333 },
  { name: "Toronto, Canada", lat: 43.65107, lon: -79.347015 },
  { name: "Cape Town, South Africa", lat: -33.9249, lon: 18.4241 },
];

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 3001;
const IP_LOOKUP_URL = "http://ip-api.com/json/";
const THREATFOX_URL = "https://threatfox-api.abuse.ch/api/v1/";
const AUTH_KEY = process.env.THREATFOX_AUTH_KEY;

const attackHistory = [];
let cachedThreatfoxResponses = {}; // cache by query key
let lastCacheTimestamps = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

io.on("connection", (socket) => {
  console.log("🟢 Frontend connected via Socket.IO");
  attackHistory.forEach((attack) => socket.emit("new_attack", attack));
});

async function getGeo(ip) {
  try {
    const res = await axios.get(IP_LOOKUP_URL + ip);
    if (!res.data || res.data.status !== "success")
      throw new Error("Invalid geo response");
    return {
      lat: res.data.lat,
      lon: res.data.lon,
      country: res.data.country,
    };
  } catch (err) {
    console.error(`🌐 Geo lookup failed for IP ${ip}:`, err.message);
    return null;
  }
}

const ipRegex = /^\d{1,3}(?:\.\d{1,3}){3}$/;
const ipPortRegex = /^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/;

function extractIP(entry) {
  if (entry.host && ipRegex.test(entry.host)) return entry.host;
  if (entry.ioc && ipRegex.test(entry.ioc)) return entry.ioc;
  if (entry.ioc && ipPortRegex.test(entry.ioc))
    return entry.ioc.match(ipPortRegex)[1];
  return null;
}

async function fetchThreatData() {
  try {
    console.log("🔁 Fetching real threat data from ThreatFox...");
    const res = await axios.post(
      THREATFOX_URL,
      { query: "get_iocs", limit: 50 },
      {
        headers: {
          "Content-Type": "application/json",
          "Auth-Key": AUTH_KEY,
        },
      }
    );

    const threats = res.data.data.filter((entry) => extractIP(entry));
    console.log("📦 Valid threats with IPs:", threats.length);

    for (const threat of threats.slice(0, 5)) {
      const srcIP = extractIP(threat);
      if (!srcIP) continue;

      const sourceGeo = await getGeo(srcIP);
      const targetGeo = getRandomTarget();

      if (sourceGeo && targetGeo) {
        const attack = {
          type: threat.malware || "Unknown",
          severity: threat.threat_type || "Unknown",
          source: sourceGeo,
          target: targetGeo,
          timestamp: new Date().toISOString(),
        };

        attackHistory.push(attack);
        io.emit("new_attack", attack);
        console.log("📡 Emitted attack:", attack);
      }
    }
  } catch (err) {
    console.error("❌ Threat data fetch failed:", err.message);
  }
}

setInterval(fetchThreatData, 30000);

app.get("/", (req, res) => {
  res.send("✅ Cyber Threat Map backend is running.");
});

app.post("/api/threatfox", async (req, res) => {
  const cacheKey = JSON.stringify(req.body);
  const now = Date.now();

  if (
    cachedThreatfoxResponses[cacheKey] &&
    now - lastCacheTimestamps[cacheKey] < CACHE_DURATION
  ) {
    return res.json(cachedThreatfoxResponses[cacheKey]);
  }

  try {
    const response = await axios.post(THREATFOX_URL, req.body, {
      headers: {
        "Content-Type": "application/json",
        "Auth-Key": AUTH_KEY,
      },
    });
    cachedThreatfoxResponses[cacheKey] = response.data;
    lastCacheTimestamps[cacheKey] = now;
    res.json(response.data);
  } catch (err) {
    console.error("❌ Proxy error to ThreatFox:", err.message);
    const status = err.response?.status || 500;
    const msg = err.response?.data || { error: "Proxy failure" };
    res.status(status).json(msg);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Backend listening at http://localhost:${PORT}`);
});

function getRandomTarget() {
  const target =
    TARGET_CITIES[Math.floor(Math.random() * TARGET_CITIES.length)];
  return {
    lat: target.lat,
    lon: target.lon,
    country: target.name,
  };
}
