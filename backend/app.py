from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

try:
    from dotenv import load_dotenv
except ImportError:
    print("Warning: python-dotenv not installed. Using default email configuration.")
    def load_dotenv():
        pass

# Load environment variables
load_dotenv()
from models import User, Visitor, AuditLog, Tool, Category, SystemUser, Package, Subscription, CoinPackage, CoinTransaction, SubscriptionReminder, SecurityStaff
from schemas import (
    User as UserSchema, UserCreate, UserResponse, LoginRequest, LoginResponse,
    Visitor as VisitorSchema, VisitorCreate, VisitorUpdate,
    AuditLog as AuditLogSchema, AuditLogCreate,
    Tool as ToolSchema, ToolCreate,
    Category as CategorySchema, CategoryCreate, CategoryUpdate,
    SystemUser as SystemUserSchema, SystemUserCreate, SystemUserUpdate,
    Package as PackageSchema, PackageCreate, PackageUpdate,
    Subscription as SubscriptionSchema, SubscriptionCreate, SubscriptionUpdate,
    CoinPackage as CoinPackageSchema, CoinPackageCreate, CoinPackageUpdate,
    CoinTransaction as CoinTransactionSchema, CoinTransactionCreate,
    SubscriptionReminder as SubscriptionReminderSchema, SubscriptionReminderCreate, SubscriptionReminderUpdate,
    SystemSettings, SystemStats,
    SecurityStaff as SecurityStaffSchema, SecurityStaffCreate, SecurityStaffUpdate
)
from crud import (
    get_user_by_username, get_users, create_user,
    get_visitors, get_visitor, create_visitor, update_visitor, checkout_visitor, delete_visitor,
    get_audit_logs, create_audit_log,
    get_tools, get_tool_by_name, create_tool, delete_tool,
    get_categories, get_category, create_category, update_category, delete_category,
    # System Admin CRUD
    get_system_users, get_system_user, get_system_user_by_email, create_system_user, update_system_user, delete_system_user,
    get_packages, get_package, create_package, update_package, delete_package,
    get_subscriptions, get_subscription, get_user_subscription, create_subscription, update_subscription, extend_subscription, cancel_subscription, delete_subscription,
    get_coin_packages, get_coin_package, create_coin_package, update_coin_package, delete_coin_package,
    get_coin_transactions, get_user_coin_transactions, create_coin_transaction,
    get_subscription_reminders, get_unread_reminders, create_subscription_reminder, update_subscription_reminder, mark_reminder_read, delete_subscription_reminder,
    get_system_stats, get_expiring_subscriptions,
    hash_password,
    # Security Staff CRUD
    get_security_staff, get_security_staff_by_id, get_security_staff_by_property, get_security_staff_by_username, get_security_staff_by_email, get_security_staff_by_employee_id,
    create_security_staff, update_security_staff, delete_security_staff
)
from database import get_db, create_tables

# Email configuration
SMTP_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("MAIL_PORT", "587"))
SMTP_USERNAME = os.getenv("MAIL_USERNAME")
SMTP_PASSWORD = os.getenv("MAIL_PASSWORD")
FROM_EMAIL = os.getenv("MAIL_FROM")
MAIL_STARTTLS = os.getenv("MAIL_STARTTLS", "True").lower() == "true"
MAIL_SSL_TLS = os.getenv("MAIL_SSL_TLS", "False").lower() == "true"

