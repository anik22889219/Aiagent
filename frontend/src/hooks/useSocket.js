import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(namespace, onEvent) {
  const socketRef = useRef(null);

  useEffect(() => {
    const url = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const socketUrl = namespace ? `${url}${namespace}` : url;

    socketRef.current = io(socketUrl, {
      path: '/socket.io',
      reconnection: true,
      reconnectionAttempts: 5
    });

    if (onEvent) {
      Object.entries(onEvent).forEach(([event, handler]) => {
        socketRef.current.on(event, handler);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [namespace]); // Only reconnect if namespace changes

  // Update handlers without reconnecting
  useEffect(() => {
    if (!socketRef.current || !onEvent) return;

    Object.entries(onEvent).forEach(([event, handler]) => {
      socketRef.current.off(event);
      socketRef.current.on(event, handler);
    });
  }, [onEvent]);

  return socketRef.current;
}
