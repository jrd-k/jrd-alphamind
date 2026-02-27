import { useEffect, useRef, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

type WebSocketMessage = {
  type: 'trade' | 'brain_signal' | 'pong' | 'error' | 'subscribed' | 'heartbeat' | 'stats';
  data?: any;
  timestamp: string;
  symbol?: string;
  message?: string;
};

type WebSocketOptions = {
  onTrade?: (trade: any) => void;
  onBrainSignal?: (signal: any) => void;
  onError?: (error: any) => void;
  onHeartbeat?: () => void;
  reconnectInterval?: number;
  maxReconnects?: number;
  autoConnect?: boolean;
};

export function useSecureWebSocket(options: WebSocketOptions = {}) {
  const {
    onTrade,
    onBrainSignal,
    onError,
    onHeartbeat,
    reconnectInterval = 3000,
    maxReconnects = 5,
    autoConnect = true
  } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();
  
  const getToken = () => localStorage.getItem('access_token');
  
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const token = getToken();
    if (!token) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to access real-time updates',
        variant: 'destructive'
      });
      return;
    }
    
    // Close existing connection
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.VITE_API_URL?.replace(/^https?:\/\//, '') || window.location.host;
    const wsUrl = `${protocol}//${host}/ws/trades?token=${token}`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log('[WebSocket] Connected');
        setIsConnected(true);
        reconnectCountRef.current = 0;
      };
      
      ws.onmessage = (event) => {
        const message: WebSocketMessage = JSON.parse(event.data);
        setLastMessage(message);
        
        switch (message.type) {
          case 'trade':
            onTrade?.(message.data);
            break;
          case 'brain_signal':
            onBrainSignal?.(message.data);
            break;
          case 'heartbeat':
            onHeartbeat?.();
            break;
          case 'error':
            onError?.(message.data);
            toast({
              title: 'WebSocket Error',
              description: message.message || JSON.stringify(message.data),
              variant: 'destructive'
            });
            break;
          case 'subscribed':
            console.log('[WebSocket] Subscribed to', message.symbol);
            break;
        }
      };
      
      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        setIsConnected(false);
        onError?.(error);
      };
      
      ws.onclose = (event) => {
        console.log('[WebSocket] Closed:', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt reconnect if not manually closed and has retries left
        if (event.code !== 1000 && reconnectCountRef.current < maxReconnects) {
          reconnectCountRef.current++;
          console.log(`[WebSocket] Reconnecting (${reconnectCountRef.current}/${maxReconnects})...`);
          toast({
            title: 'Connection Lost',
            description: `Reconnecting... (${reconnectCountRef.current}/${maxReconnects})`
          });
          
          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval * Math.pow(1.5, reconnectCountRef.current - 1)); // exponential backoff
        } else if (reconnectCountRef.current >= maxReconnects) {
          toast({
            title: 'Connection Failed',
            description: 'Could not reconnect. Please refresh the page.',
            variant: 'destructive'
          });
        }
      };
      
    } catch (error) {
      console.error('[WebSocket] Failed to create connection:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to establish WebSocket connection',
        variant: 'destructive'
      });
    }
  }, [onTrade, onBrainSignal, onError, onHeartbeat, reconnectInterval, maxReconnects, toast]);
  
  const disconnect = useCallback(() => {
    reconnectCountRef.current = maxReconnects; // Prevent auto-reconnect
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close(1000, 'Manual disconnect');
    }
  }, [maxReconnects]);
  
  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('[WebSocket] Connection not open, cannot send message');
    }
  }, []);
  
  const subscribeSymbol = useCallback((symbol: string) => {
    sendMessage({ action: 'subscribe_symbol', symbol });
  }, [sendMessage]);

  const ping = useCallback(() => {
    sendMessage({ action: 'ping' });
  }, [sendMessage]);

  const getStats = useCallback(() => {
    sendMessage({ action: 'stats' });
  }, [sendMessage]);
  
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => disconnect();
  }, [connect, disconnect, autoConnect]);
  
  return {
    isConnected,
    lastMessage,
    connect,
    disconnect,
    sendMessage,
    subscribeSymbol,
    ping,
    getStats
  };
}
