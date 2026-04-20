"use client";
import React, { useState } from 'react';
import { useSocketRealtime } from '@/context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Coffee, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WaitTimes() {
  const { waitTimes } = useSocketRealtime();
  const [filter, setFilter] = useState('all');

  const filteredTimes = waitTimes.filter(wt => filter === 'all' || wt.type === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Live Queues & Wait Times</h2>
        
        <div className="flex bg-white/5 p-1 rounded-lg">
          {['all', 'food', 'restroom', 'gate'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition 
                ${filter === cat ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <AnimatePresence>
          {filteredTimes.sort((a, b) => a.time - b.time).map((wt) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={wt.id}
              className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs uppercase font-bold text-accent tracking-wider mb-1">{wt.type}</div>
                  <h3 className="text-lg font-semibold text-white">{wt.name}</h3>
                </div>
                {wt.type === 'food' ? <Coffee className="text-gray-400" size={20} /> : <MapPin className="text-gray-400" size={20} />}
              </div>
              
              <div className="flex items-end justify-between mt-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Live Wait</div>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-bold leading-none ${wt.time > 15 ? 'text-danger' : wt.time > 8 ? 'text-warning' : 'text-success'}`}>
                      {wt.time}
                    </span>
                    <span className="text-gray-400 pb-1">mins</span>
                  </div>
                </div>
                <Link href="/navigation" className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition group">
                  <ArrowRight size={18} className="text-gray-400 group-hover:text-white" />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
