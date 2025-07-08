import { io, Socket } from 'socket.io-client';
import { AgentType, AgentStatus } from '../../shared/types';

interface WebSocketEvents {
  // Agent events
  'agent:started': (data: { agentType: AgentType; status: AgentStatus }) => void;
  'agent:stopped': (data: { agentType: AgentType; status: AgentStatus }) => void;
  'agent:error': (data: { agentType: AgentType; error: string }) => void;
  'agent:data': (data: { agentType: AgentType; data: any }) => void;
  'agent:configured': (data: { agentType: AgentType; config: any }) => void;
  
  // Metrics events
  'agents:metrics': (data: any[]) => void;
  'dashboard:metrics': (data: any) => void;
  
  // Activity events
  'activity:log': (data: any) => void;
  
  // Connection events
  'connect': () => void;
  'disconnect': () => void;
  'reconnect': () => void;
  'reconnect_error': (error: Error) => void;
}

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private eventListeners: Map<string, Set<Function>> = new Map();

  constructor() {
    this.connect();
  }

  private connect() {
    const serverUrl = process.env.NODE_ENV === 'production' 
      ? 'wss://devops.revenueripple.org'
      : 'ws://localhost:3001';

    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
      autoConnect: true
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connect');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
      this.emit('disconnect');
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('WebSocket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('reconnect');
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('WebSocket reconnection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.emit('reconnect_error', error);
      }
    });

    // Agent events
    this.socket.on('agent:started', (data) => this.emit('agent:started', data));
    this.socket.on('agent:stopped', (data) => this.emit('agent:stopped', data));
    this.socket.on('agent:error', (data) => this.emit('agent:error', data));
    this.socket.on('agent:data', (data) => this.emit('agent:data', data));
    this.socket.on('agent:configured', (data) => this.emit('agent:configured', data));

    // Metrics events
    this.socket.on('agents:metrics', (data) => this.emit('agents:metrics', data));
    this.socket.on('dashboard:metrics', (data) => this.emit('dashboard:metrics', data));

    // Activity events
    this.socket.on('activity:log', (data) => this.emit('activity:log', data));
  }

  public on<K extends keyof WebSocketEvents>(event: K, callback: WebSocketEvents[K]) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  public off<K extends keyof WebSocketEvents>(event: K, callback: WebSocketEvents[K]) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data?: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  public startAgent(agentType: AgentType) {
    if (this.socket && this.isConnected) {
      this.socket.emit('agent:start', agentType);
    } else {
      console.warn('WebSocket not connected. Cannot start agent:', agentType);
    }
  }

  public stopAgent(agentType: AgentType) {
    if (this.socket && this.isConnected) {
      this.socket.emit('agent:stop', agentType);
    } else {
      console.warn('WebSocket not connected. Cannot stop agent:', agentType);
    }
  }

  public configureAgent(agentType: AgentType, config: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit('agent:configure', agentType, config);
    } else {
      console.warn('WebSocket not connected. Cannot configure agent:', agentType);
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  public reconnect() {
    if (this.socket) {
      this.socket.connect();
    } else {
      this.connect();
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

// Singleton instance
export const websocketService = new WebSocketService();
export default websocketService;