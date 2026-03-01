from pydantic import BaseModel
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
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    id_number: Optional[str] = None
    category: Optional[str] = None
    purpose: Optional[str] = None
    gender: Optional[str] = None
    unit_visited: Optional[str] = None
    tools: Optional[List[str]] = None
    custom_tools: Optional[List[str]] = None

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

# System schemas
class SystemSettings(BaseModel):
    tools: List[str]
    categories: List[Category]
