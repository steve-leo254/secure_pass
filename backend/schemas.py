from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str
    name: str
    role: str

class UserCreate(BaseModel):
    username: str
    password: str
    name: str
    role: str

class User(UserBase):
    id: str

    model_config = {"from_attributes": True}

class UserResponse(BaseModel):
    id: str
    username: str
    name: str
    role: str

# Auth schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
    message: str

# Visitor schemas
class VisitorBase(BaseModel):
    full_name: str
    phone_number: str
    id_number: str
    category: str
    purpose: str
    gender: str
    unit_visited: str
    tools: List[str] = []
    custom_tools: List[str] = []

class VisitorCreate(VisitorBase):
    pass

class VisitorUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None)
    phone_number: Optional[str] = Field(default=None)
    id_number: Optional[str] = Field(default=None)
    category: Optional[str] = Field(default=None)
    purpose: Optional[str] = Field(default=None)
    gender: Optional[str] = Field(default=None)
    unit_visited: Optional[str] = Field(default=None)
    tools: Optional[List[str]] = Field(default=None)
    custom_tools: Optional[List[str]] = Field(default=None)

class Visitor(VisitorBase):
    id: str
    time_in: datetime
    time_out: Optional[datetime] = None
    status: str
    registered_by: Optional[str] = None
    checked_out_by: Optional[str] = None

    model_config = {"from_attributes": True}

# Audit Log schemas
class AuditLogBase(BaseModel):
    action: str
    details: str
    category: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    pass

class AuditLog(AuditLogBase):
    id: str
    performed_by: str
    timestamp: datetime

    model_config = {"from_attributes": True}

# Tool schemas
class ToolBase(BaseModel):
    name: str

class ToolCreate(ToolBase):
    pass

class Tool(ToolBase):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}

# Category schemas
class CategoryBase(BaseModel):
    name: str
    value: str
    color: str
    icon: str

class CategoryCreate(CategoryBase):
    is_active: bool = True

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    value: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None

class Category(CategoryBase):
    id: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}

# System Admin schemas
class SystemUserBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    status: str = "active"
    company: Optional[str] = None
    property: Optional[str] = None
    total_visitors: int = 0
    coin_balance: int = 0
    total_coins_purchased: int = 0
    total_coins_redeemed: int = 0

class SystemUserCreate(SystemUserBase):
    pass

class SystemUserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    company: Optional[str] = None
    property: Optional[str] = None
    total_visitors: Optional[int] = None
    coin_balance: Optional[int] = None
    total_coins_purchased: Optional[int] = None
    total_coins_redeemed: Optional[int] = None

class SystemUser(SystemUserBase):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}

class PackageBase(BaseModel):
    name: str
    billing: str
    price: float
    currency: str = "KES"
    coin_cost: int = 0
    max_users: int = 5
    max_visitors_per_day: int = 100
    features: List[str] = []
    is_popular: bool = False
    is_active: bool = True

class PackageCreate(PackageBase):
    pass

class PackageUpdate(BaseModel):
    name: Optional[str] = None
    billing: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    coin_cost: Optional[int] = None
    max_users: Optional[int] = None
    max_visitors_per_day: Optional[int] = None
    features: Optional[List[str]] = None
    is_popular: Optional[bool] = None
    is_active: Optional[bool] = None

class Package(PackageBase):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}

class SubscriptionBase(BaseModel):
    user_id: str
    package_id: str
    start_date: datetime
    end_date: datetime
    status: str = "active"
    auto_renew: bool = True
    amount: float

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    user_id: Optional[str] = None
    package_id: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None
    auto_renew: Optional[bool] = None
    amount: Optional[float] = None

class Subscription(SubscriptionBase):
    id: str
    created_at: datetime
    user: Optional[SystemUser] = None
    package: Optional[Package] = None

    model_config = {"from_attributes": True}

class CoinPackageBase(BaseModel):
    name: str
    coins: int
    price: float
    currency: str = "KES"
    is_active: bool = True

class CoinPackageCreate(CoinPackageBase):
    pass

class CoinPackageUpdate(BaseModel):
    name: Optional[str] = None
    coins: Optional[int] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    is_active: Optional[bool] = None

class CoinPackage(CoinPackageBase):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}

class CoinTransactionBase(BaseModel):
    user_id: str
    coin_package_id: str
    transaction_type: str
    coins: int
    amount: float

class CoinTransactionCreate(CoinTransactionBase):
    pass

class CoinTransaction(CoinTransactionBase):
    id: str
    created_at: datetime
    user: Optional[SystemUser] = None
    coin_package: Optional[CoinPackage] = None

    model_config = {"from_attributes": True}

class SubscriptionReminderBase(BaseModel):
    user_id: str
    subscription_id: str
    type: str
    message: str
    read: bool = False
    sent: bool = False

class SubscriptionReminderCreate(SubscriptionReminderBase):
    pass

class SubscriptionReminderUpdate(BaseModel):
    user_id: Optional[str] = None
    subscription_id: Optional[str] = None
    type: Optional[str] = None
    message: Optional[str] = None
    read: Optional[bool] = None
    sent: Optional[bool] = None

class SubscriptionReminder(SubscriptionReminderBase):
    id: str
    created_at: datetime
    user: Optional[SystemUser] = None
    subscription: Optional[Subscription] = None

    model_config = {"from_attributes": True}

# System schemas
class SystemSettings(BaseModel):
    tools: List[str]
    categories: List[Category]

class SystemStats(BaseModel):
    total_users: int
    active_users: int
    active_subscriptions: int
    expiring_subscriptions: int
    expired_subscriptions: int
    total_revenue: float
    monthly_revenue: float
    total_packages: int
    total_coins_in_system: int
    total_coins_redeemed: int

# Security Staff schemas
class SecurityStaffBase(BaseModel):
    name: str
    email: str
    phone: str
    employee_id: str
    department: str
    shift: str
    username: str
    status: str = "active"

class SecurityStaffCreate(SecurityStaffBase):
    password: str
    property_id: str

class SecurityStaffUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    employee_id: Optional[str] = None
    department: Optional[str] = None
    shift: Optional[str] = None
    username: Optional[str] = None
    status: Optional[str] = None

class SecurityStaff(SecurityStaffBase):
    id: str
    property_id: str
    created_at: datetime

    model_config = {"from_attributes": True}