def send_welcome_email(to_email: str, staff_name: str, temp_password: str, reset_link: str):
    """Send welcome email with temporary password and reset link"""
    # Check if email configuration is properly set
    if not all([SMTP_USERNAME, SMTP_PASSWORD, FROM_EMAIL]):
        print("Email configuration incomplete. Missing credentials.")
        print(f"SMTP_USERNAME: {SMTP_USERNAME}")
        print(f"SMTP_PASSWORD: {'SET' if SMTP_PASSWORD else 'NOT SET'}")
        print(f"FROM_EMAIL: {FROM_EMAIL}")
        return False
        
    try:
        # Create email message
        msg = MIMEMultipart()
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email
        msg['Subject'] = "Welcome to SecurePass - Your Account Details"
        
        body = f"""
        Dear {staff_name},
        
        Welcome to SecurePass! Your security staff account has been created.
        
        Your temporary password is: {temp_password}
        
        Please click the link below to set your permanent password:
        {reset_link}
        
        This link will expire in 24 hours.
        
        Best regards,
        SecurePass Team
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        if MAIL_STARTTLS:
            server.starttls()
        elif MAIL_SSL_TLS:
            server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        print(f"Welcome email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

app = FastAPI(title="SecurePass API", version="2.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()

# Routes
@app.get("/")
async def root():
    return {"message": "SecurePass API is running with SQLAlchemy"}

@app.get("/debug/users")
async def debug_users(db: Session = Depends(get_db)):
    """Debug endpoint to show available users and their password hashes"""
    users = get_users(db)
    return {
        "users": [
            {
                "id": user.id,
                "username": user.username, 
                "name": user.name,
                "role": user.role,
                "password_hash": user.hashed_password[:20] + "...",
                "test_passwords": {
                    "admin123": hash_password("admin123") == user.hashed_password,
                    "security123": hash_password("security123") == user.hashed_password,
                    "guard123": hash_password("guard123") == user.hashed_password
                }
            }
            for user in users
        ]
    }

@app.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Check if user exists
    user = get_user_by_username(db, request.username)
    
    # Enhanced error messages for debugging
    if not user:
        raise HTTPException(
            status_code=401, 
            detail=f"User '{request.username}' not found. Available users: admin, security, guard2"
        )
    
    # Verify password
    if user.hashed_password != hash_password(request.password):
        raise HTTPException(
            status_code=401, 
            detail=f"Invalid password for user '{request.username}'. Please check your credentials."
        )
    
    # Successful login
    return LoginResponse(
        access_token="simple_token",
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            username=user.username,
            name=user.name,
            role=user.role
        ),
        message=f"Login successful for {user.name} ({user.role})"
    )

@app.post("/security/login", response_model=LoginResponse)
async def security_login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login for security staff"""
    # Check if security staff exists
    security_staff = get_security_staff_by_username(db, request.username)
    
    if not security_staff:
        raise HTTPException(
            status_code=401, 
            detail=f"Security staff '{request.username}' not found"
        )
    
    # Check if security staff is active
    if security_staff.status != "active":
        raise HTTPException(
            status_code=401, 
            detail=f"Security staff account is {security_staff.status}"
        )
    
    # Verify password
    if security_staff.hashed_password != hash_password(request.password):
        raise HTTPException(
            status_code=401, 
            detail=f"Invalid password for security staff '{request.username}'"
        )
    
    # Successful login
    return LoginResponse(
        access_token="simple_token",
        token_type="bearer",
        user=UserResponse(
            id=security_staff.id,
            username=security_staff.username,
            name=security_staff.name,
            role="security"
        ),
        message=f"Login successful for security staff {security_staff.name}"
    )

