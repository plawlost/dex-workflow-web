import { env } from "~/env";

export interface BackendUser {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ConnectionResponse {
  authUrl: string;
}

class BackendAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {      
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Auth endpoints
  async signup(email: string, password: string, name: string): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile(accessToken: string) {
    return this.request("/auth/me", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });
  }

  // Connection endpoints - these now use Authorization headers
  async getSlackConnection(accessToken: string): Promise<{ authUrl?: string }> {
    return this.request("/auth/slack", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });
  }

  async getGmailConnection(accessToken: string): Promise<{ authUrl?: string }> {
    return this.request("/auth/gmail/connect", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });
  }

  async getNotionConnection(accessToken: string): Promise<{ authUrl?: string }> {
    return this.request("/auth/notion", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });
  }

  // Disconnect endpoints - these use Authorization headers
  async disconnectSlack(accessToken: string, workspaceId?: string): Promise<void> {
    return this.request("/auth/slack/remove", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(workspaceId ? { workspaceId } : {}),
    });
  }

  async disconnectGmail(accessToken: string): Promise<void> {
    return this.request("/auth/gmail/remove", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({}),
    });
  }

  async disconnectNotion(accessToken: string, workspaceId?: string): Promise<void> {
    return this.request("/auth/notion/remove", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(workspaceId ? { workspaceId } : {}),
    });
  }
}

export const backendAPI = new BackendAPI();