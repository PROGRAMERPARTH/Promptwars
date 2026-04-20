const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Mock Initial States
let stadiumAreas = [
  { id: 'north-gate', name: 'North Gate', density: 30 },
  { id: 'south-gate', name: 'South Gate', density: 45 },
  { id: 'food-court-a', name: 'Food Court A', density: 80 },
  { id: 'restroom-east', name: 'East Restrooms', density: 20 },
  { id: 'merch-store', name: 'Merchandise', density: 60 },
  { id: 'section-104', name: 'Section 104', density: 95 }
];

let waitTimes = [
  { id: 'food-a', name: 'Hot Dog Stand A', time: 15, type: 'food' },
  { id: 'food-b', name: 'Pizza Kiosk B', time: 5, type: 'food' },
  { id: 'rr-east', name: 'Restroom East', time: 2, type: 'restroom' },
  { id: 'rr-west', name: 'Restroom West', time: 12, type: 'restroom' },
  { id: 'gate-n', name: 'North Entry', time: 20, type: 'gate' },
];

io.on('connection', (socket) => {
  console.log('[Socket] Client connected:', socket.id);
  
  // Send initial data immediately
  socket.emit('crowd_update', stadiumAreas);
  socket.emit('wait_times', waitTimes);

  socket.on('request_update', () => {
    console.log('[Socket] Manual update requested by:', socket.id);
    
    // Immediately shuffle the data drastically so the UI change is visible to the user
    stadiumAreas = stadiumAreas.map(area => ({
      ...area,
      density: Math.max(5, Math.min(100, area.density + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 15)))
    }));
    
    waitTimes = waitTimes.map(wt => ({
      ...wt,
      time: Math.max(1, Math.min(45, wt.time + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 8)))
    }));

    socket.emit('crowd_update', stadiumAreas);
    socket.emit('wait_times', waitTimes);
  });

  socket.on('send_alert', (msg) => {
    console.log('[Socket] Manual alert sent:', msg);
    io.emit('alert', { id: Date.now(), message: msg, time: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Client disconnected:', socket.id);
  });
});

// Simulation loop - update values periodically
setInterval(() => {
  // Update crowd densities randomly by slightly adjusting values
  stadiumAreas = stadiumAreas.map(area => {
    let change = Math.floor(Math.random() * 21) - 10; // -10 to +10
    let newDensity = Math.min(100, Math.max(0, area.density + change));
    return { ...area, density: newDensity };
  });

  // Update wait times
  waitTimes = waitTimes.map(wt => {
    let change = Math.floor(Math.random() * 5) - 2; // -2 to +2
    let newTime = Math.max(0, wt.time + change);
    return { ...wt, time: newTime };
  });

  io.emit('crowd_update', stadiumAreas);
  io.emit('wait_times', waitTimes);

}, 3000); // 3 seconds refresh

// Occasional mock alerts
setInterval(() => {
  if (Math.random() > 0.7) {
    const alerts = [
      "Flash Sale: 20% off all merch at the East Store for the next 15 minutes!",
      "Warning: South Gate is currently experiencing heavy congestion. Please use West Gate.",
      "Halftime is approaching! Pre-order your food in the app to skip the line.",
      "Lost child found near Section 104. Please report to security if you have information."
    ];
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    io.emit('alert', { id: Date.now(), message: randomAlert, time: new Date() });
  }
}, 15000); // Check every 15 seconds

server.listen(3001, () => {
  console.log('✅ Real-time Server running on http://localhost:3001');
});
