from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str
    name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    name: str
    role: str

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
    message: str

# System Admin schemas - simplified for Pydantic v2
class SystemUserBase(BaseModel):
    name: str
    email: str
    phone: str
    role: str
    status: str
    company: str
    property: str

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

class SystemUser(SystemUserBase):
    id: str
    total_visitors: int
    coin_balance: int
    total_coins_purchased: int
    total_coins_redeemed: int
    created_at: datetime

class PackageBase(BaseModel):
    name: str
    billing: str
    price: float
    currency: str
    coin_cost: int
    max_users: int
    max_visitors_per_day: int
    features: List[str]
    is_popular: bool
    is_active: bool

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

class SubscriptionBase(BaseModel):
    user_id: str
    package_id: str
    start_date: str
    end_date: str
    status: str
    auto_renew: bool
    amount: float

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    user_id: Optional[str] = None
    package_id: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: Optional[str] = None
    auto_renew: Optional[bool] = None
    amount: Optional[float] = None

class Subscription(SubscriptionBase):
    id: str
    created_at: datetime

class CoinPackageBase(BaseModel):
    name: str
    coins: int
    price: float
    currency: str
    is_active: bool

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

class SubscriptionReminderBase(BaseModel):
    user_id: str
    subscription_id: str
    type: str
    message: str
    read: bool
    sent: bool

class SubscriptionReminderCreate(SubscriptionReminderBase):
    pass

class SubscriptionReminder(SubscriptionReminderBase):
    id: str
    created_at: datetime

class SystemStats(BaseModel):
    total_users: int
    active_users: int
    total_subscriptions: int
    active_subscriptions: int
    expiring_subscriptions: int
    expired_subscriptions: int
    total_revenue: float
    monthly_revenue: float
    total_packages: int
    total_coins_in_system: int
    total_coins_redeemed: int
