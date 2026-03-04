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

// System Admin Interfaces
export interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  company?: string;
  property?: string;
  total_visitors: number;
  coin_balance: number;
  total_coins_purchased: number;
  total_coins_redeemed: number;
  created_at: string;
}

export interface UserCreate {
  username: string;
  password: string;
  name: string;
  role: string;
}

export interface SystemUserCreate {
  name: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
  company?: string;
  property?: string;
  total_visitors?: number;
  coin_balance?: number;
  total_coins_purchased?: number;
  total_coins_redeemed?: number;
}

export interface SystemUserUpdate {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  company?: string;
  property?: string;
  total_visitors?: number;
  coin_balance?: number;
  total_coins_purchased?: number;
  total_coins_redeemed?: number;
}

export interface Package {
  id: string;
  name: string;
  billing: string;
  price: number;
  currency: string;
  coin_cost: number;
  max_users: number;
  max_visitors_per_day: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
}

export interface PackageCreate {
  name: string;
  billing: string;
  price: number;
  currency?: string;
  coin_cost?: number;
  max_users?: number;
  max_visitors_per_day?: number;
  features?: string[];
  is_popular?: boolean;
  is_active?: boolean;
}

export interface PackageUpdate {
  name?: string;
  billing?: string;
  price?: number;
  currency?: string;
  coin_cost?: number;
  max_users?: number;
  max_visitors_per_day?: number;
  features?: string[];
  is_popular?: boolean;
  is_active?: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  package_id: string;
  start_date: string;
  end_date: string;
  status: string;
  auto_renew: boolean;
  amount: number;
  created_at: string;
  user?: SystemUser;
  package?: Package;
}

export interface SubscriptionCreate {
  user_id: string;
  package_id: string;
  start_date: string;
  end_date: string;
  status?: string;
  auto_renew?: boolean;
  amount: number;
}

export interface SubscriptionUpdate {
  user_id?: string;
  package_id?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  auto_renew?: boolean;
  amount?: number;
}

export interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number;
  currency: string;
  is_active: boolean;
  created_at: string;
}

export interface CoinPackageCreate {
  name: string;
  coins: number;
  price: number;
  currency?: string;
  is_active?: boolean;
}

export interface CoinPackageUpdate {
  name?: string;
  coins?: number;
  price?: number;
  currency?: string;
  is_active?: boolean;
}

export interface CoinTransaction {
  id: string;
  user_id: string;
  coin_package_id: string;
  transaction_type: string;
  coins: number;
  amount: number;
  created_at: string;
  user?: SystemUser;
  coin_package?: CoinPackage;
}

export interface CoinTransactionCreate {
  user_id: string;
  coin_package_id: string;
  transaction_type: string;
  coins: number;
  amount: number;
}

export interface SubscriptionReminder {
  id: string;
  user_id: string;
  subscription_id: string;
  type: string;
  message: string;
  read: boolean;
  sent: boolean;
  created_at: string;
  user?: SystemUser;
  subscription?: Subscription;
}

export interface SubscriptionReminderCreate {
  user_id: string;
  subscription_id: string;
  type: string;
  message: string;
  read?: boolean;
  sent?: boolean;
}

export interface SubscriptionReminderUpdate {
  user_id?: string;
  subscription_id?: string;
  type?: string;
  message?: string;
  read?: boolean;
  sent?: boolean;
}

export interface SystemStats {
  total_users: number;
  active_users: number;
  active_subscriptions: number;
  expiring_subscriptions: number;
  expired_subscriptions: number;
  total_revenue: number;
  monthly_revenue: number;
  total_packages: number;
  total_coins_in_system: number;
  total_coins_redeemed: number;
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
    
