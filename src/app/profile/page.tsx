"use client";
import React, { useState } from 'react';
import { useSocketRealtime } from '@/context/SocketContext';
import { User, Bell, Map, Settings, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { arEnabled, setArEnabled } = useSocketRealtime();

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="glass-panel p-8 rounded-3xl flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent to-purple-600 flex items-center justify-center text-3xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          JD
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            John Doe <span className="px-2 py-0.5 text-xs bg-success/20 text-success rounded-full border border-success/30 font-medium">VIP Member</span>
          </h2>
          <p className="text-gray-400 mt-1">Section 104 • Seat 24A</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Preferences */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Settings size={20} className="text-accent" /> App Preferences
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Push Notifications</p>
                <p className="text-sm text-gray-400">Flash sales and gate changes</p>
              </div>
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-accent' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notificationsEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">AR Navigation</p>
                <p className="text-sm text-gray-400">Use camera for live pathfinding</p>
              </div>
              <button 
                onClick={() => setArEnabled(!arEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${arEnabled ? 'bg-accent' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${arEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Saved Routes */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Map size={20} className="text-purple-400" /> Saved Locations
          </h3>
          
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
              <div>
                <div className="font-medium text-white text-sm">My Seat</div>
                <div className="text-xs text-gray-400">Section 104, Row G</div>
              </div>
              <MapPinIcon />
            </div>
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
              <div>
                <div className="font-medium text-white text-sm">East Concourse Entrance</div>
                <div className="text-xs text-gray-400">Gate B</div>
              </div>
              <MapPinIcon />
            </div>
          </div>
          
          <button className="w-full mt-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition text-sm flex items-center justify-center gap-2">
            <Save size={16} /> Add Location
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function MapPinIcon() {
  return <Map size={18} className="text-gray-500" />;
}
