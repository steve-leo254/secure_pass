const API_BASE_URL = 'http://localhost:8000';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    username: string;
    name: string;
    role: string;
  };
}

export interface Visitor {
  id: string;
  full_name: string;
  phone_number: string;
  id_number: string;
  category: string;
  purpose: string;
  gender: string;
  unit_visited: string;
  tools: string[];
  custom_tools: string[];
  time_in: string;
  time_out: string | null;
  status: string;
  registered_by: string;
  checked_out_by: string | null;
}

export interface SystemSettings {
  property_name: string;
  property_address: string;
  categories: string[];
  tools: string[];
}

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    return response.json();
  }

  async getVisitors(): Promise<Visitor[]> {
    const response = await this.request('/visitors');
    return response.json();
  }

  async createVisitor(visitorData: Partial<Visitor>): Promise<{ message: string; id: string }> {
    const response = await this.request('/visitors', {
      method: 'POST',
      body: JSON.stringify(visitorData),
    });

    return response.json();
  }

  async checkoutVisitor(visitorId: string): Promise<{ message: string }> {
    const response = await this.request(`/visitors/${visitorId}/checkout`, {
      method: 'PUT',
    });

    return response.json();
  }

  async getSettings(): Promise<SystemSettings> {
    const response = await this.request('/settings');
    return response.json();
  }

  async getCurrentUser(): Promise<{ id: string; username: string; name: string; role: string }> {
    const response = await this.request('/users/me');
    return response.json();
  }
}

export const apiService = new ApiService();