    // Get token from localStorage (where it's stored by AuthContext)
    const token = localStorage.getItem('access_token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      headers,
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

  async createUser(userData: UserCreate): Promise<{ message: string; id: string }> {
    const response = await this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    return response.json();
  }

  async registerSuperAdmin(userData: { name: string; email: string; password?: string }): Promise<{ message: string; id: string }> {
    const response = await this.request('/superadmin/register', {
      method: 'POST',
      body: JSON.stringify(userData),
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

  // ===== SYSTEM ADMIN ENDPOINTS =====

  // System Users
  async getSystemUsers(): Promise<SystemUser[]> {
    const response = await this.request('/system/users');
    return response.json();
  }

  async createSystemUser(userData: SystemUserCreate): Promise<{ message: string; id: string }> {
    const response = await this.request('/system/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    return response.json();
  }

  async updateSystemUser(userId: string, userData: SystemUserUpdate): Promise<{ message: string }> {
    const response = await this.request(`/system/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    return response.json();
  }

  async deleteSystemUser(userId: string): Promise<{ message: string }> {
    const response = await this.request(`/system/users/${userId}`, {
      method: 'DELETE',
    });

    return response.json();
  }

  // Packages
  async getPackages(): Promise<Package[]> {
    const response = await this.request('/system/packages');
    return response.json();
  }

  async createPackage(packageData: PackageCreate): Promise<{ message: string; id: string }> {
    const response = await this.request('/system/packages', {
      method: 'POST',
      body: JSON.stringify(packageData),
    });

    return response.json();
  }

  async updatePackage(packageId: string, packageData: PackageUpdate): Promise<{ message: string }> {
    const response = await this.request(`/system/packages/${packageId}`, {
      method: 'PUT',
      body: JSON.stringify(packageData),
    });

    return response.json();
  }

  async deletePackage(packageId: string): Promise<{ message: string }> {
    const response = await this.request(`/system/packages/${packageId}`, {
      method: 'DELETE',
    });

    return response.json();
  }

  // Subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    const response = await this.request('/system/subscriptions');
    return response.json();
  }

  async createSubscription(subscriptionData: SubscriptionCreate): Promise<{ message: string; id: string }> {
    const response = await this.request('/system/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });

    return response.json();
  }

  async updateSubscription(subscriptionId: string, subscriptionData: SubscriptionUpdate): Promise<{ message: string }> {
    const response = await this.request(`/system/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      body: JSON.stringify(subscriptionData),
    });

    return response.json();
  }

  async extendSubscription(subscriptionId: string, days: number): Promise<{ message: string }> {
    const response = await this.request(`/system/subscriptions/${subscriptionId}/extend?days=${days}`, {
      method: 'PUT',
    });

    return response.json();
  }

  async cancelSubscription(subscriptionId: string): Promise<{ message: string }> {
    const response = await this.request(`/system/subscriptions/${subscriptionId}/cancel`, {
      method: 'PUT',
    });

    return response.json();
  }

  async deleteSubscription(subscriptionId: string): Promise<{ message: string }> {
    const response = await this.request(`/system/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
    });

    return response.json();
  }

  // Reminders
  async getReminders(): Promise<SubscriptionReminder[]> {
    const response = await this.request('/system/reminders');
    return response.json();
  }

  async createReminder(reminderData: SubscriptionReminderCreate): Promise<{ message: string; id: string }> {
    const response = await this.request('/system/reminders', {
      method: 'POST',
      body: JSON.stringify(reminderData),
    });

    return response.json();
  }

  async markReminderRead(reminderId: string): Promise<{ message: string }> {
    const response = await this.request(`/system/reminders/${reminderId}/read`, {
      method: 'PUT',
    });

    return response.json();
  }

  async deleteReminder(reminderId: string): Promise<{ message: string }> {
    const response = await this.request(`/system/reminders/${reminderId}`, {
      method: 'DELETE',
    });

    return response.json();
  }

  async getSystemStats(): Promise<SystemStats> {
    const response = await this.request('/system/stats');
    return response.json();
  }
}

// Export a singleton instance of the API service
export const apiService = new ApiService();
