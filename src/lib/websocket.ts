import { env } from "~/env";

export interface WebSocketMessage {
  type: string;
  data: any;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  constructor(
    private userEmail: string,
    private accessToken: string,
  ) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl =
          env.NEXT_PUBLIC_BACKEND_URL?.replace("http", "ws") ||
          "ws://localhost:3001";
        const url = `${wsUrl}/ws?email=${encodeURIComponent(this.userEmail)}&token=${encodeURIComponent(this.accessToken)}`;

        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log("WebSocket connected");
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };

        this.ws.onclose = () => {
          console.log("WebSocket disconnected");
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(message: WebSocketMessage) {
    const listeners = this.listeners.get(message.type) || [];
    listeners.forEach((listener) => listener(message.data));
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );

      setTimeout(() => {
        this.connect().catch(console.error);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  subscribe(channel: string, callback: (data: any) => void) {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, []);
    }
    this.listeners.get(channel)!.push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(channel);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }
}

// Redis pub/sub service for summaries
export class SummariesWebSocketService {
  private wsService: WebSocketService | null = null;

  async connect(
    userEmail: string,
    accessToken: string,
  ): Promise<WebSocketService> {
    this.wsService = new WebSocketService(userEmail, accessToken);
    await this.wsService.connect();
    return this.wsService;
  }

  subscribeToSummaries(userEmail: string, callback: (summary: string) => void) {
    if (!this.wsService) {
      throw new Error("WebSocket service not connected");
    }

    // Subscribe to the user-specific summaries channel
    // Format: userEmail:summaries (e.g., user@example.com:summaries)
    const channel = `${userEmail}:summaries`;
    return this.wsService.subscribe(channel, callback);
  }

  disconnect() {
    if (this.wsService) {
      this.wsService.disconnect();
      this.wsService = null;
    }
  }
}

export const summariesWS = new SummariesWebSocketService();
