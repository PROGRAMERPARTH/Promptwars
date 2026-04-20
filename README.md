# Smart Event Platform 🏟️

Welcome to the **Smart Event Platform**! A next-generation, real-time stadium management and attendee experience interface. Designed to seamlessly manage 50,000+ concurrent attendees in large-scale sporting venues by solving crowd congestion, optimizing wait times, and enabling instant two-way communication.

## 🌟 Key Features

* **Live Sync Telemetry Dashboard:** View real-time crowd density, network statuses, and bottleneck metrics across the venue powered by an active WebSocket loop.
* **Dynamic Smart Navigation:** A live interactive heatmap that computes the safest and fastest walking routes to facilities depending on current hall congestion.
* **AR Camera Simulation:** An immersive digital camera overlay tracking system designed to guide attendees directly to their specific seats via visual projection queues.
* **Queue & Wait Time Tracking:** Actively track sorting lines and find the shortest estimated wait times for food kiosks and restrooms so attendees never miss the live action.
* **Admin Broadcast Console:** A dedicated management tool allowing event staff to physically type and broadcast emergency or promotional push-notifications instantly to all connected mobile attendees.
* **Centralized Inbox:** Complete timeline log tracking "System Updates", "Flash Promos", and crucial "Emergency Alerts" so data is never permanently missed.

## 🚀 Technology Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Lucide Icons.
* **Backend Engine:** Standalone Node.js Express Server processing real-time node shifts.
* **Real-time Pipeline:** Socket.io bi-directional data flow.
* **Responsive Architecture:** Fully mobile-optimized layouts tailored for attendee phone screens.

## 🛠️ Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the Concurrent Servers
This will execute both the Next.js development server (Port 3000) and the Node WebSocket backend (Port 3001) simultaneously:
```bash
npm run dev
```

### 3. Experience the Platform
Open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)

---
*Developed for Promptwars.*
