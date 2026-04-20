"use client";
import React from 'react';
import { useSocketRealtime } from '@/context/SocketContext';
import { Bell, AlertTriangle, Info, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsPage() {
  const { allAlerts } = useSocketRealtime();

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10">
            <Bell className="text-accent" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Inbox & Alerts</h2>
            <p className="text-sm text-gray-400">Complete log of venue announcements</p>
          </div>
        </div>
        <div className="text-sm font-semibold text-gray-300 bg-white/5 px-4 py-2 flex items-center gap-2 rounded-full border border-white/5 shadow-inner">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          {allAlerts.length} Messages
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-3xl p-6 md:p-8 overflow-y-auto">
        {allAlerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
            <CheckCircle size={48} className="text-white/10" />
            <p className="text-lg">You are all caught up! No active broadcasts.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {allAlerts.map((alert) => {
                const textLower = alert.message.toLowerCase();
                const isUrgent = textLower.includes('warning') || textLower.includes('emergency') || textLower.includes('lost') || textLower.includes('closing');
                const isPromo = textLower.includes('sale') || textLower.includes('off ') || textLower.includes('promotion');
                
                return (
                  <motion.div 
                    layout
                    key={alert.id}
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`relative p-5 rounded-2xl border backdrop-blur-md overflow-hidden flex gap-4 transition-all hover:bg-white/10 
                      ${isUrgent ? 'bg-danger/10 border-danger/30' : isPromo ? 'bg-purple-600/10 border-purple-500/30' : 'bg-white/5 border-white/10'}`}
                  >
                    <div className={`absolute top-0 bottom-0 left-0 w-1.5 
                      ${isUrgent ? 'bg-danger shadow-[0_0_10px_rgba(239,68,68,0.8)]' : isPromo ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 'bg-accent'}`} />
                    
                    <div className="mt-1">
                      {isUrgent ? (
                        <AlertTriangle className="text-danger drop-shadow-md" size={24} />
                      ) : (
                        <Info className={isPromo ? "text-purple-400" : "text-accent"} size={24} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2 text-md">
                        {isUrgent ? 'Urgent Alert' : isPromo ? 'Flash Promotion' : 'System Update'}
                      </h4>
                      <p className="text-gray-300 leading-relaxed text-sm">{alert.message}</p>
                      
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-4 font-medium uppercase tracking-wider">
                        <Clock size={12} />
                        {new Date(alert.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
