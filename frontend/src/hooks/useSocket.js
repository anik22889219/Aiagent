import { useEffect } from 'react';
import { io } from 'socket.io-client';

let socket;

export function useSocket(namespace, onEvent) {
  useEffect(() => {
    socket = io(process.env.REACT_APP_API_URL || '', { path: '/socket.io' });
    if (namespace) {
      socket = io(`${process.env.REACT_APP_API_URL || ''}${namespace}`);
    }
    if (onEvent) {
      Object.entries(onEvent).forEach(([event, handler]) => {
        socket.on(event, handler);
      });
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [namespace, onEvent]);

  return socket;
}
