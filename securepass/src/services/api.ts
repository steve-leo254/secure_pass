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

export interface VisitorUpdate {
  full_name?: string;
  phone_number?: string;
  id_number?: string;
  category?: string;
  purpose?: string;
  gender?: string;
  unit_visited?: string;
  tools?: string[];
  custom_tools?: string[];
}

export interface AuditLog {
  id: string;
  action: string;
  performed_by: string;
  timestamp: string;
  details: string;
  category?: string;
}

export interface AuditLogCreate {
  action: string;
  performed_by: string;
  details: string;
  category?: string;
}

export interface Tool {
  name: string;
}

export interface Category {
  id: string;
  name: string;
  value: string;
  color: string;
  icon: string;
  is_active: boolean;
}

export interface CategoryCreate {
  name: string;
  value: string;
  color: string;
  icon: string;
  is_active: boolean;
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

  async updateVisitor(visitorId: string, visitorData: VisitorUpdate): Promise<{ message: string }> {
    const response = await this.request(`/visitors/${visitorId}`, {
      method: 'PUT',
      body: JSON.stringify(visitorData),
    });

    return response.json();
  }

  async deleteVisitor(visitorId: string): Promise<{ message: string }> {
    const response = await this.request(`/visitors/${visitorId}`, {
      method: 'DELETE',
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

  // ===== NEW HIGH-PRIORITY ENDPOINTS =====

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    const response = await this.request('/audit-logs');
    return response.json();
  }

  async createAuditLog(logData: AuditLogCreate): Promise<{ message: string; id: string }> {
    const response = await this.request('/audit-logs', {
      method: 'POST',
      body: JSON.stringify(logData),
    });

    return response.json();
  }

  // Tools Management
  async getTools(): Promise<Tool[]> {
    const response = await this.request('/tools');
    return response.json();
  }

  async addTool(tool: { name: string }): Promise<{ message: string }> {
    const response = await this.request('/tools', {
      method: 'POST',
      body: JSON.stringify(tool),
    });

    return response.json();
  }

  async removeTool(toolName: string): Promise<{ message: string }> {
    const response = await this.request(`/tools/${toolName}`, {
      method: 'DELETE',
    });

    return response.json();
  }

  // Categories Management
  async getCategories(): Promise<Category[]> {
    const response = await this.request('/categories');
    return response.json();
  }

  async addCategory(category: CategoryCreate): Promise<{ message: string; id: string }> {
    const response = await this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });

    return response.json();
  }

  async updateCategory(categoryId: string, category: CategoryCreate): Promise<{ message: string }> {
    const response = await this.request(`/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });

    return response.json();
  }

  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    const response = await this.request(`/categories/${categoryId}`, {
      method: 'DELETE',
    });

    return response.json();
  }
}

export const apiService = new ApiService();
