"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export type StadiumArea = {
  id: string;
  name: string;
  density: number;
};

export type WaitTime = {
  id: string;
  name: string;
  time: number;
  type: string;
};

export type Alert = {
  id: number;
  message: string;
  time: string;
};

interface SocketContextData {
  socket: Socket | null;
  stadiumAreas: StadiumArea[];
  waitTimes: WaitTime[];
  latestAlert: Alert | null;
  allAlerts: Alert[];
  isConnected: boolean;
  arEnabled: boolean;
  setArEnabled: (val: boolean) => void;
  updateManually: () => void;
  sendAlert: (msg: string) => void;
}

const SocketContext = createContext<SocketContextData>({
  socket: null,
  stadiumAreas: [],
  waitTimes: [],
  latestAlert: null,
  allAlerts: [],
  isConnected: false,
  arEnabled: false,
  setArEnabled: () => {},
  updateManually: () => {},
  sendAlert: () => {},
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [stadiumAreas, setStadiumAreas] = useState<StadiumArea[]>([]);
  const [waitTimes, setWaitTimes] = useState<WaitTime[]>([]);
  const [latestAlert, setLatestAlert] = useState<Alert | null>(null);
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [arEnabled, setArEnabled] = useState(false);

  useEffect(() => {
    // Connect to WebSocket server
    const socketInstance = io('http://localhost:3001');

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('crowd_update', (data: StadiumArea[]) => {
      setStadiumAreas(data);
    });

    socketInstance.on('wait_times', (data: WaitTime[]) => {
      setWaitTimes(data);
    });

    socketInstance.on('alert', (data: Alert) => {
      setLatestAlert(data);
      setAllAlerts((prev) => [data, ...prev]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const updateManually = () => {
    if (socket) {
      socket.emit('request_update');
    }
  };

  const sendAlert = (msg: string) => {
    if (socket) {
      socket.emit('send_alert', msg);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, stadiumAreas, waitTimes, latestAlert, allAlerts, isConnected, arEnabled, setArEnabled, updateManually, sendAlert }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketRealtime = () => useContext(SocketContext);
