"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X } from 'lucide-react';
import { useSocketRealtime, Alert } from '@/context/SocketContext';

export function NotificationsPanel() {
  const { latestAlert } = useSocketRealtime();
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (latestAlert) {
      setActiveAlerts((prev) => [latestAlert, ...prev].slice(0, 3)); // Keep last 3
      
      // Auto dismiss after 10s
      const timer = setTimeout(() => {
        setActiveAlerts((prev) => prev.filter((a) => a.id !== latestAlert.id));
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [latestAlert]);

  const dismiss = (id: number) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {activeAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="w-80 glass-panel border border-white/10 rounded-xl p-4 shadow-2xl relative overflow-hidden"
          >
            {/* Glow left border based on warning type */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${alert.message.includes('Warning') || alert.message.includes('Emergency') ? 'bg-danger shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-accent shadow-[0_0_10px_rgba(59,130,246,0.8)]'}`} />
            
            <div className="flex items-start gap-3 pl-2">
              <div className="mt-1">
                {alert.message.includes('Warning') || alert.message.includes('Emergency') ? (
                  <AlertTriangle className="text-danger" size={20} />
                ) : (
                  <Info className="text-accent" size={20} />
                )}
              </div>
              <div className="flex-1 pr-6">
                <h4 className="font-semibold text-white text-sm mb-1">
                  {alert.message.includes('Warning') || alert.message.includes('Emergency') ? 'Urgent Alert' : 'Dynamic Update'}
                </h4>
                <p className="text-gray-300 text-xs leading-relaxed">{alert.message}</p>
                <div className="text-[10px] text-gray-500 mt-2">
                  {new Date(alert.time).toLocaleTimeString()}
                </div>
              </div>
              <button 
                onClick={() => dismiss(alert.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
