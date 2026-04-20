"use client";
import React from 'react';
import { useSocketRealtime } from '@/context/SocketContext';
import { Users, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { stadiumAreas, waitTimes, isConnected } = useSocketRealtime();

  const totalDensity = stadiumAreas.reduce((acc, area) => acc + area.density, 0);
  const avgDensity = stadiumAreas.length ? Math.round(totalDensity / stadiumAreas.length) : 0;
  
  const avgWaitTime = waitTimes.length ? Math.round(waitTimes.reduce((acc, wt) => acc + wt.time, 0) / waitTimes.length) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel p-6 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400 font-medium">
            <Users size={18} className="text-accent"/> Average Sector Density
          </div>
          <div className="text-4xl font-bold text-white flex items-end gap-2">
            {avgDensity}%
            <span className="text-sm font-normal text-success -mb-1 pb-1">Normal</span>
          </div>
        </motion.div>

        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400 font-medium">
            <Clock size={18} className="text-purple-400"/> Average Wait Time
          </div>
          <div className="text-4xl font-bold text-white flex items-end gap-2">
            {avgWaitTime} <span className="text-lg font-medium text-gray-300 -mb-1 pb-1">mins</span>
          </div>
        </motion.div>

        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400 font-medium">
            <AlertCircle size={18} className="text-warning"/> Network Status
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {isConnected ? 'Optimal' : 'Connecting...'}
          </div>
          <div className="text-xs text-gray-400">All local nodes reporting</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Crowded Areas */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Density Watchlist</h3>
          <div className="space-y-4">
            {stadiumAreas.slice().sort((a,b) => b.density - a.density).map((area, i) => (
              <div key={area.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                <div className="font-medium text-gray-200">{i + 1}. {area.name}</div>
                <div className="flex items-center gap-3 w-1/3">
                  <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${area.density > 80 ? 'bg-danger' : area.density > 50 ? 'bg-warning' : 'bg-success'}`}
                      style={{ width: `${area.density}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-8 text-right">{area.density}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shortest Queues */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Shortest Queues</h3>
          <div className="space-y-4">
            {waitTimes.slice().sort((a,b) => a.time - b.time).slice(0, 5).map((wt) => (
              <div key={wt.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                <div className="font-medium text-gray-200">{wt.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-accent font-bold text-xl">{wt.time}</span>
                  <span className="text-xs text-gray-400 pt-1">mins</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
