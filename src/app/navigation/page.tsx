"use client";
import React, { useState } from 'react';
import { useSocketRealtime } from '@/context/SocketContext';
import { MapPin, Navigation as NavIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navigation() {
  const { stadiumAreas, arEnabled } = useSocketRealtime();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const [showAR, setShowAR] = useState(false);
  const [routeMsg, setRouteMsg] = useState('');

  const activeArea = selectedArea ? stadiumAreas.find(a => a.id === selectedArea) : null;

  const handleRoute = () => {
    if (!activeArea) return;
    if (arEnabled) {
      setShowAR(true);
    } else {
      setRouteMsg(`Routing to ${activeArea.name} (Est: 3 mins)`);
      setTimeout(() => setRouteMsg(''), 4000);
    }
  };

  // Helper to determine color based on density
  const getDensityColor = (areaId: string) => {
    const area = stadiumAreas.find((a) => a.id === areaId);
    if (!area) return 'rgba(255,255,255,0.05)';
    if (area.density > 80) return 'rgba(239, 68, 68, 0.7)'; // Danger Red
    if (area.density > 50) return 'rgba(245, 158, 11, 0.7)'; // Warning Amber
    return 'rgba(16, 185, 129, 0.7)'; // Success Green
  };

  const getDensityText = (areaId: string) => {
    const area = stadiumAreas.find((a) => a.id === areaId);
    if (!area) return 'Unknown';
    if (area.density > 80) return 'Heavy Congestion';
    if (area.density > 50) return 'Moving Slowly';
    return 'Clear Path';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Map Section */}
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden flex items-center justify-center p-8">
        <h3 className="absolute top-6 left-6 text-xl font-bold text-white flex items-center gap-2 z-10">
          <MapPin className="text-accent" /> Live Heatmap
        </h3>
        
        {/* Mock Stadium SVG */}
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-2xl aspect-video bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
          <svg viewBox="0 0 800 400" className="w-full h-full drop-shadow-2xl">
            {/* North Gate */}
            <motion.path 
              onClick={() => setSelectedArea('north-gate')}
              d="M 200 50 Q 400 0 600 50 L 550 150 Q 400 120 250 150 Z" 
              fill={getDensityColor('north-gate')}
              className="cursor-pointer transition-colors duration-1000 hover:opacity-80"
            />
            {/* South Gate */}
             <motion.path 
              onClick={() => setSelectedArea('south-gate')}
              d="M 200 350 Q 400 400 600 350 L 550 250 Q 400 280 250 250 Z" 
              fill={getDensityColor('south-gate')}
              className="cursor-pointer transition-colors duration-1000 hover:opacity-80"
            />
            {/* Field/Center (Static) */}
            <rect x="300" y="160" width="200" height="80" rx="40" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            
            {/* Food Court A (Left) */}
            <motion.path 
              onClick={() => setSelectedArea('food-court-a')}
              d="M 50 150 Q 20 200 50 250 L 230 250 Q 200 200 230 150 Z" 
              fill={getDensityColor('food-court-a')}
              className="cursor-pointer transition-colors duration-1000 hover:opacity-80"
            />
            {/* Section 104 (Right) */}
            <motion.path 
              onClick={() => setSelectedArea('section-104')}
              d="M 750 150 Q 780 200 750 250 L 570 250 Q 600 200 570 150 Z" 
              fill={getDensityColor('section-104')}
              className="cursor-pointer transition-colors duration-1000 hover:opacity-80"
            />
          </svg>
          
          {/* Labels Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="absolute top-[18%] text-xs font-bold text-white/50 tracking-widest">NORTH GATE</span>
            <span className="absolute bottom-[18%] text-xs font-bold text-white/50 tracking-widest">SOUTH ENTRY</span>
            <span className="absolute left-[12%] text-xs font-bold text-white/50 tracking-widest -rotate-90">FOOD COURT</span>
            <span className="absolute right-[12%] text-xs font-bold text-white/50 tracking-widest rotate-90">SEC 104</span>
          </div>
        </motion.div>
      </div>

      {/* Info Panel */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-6 flex-1">
          {activeArea ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full">
              <h3 className="text-xl font-bold text-white mb-2">{activeArea.name}</h3>
              <div className="text-sm font-medium text-gray-400 mb-6">{getDensityText(activeArea.id)}</div>
              
              <div className="text-6xl font-bold text-white mb-2">{activeArea.density}%</div>
              <div className="text-sm text-gray-500 mb-8">Current Capacity Density</div>

              <div className="mt-auto space-y-3">
                <button 
                  onClick={handleRoute}
                  className="w-full py-3 rounded-xl bg-accent hover:bg-blue-600 text-white font-medium transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                  <NavIcon size={18} /> Route Here
                </button>
                {routeMsg && (
                   <motion.div initial={{ opacity: 0}} animate={{ opacity: 1}} className="text-center text-accent text-sm font-semibold mt-3 bg-accent/10 py-2 rounded-lg border border-accent/20">
                     {routeMsg}
                   </motion.div>
                )}
                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition">
                  Find Alternate Area
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-4">
              <MapPin size={48} className="text-white/10" />
              <p>Select a zone on the heatmap to view live density and routing options.</p>
            </div>
          )}
        </div>
      </div>

      {/* AR Modal Overlay Simulation */}
      {showAR && activeArea && (
        <div className="fixed inset-0 z-[200] bg-black overflow-hidden flex flex-col">
          {/* Blurred stadium background simulation */}
          <div className="absolute inset-x-0 bottom-0 top-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1600')] bg-cover bg-center filter blur-sm grayscale"></div>
          
          <div className="relative z-10 flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-danger animate-pulse"></div>
              <span className="text-white font-mono font-bold tracking-widest text-sm drop-shadow-md">LIVE AR FEED</span>
            </div>
            <button onClick={() => setShowAR(false)} className="p-3 bg-white/10 hover:bg-white/25 rounded-full text-white backdrop-blur-md transition shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20">
              <X size={24} />
            </button>
          </div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center pointer-events-none">
             {/* 3D Arrow and text overlay */}
             <motion.div 
               initial={{ y: 50, opacity: 0, scale: 0.8 }}
               animate={{ y: 0, opacity: 1, scale: 1 }}
               transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
               className="flex flex-col items-center gap-4"
             >
               <div className="text-9xl text-accent drop-shadow-[0_0_40px_rgba(59,130,246,1)] translate-y-8 z-20">
                 ↑
               </div>
               <div className="glass-panel px-10 py-5 mx-6 rounded-[2rem] text-white text-xl font-bold backdrop-blur-xl border border-accent/40 shadow-[0_0_30px_rgba(59,130,246,0.3)] text-center relative z-10">
                  Follow glowing path ahead!<br/>
                  <div className="text-accent text-base mt-2 font-semibold">Destination: {activeArea.name}</div>
               </div>
             </motion.div>
          </div>

          <div className="relative z-10 p-6 md:p-8 glass-panel border-t border-white/10 flex justify-around items-center" style={{ backdropFilter: 'blur(24px)' }}>
            <div className="text-center">
              <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wider mb-1 font-semibold">Live Crowd Density</div>
              <div className={`text-2xl md:text-3xl font-bold ${activeArea.density > 75 ? 'text-danger' : activeArea.density > 50 ? 'text-warning' : 'text-success'} drop-shadow-lg`}>{activeArea.density}%</div>
            </div>
            
            <div className="w-px h-12 bg-white/20"></div>

            <div className="text-center">
              <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wider mb-1 font-semibold">Est. Arrival Time</div>
              <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">4 min</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
