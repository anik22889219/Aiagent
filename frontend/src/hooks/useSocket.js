import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(namespace, onEvent) {
  const socketRef = useRef(null);
  const handlersRef = useRef(onEvent);

  // Keep latest handlers in ref so we don't need to re-bind socket listeners on every render
  useEffect(() => {
    handlersRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    const url = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const socketUrl = namespace ? `${url}${namespace}` : url;

    socketRef.current = io(socketUrl, {
      path: '/socket.io',
      reconnection: true,
      reconnectionAttempts: 5
    });

    // Bind listeners ONCE using the keys from the initial onEvent object
    if (onEvent) {
      Object.keys(onEvent).forEach((event) => {
        socketRef.current.on(event, (...args) => {
          if (handlersRef.current && handlersRef.current[event]) {
            handlersRef.current[event](...args);
          }
        });
      });
    }

    return () => {
      if (socketRef.current) {
        // Disconnect automatically removes all bound listeners
        socketRef.current.disconnect();
      }
    };
  }, [namespace]); // Only reconnect if namespace changes

  return socketRef.current;
}
