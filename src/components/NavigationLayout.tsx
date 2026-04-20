"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, Clock, User, Bell, Home, RefreshCw, Megaphone } from 'lucide-react';
import { useSocketRealtime } from '@/context/SocketContext';
import { NotificationsPanel } from './NotificationsPanel';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/navigation', label: 'Navigation', icon: Map },
  { href: '/wait-times', label: 'Wait Times', icon: Clock },
  { href: '/notifications', label: 'Alerts', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];

export function NavigationLayout({ children }: { children: React.ReactNode }) {
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const pathname = usePathname();
  const { isConnected, updateManually, sendAlert } = useSocketRealtime();

  const handleSendAlert = () => {
    if(broadcastMessage.trim()) {
      sendAlert(broadcastMessage);
      setBroadcastMessage('');
      setIsBroadcastOpen(false);
    }
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    updateManually();
    setTimeout(() => setIsSyncing(false), 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 glass-panel border-r border-white/5 flex-col items-center py-8 z-20 shrink-0">
        <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                S
            </div>
            <div className="text-xl font-bold tracking-widest text-white">
            SMART<span className="text-accent">VENUE</span>
            </div>
        </div>
        <nav className="flex-1 w-full px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 ${isActive ? 'bg-accent/20 text-accent border border-accent/20 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 text-xs font-semibold text-gray-400 mt-auto px-6 w-full justify-center">
          <div className="relative flex items-center justify-center w-3 h-3">
            {isConnected && <div className="absolute w-full h-full rounded-full bg-success opacity-50 animate-ping"></div>}
            <div className={`relative w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-danger'}`}></div>
          </div>
          <span className="truncate">{isConnected ? 'LIVE SYNC ACTIVE' : 'CONNECTING...'}</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background relative relative">
        {/* Ambient Glows */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <header className="h-16 md:h-20 glass-panel border-b border-transparent flex items-center justify-between px-6 md:px-10 shrink-0 z-10 bg-transparent">
          <h1 className="text-lg md:text-xl font-bold capitalize text-white/90">
             {pathname === '/' ? 'Platform Overview' : navItems.find(i => i.href === pathname)?.label || 'Page'}
          </h1>
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsBroadcastOpen(true)}
              className="px-3 md:px-4 py-2 md:py-2.5 rounded-full glass-panel hover:bg-white/10 transition text-gray-300 flex items-center gap-2 shadow-[0_0_10px_rgba(255,255,255,0.05)]"
            >
              <Megaphone size={16} className="text-warning" />
              <span className="hidden md:inline text-xs font-semibold">Broadcast</span>
            </button>
            <button 
              onClick={handleManualSync}
              className={`px-3 md:px-4 py-2 md:py-2.5 rounded-full glass-panel hover:bg-white/10 transition flex items-center gap-2 shadow-[0_0_10px_rgba(255,255,255,0.05)] ${isSyncing ? 'text-success bg-white/10 border border-success/30' : 'text-gray-300'}`}
            >
              <RefreshCw size={16} className={`${isSyncing ? 'animate-spin text-success' : isConnected ? 'text-accent' : ''}`} />
              <span className="hidden md:inline text-xs font-semibold">{isSyncing ? 'Syncing...' : 'Live Sync'}</span>
            </button>
            <Link 
              href="/notifications"
              className="p-2 md:p-2.5 rounded-full glass-panel hover:bg-white/10 transition text-gray-300 relative"
            >
              <Bell size={18}/>
              {/* Optional red dot if there are unread alerts could go here */}
            </Link>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-accent to-purple-600 border border-white/10 shadow-lg cursor-pointer flex items-center justify-center text-xs font-bold text-white">JD</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 flex items-center justify-around px-2 py-3 z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? 'text-accent' : 'text-gray-400'}`}>
              <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <NotificationsPanel />

      {/* Broadcast Modal Overlay */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl w-full max-w-md shadow-2xl border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Megaphone className="text-warning" size={20} />
              Broadcast Manual Alert
            </h3>
            <textarea 
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent mb-4 resize-none"
              placeholder="Type an announcement to broadcast to all attendees..."
            ></textarea>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsBroadcastOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendAlert}
                className="px-4 py-2 rounded-lg bg-accent hover:bg-blue-600 text-white transition shadow-[0_0_15px_rgba(59,130,246,0.5)] text-sm font-medium"
              >
                Send Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