@app.post("/system/login", response_model=LoginResponse)
async def system_login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login for system users (admin, security, property_manager) created through system admin"""
    # First check SystemUser table for users created through system admin
    system_user = get_system_user_by_email(db, request.username)
    
    if system_user:
        # For system users, we'll use email as username and check against a default password
        # In production, you should implement proper password hashing
        if request.password == "admin123":  # Default password for system users
            return LoginResponse(
                access_token="simple_token",
                token_type="bearer",
                user=UserResponse(
                    id=system_user.id,
                    username=system_user.email,  # Use email as username
                    name=system_user.name,
                    role=system_user.role
                ),
                message=f"Login successful for {system_user.name} ({system_user.role})"
            )
        else:
            raise HTTPException(
                status_code=401, 
                detail=f"Invalid password for system user '{request.username}'. Default password is 'admin123'"
            )
    
    # If not found in SystemUser, check regular User table
    user = get_user_by_username(db, request.username)
    
    if not user:
        raise HTTPException(
            status_code=401, 
            detail=f"User '{request.username}' not found in system users or regular users"
        )
    
    # Verify password for regular users
    if user.hashed_password != hash_password(request.password):
        raise HTTPException(
            status_code=401, 
            detail=f"Invalid password for user '{request.username}'."
        )
    
    # Successful login
    return LoginResponse(
        access_token="simple_token",
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            username=user.username,
            name=user.name,
            role=user.role
        ),
        message=f"Login successful for {user.name} ({user.role})"
    )

@app.post("/superadmin/register", response_model=dict)
async def register_superadmin(userData: dict, db: Session = Depends(get_db)):
    """Register a super admin account"""
    try:
        # Check if superadmin already exists
        existing_superadmin = db.query(SystemUser).filter(SystemUser.role == 'superadmin').first()
        if existing_superadmin:
            raise HTTPException(status_code=400, detail="Super admin already exists")
        
        # Create super admin with password
        password = userData.get('password', 'admin123')  # Default or provided password
        superadmin_data = SystemUserCreate(
            name=userData.get('name'),
            email=userData.get('email'),
            role='superadmin',
            status='active'
        )
        
        new_superadmin = create_system_user(db, superadmin_data)
        
        # Store password separately or update system user model to include password
        # For now, create a corresponding user record for login
        user_data = UserCreate(
            username=userData.get('email', userData.get('name')).split('@')[0],  # Use email prefix as username
            password=password,
            name=userData.get('name'),
            role='superadmin'
        )
        login_user = create_user(db, user_data)
        
        return {"message": "Super admin registered successfully", "id": new_superadmin.id, "login_id": login_user.id}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/users", response_model=dict)
async def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    # Check if username already exists
    existing_user = get_user_by_username(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Create new user
    new_user = create_user(db, user)
    return {"message": "User created successfully", "id": new_user.id}

@app.get("/staff", response_model=List[UserSchema])
async def get_staff_endpoint(db: Session = Depends(get_db)):
    """Get all staff users (excluding regular users)"""
    users = get_users(db)
    # Filter for staff roles (you may need to adjust based on your role definitions)
    staff_users = [user for user in users if user.role in ['admin', 'security', 'superadmin']]
    return staff_users

@app.get("/users/me", response_model=UserResponse)
async def get_current_user(db: Session = Depends(get_db)):
    user = get_user_by_username(db, "admin")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user.id,
        username=user.username,
        name=user.name,
        role=user.role
    )

@app.get("/visitors", response_model=List[VisitorSchema])
async def get_visitors_endpoint(db: Session = Depends(get_db)):
    visitors = get_visitors(db)
    
    # Convert JSON strings back to lists
    result = []
    for visitor in visitors:
        visitor_dict = {
            "id": visitor.id,
            "full_name": visitor.full_name,
            "phone_number": visitor.phone_number,
            "id_number": visitor.id_number,
            "category": visitor.category,
            "purpose": visitor.purpose,
            "gender": visitor.gender,
            "unit_visited": visitor.unit_visited,
            "tools": json.loads(visitor.tools) if visitor.tools else [],
            "custom_tools": json.loads(visitor.custom_tools) if visitor.custom_tools else [],
            "time_in": visitor.time_in,
            "time_out": visitor.time_out,
            "status": visitor.status,
            "registered_by": visitor.registered_by.name if visitor.registered_by else None,
            "checked_out_by": visitor.checked_out_by.name if visitor.checked_out_by else None,
        }
        result.append(visitor_dict)
    
    return result

@app.post("/visitors", response_model=dict)
async def create_visitor_endpoint(visitor_data: VisitorCreate, db: Session = Depends(get_db)):
    # Get admin user for registration
    admin_user = get_user_by_username(db, "admin")
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin user not found")
    
    # Create visitor
    visitor = create_visitor(db, visitor_data, admin_user.id)
    
    # Create audit log
    create_audit_log(
        db,
        AuditLogCreate(
            action="CHECK_IN",
            details=f"{visitor_data.full_name} checked in to {visitor_data.unit_visited}",
            category=visitor_data.category
        ),
        admin_user.id
    )
    
    return {"message": "Visitor created successfully", "id": visitor.id}

@app.put("/visitors/{visitor_id}", response_model=dict)
async def update_visitor_endpoint(visitor_id: str, visitor_data: VisitorUpdate, db: Session = Depends(get_db)):
    visitor = update_visitor(db, visitor_id, visitor_data)
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    
    return {"message": "Visitor updated successfully"}

@app.put("/visitors/{visitor_id}/checkout", response_model=dict)
async def checkout_visitor_endpoint(visitor_id: str, db: Session = Depends(get_db)):
    # Get visitor
    visitor = get_visitor(db, visitor_id)
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    
    # Get security user for checkout
    security_user = get_user_by_username(db, "security")
    if not security_user:
        raise HTTPException(status_code=404, detail="Security user not found")
    
    # Checkout visitor
    checkout_visitor(db, visitor_id, security_user.id)
    
    # Create audit log
    create_audit_log(
        db,
        AuditLogCreate(
            action="CHECK_OUT",
            details=f"{visitor.full_name} checked out from {visitor.unit_visited}",
            category=visitor.category
        ),
        security_user.id
    )
    
    return {"message": "Visitor checked out successfully"}

@app.delete("/visitors/{visitor_id}", response_model=dict)
async def delete_visitor_endpoint(visitor_id: str, db: Session = Depends(get_db)):
    visitor = delete_visitor(db, visitor_id)
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    
    return {"message": "Visitor deleted successfully"}

@app.get("/audit-logs", response_model=List[AuditLogSchema])
async def get_audit_logs_endpoint(db: Session = Depends(get_db)):
    logs = get_audit_logs(db)
    
    # Convert to response format
    result = []
    for log in logs:
        log_dict = {
            "id": log.id,
            "action": log.action,
            "performed_by": log.performed_by_user.name if log.performed_by_user else "Unknown",
            "timestamp": log.timestamp,
            "details": log.details,
            "category": log.category,
        }
        result.append(log_dict)
    
    return result

@app.post("/audit-logs", response_model=dict)
async def create_audit_log_endpoint(log_data: AuditLogCreate, db: Session = Depends(get_db)):
    # Get admin user
    admin_user = get_user_by_username(db, "admin")
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin user not found")
    
    log = create_audit_log(db, log_data, admin_user.id)
    return {"message": "Audit log created successfully", "id": log.id}

@app.get("/tools", response_model=List[ToolSchema])
async def get_tools_endpoint(db: Session = Depends(get_db)):
    tools = get_tools(db)
    return tools

@app.post("/tools", response_model=dict)
async def create_tool_endpoint(tool: ToolCreate, db: Session = Depends(get_db)):
    # Check if tool already exists
    existing_tool = get_tool_by_name(db, tool.name)
    if existing_tool:
        raise HTTPException(status_code=400, detail="Tool already exists")
    
    new_tool = create_tool(db, tool)
    return {"message": "Tool added successfully"}

@app.delete("/tools/{tool_name}", response_model=dict)
async def delete_tool_endpoint(tool_name: str, db: Session = Depends(get_db)):
    tool = delete_tool(db, tool_name)
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    return {"message": "Tool removed successfully"}

@app.get("/categories", response_model=List[CategorySchema])
async def get_categories_endpoint(db: Session = Depends(get_db)):
    categories = get_categories(db)
    return categories

@app.post("/categories", response_model=dict)
async def create_category_endpoint(category: CategoryCreate, db: Session = Depends(get_db)):
    new_category = create_category(db, category)
    return {"message": "Category added successfully", "id": new_category.id}

@app.put("/categories/{category_id}", response_model=dict)
async def update_category_endpoint(category_id: str, category: CategoryUpdate, db: Session = Depends(get_db)):
    updated_category = update_category(db, category_id, category)
    if not updated_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category updated successfully"}

@app.delete("/categories/{category_id}", response_model=dict)
async def delete_category_endpoint(category_id: str, db: Session = Depends(get_db)):
    category = delete_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category deleted successfully"}

@app.get("/settings", response_model=SystemSettings)
async def get_settings_endpoint(db: Session = Depends(get_db)):
    tools = get_tools(db)
    categories = get_categories(db)
    
    return SystemSettings(
        tools=[tool.name for tool in tools],
        categories=categories
    )

# ============ SYSTEM ADMIN ENDPOINTS ============

# System Users
@app.get("/system/users", response_model=List[SystemUserSchema])
async def get_system_users_endpoint(db: Session = Depends(get_db)):
    users = get_system_users(db)
    return users

@app.post("/system/users", response_model=dict)
async def create_system_user_endpoint(user: SystemUserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = get_system_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    new_user = create_system_user(db, user)
    return {"message": "System user created successfully", "id": new_user.id}

@app.put("/system/users/{user_id}", response_model=dict)
async def update_system_user_endpoint(user_id: str, user: SystemUserUpdate, db: Session = Depends(get_db)):
    updated_user = update_system_user(db, user_id, user)
    if not updated_user:
        raise HTTPException(status_code=404, detail="System user not found")
    
    return {"message": "System user updated successfully"}

@app.delete("/system/users/{user_id}", response_model=dict)
async def delete_system_user_endpoint(user_id: str, db: Session = Depends(get_db)):
    deleted_user = delete_system_user(db, user_id)
    if not deleted_user:
        raise HTTPException(status_code=404, detail="System user not found")
    
    return {"message": "System user deleted successfully"}

# Packages
@app.get("/system/packages", response_model=List[PackageSchema])
async def get_packages_endpoint(db: Session = Depends(get_db)):
    packages = get_packages(db)
    
    # The packages are already dictionaries from CRUD, so just return them
    return packages

@app.post("/system/packages", response_model=dict)
async def create_package_endpoint(package: PackageCreate, db: Session = Depends(get_db)):
    new_package = create_package(db, package)
    return {"message": "Package created successfully", "id": new_package.id}

@app.put("/system/packages/{package_id}", response_model=dict)
async def update_package_endpoint(package_id: str, package: PackageUpdate, db: Session = Depends(get_db)):
    updated_package = update_package(db, package_id, package)
    if not updated_package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    return {"message": "Package updated successfully"}

@app.delete("/system/packages/{package_id}", response_model=dict)
async def delete_package_endpoint(package_id: str, db: Session = Depends(get_db)):
    deleted_package = delete_package(db, package_id)
    if not deleted_package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    return {"message": "Package deleted successfully"}

# Subscriptions
@app.get("/system/subscriptions", response_model=List[SubscriptionSchema])
async def get_subscriptions_endpoint(db: Session = Depends(get_db)):
    try:
        subscriptions = get_subscriptions(db)
        return subscriptions
    except Exception as e:
        print(f"Error in get_subscriptions_endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/system/subscriptions", response_model=dict)
async def create_subscription_endpoint(subscription: SubscriptionCreate, db: Session = Depends(get_db)):
    new_subscription = create_subscription(db, subscription)
    return {"message": "Subscription created successfully", "id": new_subscription.id}

@app.put("/system/subscriptions/{subscription_id}", response_model=dict)
async def update_subscription_endpoint(subscription_id: str, subscription: SubscriptionUpdate, db: Session = Depends(get_db)):
    updated_subscription = update_subscription(db, subscription_id, subscription)
    if not updated_subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    return {"message": "Subscription updated successfully"}

@app.put("/system/subscriptions/{subscription_id}/extend", response_model=dict)
async def extend_subscription_endpoint(subscription_id: str, days: int, db: Session = Depends(get_db)):
    extended_subscription = extend_subscription(db, subscription_id, days)
    if not extended_subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    return {"message": "Subscription extended successfully"}

@app.put("/system/subscriptions/{subscription_id}/cancel", response_model=dict)
async def cancel_subscription_endpoint(subscription_id: str, db: Session = Depends(get_db)):
    cancelled_subscription = cancel_subscription(db, subscription_id)
    if not cancelled_subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    return {"message": "Subscription cancelled successfully"}

@app.delete("/system/subscriptions/{subscription_id}", response_model=dict)
async def delete_subscription_endpoint(subscription_id: str, db: Session = Depends(get_db)):
    deleted_subscription = delete_subscription(db, subscription_id)
    if not deleted_subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    return {"message": "Subscription deleted successfully"}

# Coin Packages
@app.get("/system/coin-packages", response_model=List[CoinPackageSchema])
async def get_coin_packages_endpoint(db: Session = Depends(get_db)):
    coin_packages = get_coin_packages(db)
    return coin_packages

@app.post("/system/coin-packages", response_model=dict)
async def create_coin_package_endpoint(coin_package: CoinPackageCreate, db: Session = Depends(get_db)):
    new_coin_package = create_coin_package(db, coin_package)
    return {"message": "Coin package created successfully", "id": new_coin_package.id}

@app.put("/system/coin-packages/{coin_package_id}", response_model=dict)
async def update_coin_package_endpoint(coin_package_id: str, coin_package: CoinPackageUpdate, db: Session = Depends(get_db)):
    updated_coin_package = update_coin_package(db, coin_package_id, coin_package)
    if not updated_coin_package:
        raise HTTPException(status_code=404, detail="Coin package not found")
    
    return {"message": "Coin package updated successfully"}

@app.delete("/system/coin-packages/{coin_package_id}", response_model=dict)
async def delete_coin_package_endpoint(coin_package_id: str, db: Session = Depends(get_db)):
    deleted_coin_package = delete_coin_package(db, coin_package_id)
    if not deleted_coin_package:
        raise HTTPException(status_code=404, detail="Coin package not found")
    
    return {"message": "Coin package deleted successfully"}

# Coin Transactions
@app.get("/system/coin-transactions", response_model=List[CoinTransactionSchema])
async def get_coin_transactions_endpoint(db: Session = Depends(get_db)):
    transactions = get_coin_transactions(db)
    return transactions

@app.get("/system/users/{user_id}/coin-transactions", response_model=List[CoinTransactionSchema])
async def get_user_coin_transactions_endpoint(user_id: str, db: Session = Depends(get_db)):
    transactions = get_user_coin_transactions(db, user_id)
    return transactions

@app.post("/system/coin-transactions", response_model=dict)
async def create_coin_transaction_endpoint(transaction: CoinTransactionCreate, db: Session = Depends(get_db)):
    new_transaction = create_coin_transaction(db, transaction)
    return {"message": "Coin transaction created successfully", "id": new_transaction.id}

# Subscription Reminders
@app.get("/system/reminders", response_model=List[SubscriptionReminderSchema])
async def get_reminders_endpoint(db: Session = Depends(get_db)):
    reminders = get_subscription_reminders(db)
    return reminders

@app.get("/system/reminders/unread", response_model=List[SubscriptionReminderSchema])
async def get_unread_reminders_endpoint(db: Session = Depends(get_db)):
    reminders = get_unread_reminders(db)
    return reminders

@app.post("/system/reminders", response_model=dict)
async def create_reminder_endpoint(reminder: SubscriptionReminderCreate, db: Session = Depends(get_db)):
    new_reminder = create_subscription_reminder(db, reminder)
    return {"message": "Reminder created successfully", "id": new_reminder.id}

@app.put("/system/reminders/{reminder_id}/read", response_model=dict)
async def mark_reminder_read_endpoint(reminder_id: str, db: Session = Depends(get_db)):
    marked_reminder = mark_reminder_read(db, reminder_id)
    if not marked_reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    
    return {"message": "Reminder marked as read"}

@app.delete("/system/reminders/{reminder_id}", response_model=dict)
async def delete_reminder_endpoint(reminder_id: str, db: Session = Depends(get_db)):
    deleted_reminder = delete_subscription_reminder(db, reminder_id)
    if not deleted_reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    
    return {"message": "Reminder deleted successfully"}

# System Stats
@app.get("/system/stats", response_model=SystemStats)
async def get_system_stats_endpoint(db: Session = Depends(get_db)):
    stats = get_system_stats(db)
    return SystemStats(**stats)

@app.get("/system/expiring-subscriptions", response_model=List[SubscriptionSchema])
async def get_expiring_subscriptions_endpoint(days: int = 7, db: Session = Depends(get_db)):
    expiring_subscriptions = get_expiring_subscriptions(db, days)
    return expiring_subscriptions

# ============ SECURITY STAFF ENDPOINTS ============

@app.get("/security-staff", response_model=List[SecurityStaffSchema])
async def get_security_staff_endpoint(db: Session = Depends(get_db)):
    """Get all security staff"""
    staff = get_security_staff(db)
    return staff

@app.get("/security-staff/property/{property_id}", response_model=List[SecurityStaffSchema])
async def get_security_staff_by_property_endpoint(property_id: str, db: Session = Depends(get_db)):
    """Get security staff by property"""
    staff = get_security_staff_by_property(db, property_id)
    return staff

@app.get("/security-staff/{staff_id}", response_model=SecurityStaffSchema)
async def get_security_staff_by_id_endpoint(staff_id: str, db: Session = Depends(get_db)):
    """Get security staff by ID"""
    staff = get_security_staff_by_id(db, staff_id)
    if not staff:
        raise HTTPException(status_code=404, detail="Security staff not found")
    return staff

@app.post("/security-staff", response_model=dict)
async def create_security_staff_endpoint(staff_data: SecurityStaffCreate, db: Session = Depends(get_db)):
    """Register new security staff"""
    # Check if username already exists
    existing_username = get_security_staff_by_username(db, staff_data.username)
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Check if email already exists
    existing_email = get_security_staff_by_email(db, staff_data.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Check if employee ID already exists
    existing_employee_id = get_security_staff_by_employee_id(db, staff_data.employee_id)
    if existing_employee_id:
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    
    # Validate property_id if provided
    if staff_data.property_id:
        from crud import get_system_user
        property_user = get_system_user(db, staff_data.property_id)
        if not property_user:
            raise HTTPException(status_code=400, detail=f"Property ID '{staff_data.property_id}' not found")
    
    # Create security staff
    result = create_security_staff(db, staff_data)
    new_staff = result["staff"]
    temp_password = result["temp_password"]
    
    # Send welcome email with temporary password and reset link
    reset_link = f"http://localhost:5173/reset-password?token={new_staff.id}&email={new_staff.email}"
    email_sent = send_welcome_email(new_staff.email, new_staff.name, temp_password, reset_link)
    
    return {
        "message": "Security staff registered successfully", 
        "id": new_staff.id,
        "temp_password": temp_password if not email_sent else "Email sent",
        "reset_link": reset_link,
        "email_sent": email_sent
    }

@app.put("/security-staff/{staff_id}", response_model=dict)
async def update_security_staff_endpoint(staff_id: str, staff_data: SecurityStaffUpdate, db: Session = Depends(get_db)):
    """Update security staff"""
    updated_staff = update_security_staff(db, staff_id, staff_data)
    if not updated_staff:
        raise HTTPException(status_code=404, detail="Security staff not found")
    
    return {"message": "Security staff updated successfully"}

@app.delete("/security-staff/{staff_id}", response_model=dict)
async def delete_security_staff_endpoint(staff_id: str, db: Session = Depends(get_db)):
    """Delete security staff"""
    deleted_staff = delete_security_staff(db, staff_id)
    if not deleted_staff:
        raise HTTPException(status_code=404, detail="Security staff not found")
    
    return {"message": "Security staff deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
