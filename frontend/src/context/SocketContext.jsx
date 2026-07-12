import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [liveAlerts, setLiveAlerts] = useState([]);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Connect socket
    const socketUrl = window.location.origin; // Vite proxy routes socket.io to port 5000
    const newSocket = io(socketUrl, {
      autoConnect: true,
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO Connected to Server');
      // Register user with socket session
      newSocket.emit('register_user', user.id);
    });

    // Listen for notifications
    newSocket.on('notification', (data) => {
      console.log('Real-time notification received:', data);
      
      // Add to live alerts array
      setLiveAlerts((prev) => [data, ...prev]);

      // Show toast message
      if (data.type === 'Alert') {
        toast((t) => (
          <div className="flex flex-col text-slate-100">
            <span className="font-bold text-red-400">⚠️ {data.title}</span>
            <span className="text-xs text-slate-300 mt-0.5">{data.message}</span>
          </div>
        ), {
          duration: 6000,
          style: {
            background: '#1E293B',
            border: '1px solid #EF4444',
            padding: '12px',
          },
        });
      } else {
        toast((t) => (
          <div className="flex flex-col text-slate-100">
            <span className="font-bold text-brand-teal">🔔 {data.title}</span>
            <span className="text-xs text-slate-300 mt-0.5">{data.message}</span>
          </div>
        ), {
          duration: 4000,
          style: {
            background: '#1E293B',
            border: '1px solid #14B8A6',
            padding: '12px',
          },
        });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const clearAlerts = () => {
    setLiveAlerts([]);
  };

  return (
    <SocketContext.Provider value={{ socket, liveAlerts, clearAlerts }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
