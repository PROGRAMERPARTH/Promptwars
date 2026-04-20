"use client";
import { motion } from 'framer-motion';
import { ArrowRight, Activity, MapPin, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-12 mt-6">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-12 rounded-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px]" />
        <div className="max-w-2xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Next-Gen Event Experience <br />
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">Real-Time Data</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Navigate crowds efficiently, find the shortest lines for food and restrooms, and receive live updates directly to your device.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-6 py-3 rounded-full bg-accent hover:bg-blue-600 text-white font-semibold transition flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Enter Venue Dashboard <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
            <Activity size={24} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Live Telemetry</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Monitor real-time crowd densities across all sections and concourses to avoid massive bottlenecks.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-6">
            <MapPin size={24} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Smart Navigation</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Find the quickest routes to your seat or amenities using AI-powered pathfinding reacting to Live congestion.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-success/20 text-success flex items-center justify-center mb-6">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Instant Alerts</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Stay in the loop with emergency broadcasts, flash sales on merchandise, and sudden gate changes.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
