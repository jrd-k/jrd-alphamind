// AlphaMind API Service - Connects frontend to backend
// Place this in src/services/api.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

// Types matching backend Pydantic models
export interface OrderCreate {
  symbol: string;
  quantity: number;
  current_price: number;
  stop_loss_pips?: number;
  indicators?: any[];
}

export interface OrderRead {
  id: number;
  user_id: number;
  symbol: string;
  quantity: number;
  status: string;
  created_at: string;
}

export interface TradeCreate {
  symbol: string;
  side: string;
  price: number;
  qty: number;
  timestamp?: string;
  order_id?: string;
  user_id?: number;
  metadata?: any;
}

export interface TradeRead extends TradeCreate {
  id: number;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('auth_token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `API Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }



  // Authentication
  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: credentials.email, // Backend uses username
        password: credentials.password,
      }),
    });

    localStorage.setItem('auth_token', response.access_token);
    return response;
  }

  async register(userData: { email: string; password: string }) {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: userData.email,
        password: userData.password,
      }),
    });
  }

  // User
  async getUserProfile() {
    return this.request('/api/v1/users/me');
  }

  // Market data
  async getStocks(symbol?: string, interval = 'daily') {
    const params = new URLSearchParams();
    if (symbol) params.append('symbol', symbol);
    params.append('interval', interval);

    try {
      const response = await this.request(`/api/stocks?${params}`);
      if (response && response.data && Array.isArray(response.data)) {
        response.data = response.data.map((candle: any) => ({
          time: new Date(candle.date).getTime() / 1000,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: candle.volume,
        }));
      } else if (Array.isArray(response)) {
        const data = response.map((candle: any) => ({
          time: new Date(candle.date).getTime() / 1000,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: candle.volume,
        }));
        return { data };
      }
      return response || { data: [] };
    } catch (error) {
      console.error('Error getting stocks:', error);
      return { data: [] };
    }
  }

  async getStockQuote(symbol: string) {
    return this.request(`/api/stocks/quote/${symbol}`);
  }

  // Orders
  async placeOrder(order: OrderCreate): Promise<OrderRead> {
    return this.request('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async listOrders(): Promise<OrderRead[]> {
    return this.request('/api/v1/orders');
  }

  async getOrder(orderId: number): Promise<OrderRead> {
    return this.request(`/api/v1/orders/${orderId}`);
  }

  // Trades
  async listTrades(params?: { symbol?: string; since?: string; limit?: number }): Promise<TradeRead[]> {
    const qs = new URLSearchParams();
    if (params?.symbol) qs.append('symbol', params.symbol);
    if (params?.since) qs.append('since', params.since);
    if (params?.limit) qs.append('limit', String(params.limit));
    const query = qs.toString() ? `?${qs}` : '';
    return this.request(`/api/v1/trades${query}`);
  }

  async createTrade(trade: TradeCreate): Promise<TradeRead> {
    return this.request('/api/v1/trades', {
      method: 'POST',
      body: JSON.stringify(trade),
    });
  }

  async createPaperTrade(trade: TradeCreate): Promise<TradeRead> {
    return this.request('/api/v1/trades/paper', {
      method: 'POST',
      body: JSON.stringify(trade),
    });
  }

  // Brain / ML
  async getBrainDecision(symbol: string, candles: any[], currentPrice: number) {
    return this.request('/api/v1/brain/decide', {
      method: 'POST',
      body: JSON.stringify({ symbol, candles, current_price: currentPrice }),
    });
  }

  async trainMLModel(symbol: string, days = 365) {
    return this.request('/api/v1/ml/train', {
      method: 'POST',
      body: JSON.stringify({ symbol, days, force_retrain: true }),
    });
  }

  async getMLPrediction(symbol: string, currentPrice: number) {
    return this.request('/api/v1/ml/predict', {
      method: 'POST',
      body: JSON.stringify({ symbol, current_price: currentPrice }),
    });
  }

  // Broker accounts (same as before)
  async getBrokerAccounts() {
    try {
      const response = await this.request('/api/v1/brokers/accounts');
      if (Array.isArray(response)) return response;
      if (response?.data && Array.isArray(response.data)) return response.data;
      return [];
    } catch (error) {
      console.error('Error getting broker accounts:', error);
      return [];
    }
  }

  async createBrokerAccount(data: {
    broker_name: string;
    account_id?: string;
    api_key?: string;
    api_secret?: string;
    base_url?: string;
    mt5_path?: string;
    mt5_password?: string;
  }) {
    return this.request('/api/v1/brokers/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBrokerAccount(accountId: number, data: any) {
    return this.request(`/api/v1/brokers/accounts/${accountId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBrokerAccount(accountId: number) {
    return this.request(`/api/v1/brokers/accounts/${accountId}`, { method: 'DELETE' });
  }

  async activateBrokerAccount(accountId: number) {
    return this.request(`/api/v1/brokers/accounts/${accountId}/activate`, { method: 'PUT' });
  }
}

export const api = new ApiService();