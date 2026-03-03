from sqlalchemy.orm import Session
from sqlalchemy import and_
from models import (
    User, Visitor, AuditLog, Tool, Category,
    SystemUser, Package, Subscription, CoinPackage, CoinTransaction, SubscriptionReminder
)
from schemas import (
    User as UserSchema, UserCreate, UserResponse, LoginRequest, LoginResponse,
    Visitor as VisitorSchema, VisitorCreate, VisitorUpdate,
    SystemUser as SystemUserSchema, SystemUserCreate, SystemUserUpdate,
    Package as PackageSchema, PackageCreate, PackageUpdate,
    Subscription as SubscriptionSchema, SubscriptionCreate, SubscriptionUpdate,
    CoinPackage as CoinPackageSchema, CoinPackageCreate, CoinPackageUpdate,
    CoinTransaction as CoinTransactionSchema, CoinTransactionCreate,
    SubscriptionReminder as SubscriptionReminderSchema, SubscriptionReminderCreate, SubscriptionReminderUpdate,
    AuditLogCreate, ToolCreate, CategoryCreate, CategoryUpdate, SystemStats
)
from datetime import datetime, timedelta
import json
import hashlib

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

# User CRUD
def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    hashed_password = hash_password(user.password)
    db_user = User(
        username=user.username,
        hashed_password=hashed_password,
        name=user.name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Visitor CRUD
def get_visitors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Visitor).offset(skip).limit(limit).all()

def get_visitor(db: Session, visitor_id: str):
    return db.query(Visitor).filter(Visitor.id == visitor_id).first()

def create_visitor(db: Session, visitor: VisitorCreate, registered_by_id: str):
    db_visitor = Visitor(
        full_name=visitor.full_name,
        phone_number=visitor.phone_number,
        id_number=visitor.id_number,
        category=visitor.category,
        purpose=visitor.purpose,
        gender=visitor.gender,
        unit_visited=visitor.unit_visited,
        tools=json.dumps(visitor.tools),
        custom_tools=json.dumps(visitor.custom_tools),
        registered_by_id=registered_by_id
    )
    db.add(db_visitor)
    db.commit()
    db.refresh(db_visitor)
    return db_visitor

def update_visitor(db: Session, visitor_id: str, visitor: VisitorUpdate):
    db_visitor = db.query(Visitor).filter(Visitor.id == visitor_id).first()
    if db_visitor:
        update_data = visitor.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field in ['tools', 'custom_tools']:
                setattr(db_visitor, field, json.dumps(value))
            else:
                setattr(db_visitor, field, value)
        db.commit()
        db.refresh(db_visitor)
    return db_visitor

def checkout_visitor(db: Session, visitor_id: str, checked_out_by_id: str):
    db_visitor = db.query(Visitor).filter(Visitor.id == visitor_id).first()
    if db_visitor:
        db_visitor.time_out = datetime.utcnow()
        db_visitor.status = "checked-out"
        db_visitor.checked_out_by_id = checked_out_by_id
        db.commit()
        db.refresh(db_visitor)
    return db_visitor

def delete_visitor(db: Session, visitor_id: str):
    db_visitor = db.query(Visitor).filter(Visitor.id == visitor_id).first()
    if db_visitor:
        db.delete(db_visitor)
        db.commit()
    return db_visitor

# Audit Log CRUD
def get_audit_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()

def create_audit_log(db: Session, audit_log: AuditLogCreate, performed_by_id: str):
    db_audit_log = AuditLog(
        action=audit_log.action,
        performed_by_id=performed_by_id,
        details=audit_log.details,
        category=audit_log.category
    )
    db.add(db_audit_log)
    db.commit()
    db.refresh(db_audit_log)
    return db_audit_log

# Tool CRUD
def get_tools(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Tool).offset(skip).limit(limit).all()

def get_tool_by_name(db: Session, name: str):
    return db.query(Tool).filter(Tool.name == name).first()

def create_tool(db: Session, tool: ToolCreate):
    db_tool = Tool(name=tool.name)
    db.add(db_tool)
    db.commit()
    db.refresh(db_tool)
    return db_tool

def delete_tool(db: Session, name: str):
    db_tool = db.query(Tool).filter(Tool.name == name).first()
    if db_tool:
        db.delete(db_tool)
        db.commit()
    return db_tool

# Category CRUD
def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Category).offset(skip).limit(limit).all()

def get_category(db: Session, category_id: str):
    return db.query(Category).filter(Category.id == category_id).first()

def create_category(db: Session, category: CategoryCreate):
    db_category = Category(
        name=category.name,
        value=category.value,
        color=category.color,
        icon=category.icon,
        is_active=category.is_active
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: str, category: CategoryUpdate):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category:
        update_data = category.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_category, field, value)
        db.commit()
        db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: str):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category:
        db.delete(db_category)
        db.commit()
    return db_category

# System Admin CRUD

# System User CRUD
def get_system_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(SystemUser).offset(skip).limit(limit).all()

def get_system_user(db: Session, user_id: str):
    return db.query(SystemUser).filter(SystemUser.id == user_id).first()

def get_system_user_by_email(db: Session, email: str):
    return db.query(SystemUser).filter(SystemUser.email == email).first()

def create_system_user(db: Session, user: SystemUserCreate):
    db_user = SystemUser(
        name=user.name,
        email=user.email,
        phone=user.phone,
        role=user.role,
        status=user.status,
        company=user.company,
        property=user.property,
        total_visitors=user.total_visitors,
        coin_balance=user.coin_balance,
        total_coins_purchased=user.total_coins_purchased,
        total_coins_redeemed=user.total_coins_redeemed
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_system_user(db: Session, user_id: str, user: SystemUserUpdate):
    db_user = db.query(SystemUser).filter(SystemUser.id == user_id).first()
    if db_user:
        update_data = user.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_system_user(db: Session, user_id: str):
    db_user = db.query(SystemUser).filter(SystemUser.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

# Package CRUD
def get_packages(db: Session, skip: int = 0, limit: int = 100):
    packages = db.query(Package).filter(Package.is_active == True).offset(skip).limit(limit).all()
    
    # Convert to dict and handle JSON conversion for features
    result = []
    for package in packages:
        package_dict = {
            'id': package.id,
            'name': package.name,
            'billing': package.billing,
            'price': package.price,
            'currency': package.currency,
            'coin_cost': package.coin_cost,
            'max_users': package.max_users,
            'max_visitors_per_day': package.max_visitors_per_day,
            'features': package.features_list,  # Use the property
            'is_popular': package.is_popular,
            'is_active': package.is_active,
            'created_at': package.created_at
        }
        result.append(package_dict)
    
    return result

def get_package(db: Session, package_id: str):
    return db.query(Package).filter(Package.id == package_id).first()

def create_package(db: Session, package: PackageCreate):
    db_package = Package(
        name=package.name,
        billing=package.billing,
        price=package.price,
        currency=package.currency,
        coin_cost=package.coin_cost,
        max_users=package.max_users,
        max_visitors_per_day=package.max_visitors_per_day,
        features=json.dumps(package.features),
        is_popular=package.is_popular,
        is_active=package.is_active
    )
    db.add(db_package)
    db.commit()
    db.refresh(db_package)
    return db_package

def update_package(db: Session, package_id: str, package: PackageUpdate):
    db_package = db.query(Package).filter(Package.id == package_id).first()
    if db_package:
        update_data = package.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == 'features':
                setattr(db_package, field, json.dumps(value))
            else:
                setattr(db_package, field, value)
        db.commit()
        db.refresh(db_package)
    return db_package

def delete_package(db: Session, package_id: str):
    db_package = db.query(Package).filter(Package.id == package_id).first()
    if db_package:
        db.delete(db_package)
        db.commit()
    return db_package

# Subscription CRUD
def get_subscriptions(db: Session, skip: int = 0, limit: int = 100):
    subscriptions = db.query(Subscription).offset(skip).limit(limit).all()
    
    # Convert to dict and handle JSON conversion
    result = []
    for sub in subscriptions:
        sub_dict = {
            'id': sub.id,
            'user_id': sub.user_id,
            'package_id': sub.package_id,
            'start_date': sub.start_date,
            'end_date': sub.end_date,
            'status': sub.status,
            'auto_renew': sub.auto_renew,
            'amount': sub.amount,
            'created_at': sub.created_at
        }
        result.append(sub_dict)
    
    return result

def get_subscription(db: Session, subscription_id: str):
    return db.query(Subscription).filter(Subscription.id == subscription_id).first()

def get_user_subscription(db: Session, user_id: str):
    return db.query(Subscription).filter(Subscription.user_id == user_id).first()

def create_subscription(db: Session, subscription: SubscriptionCreate):
    db_subscription = Subscription(
        user_id=subscription.user_id,
        package_id=subscription.package_id,
        start_date=subscription.start_date,
        end_date=subscription.end_date,
        status=subscription.status,
        auto_renew=subscription.auto_renew,
        amount=subscription.amount
    )
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription

def update_subscription(db: Session, subscription_id: str, subscription: SubscriptionUpdate):
    db_subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if db_subscription:
        update_data = subscription.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_subscription, field, value)
        db.commit()
        db.refresh(db_subscription)
    return db_subscription

def extend_subscription(db: Session, subscription_id: str, days: int):
    db_subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if db_subscription:
        db_subscription.end_date = db_subscription.end_date + timedelta(days=days)
        db_subscription.status = "active"
        db.commit()
        db.refresh(db_subscription)
    return db_subscription

def cancel_subscription(db: Session, subscription_id: str):
    db_subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if db_subscription:
        db_subscription.status = "cancelled"
        db.commit()
        db.refresh(db_subscription)
    return db_subscription

def delete_subscription(db: Session, subscription_id: str):
    db_subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if db_subscription:
        db.delete(db_subscription)
        db.commit()
    return db_subscription

# Coin Package CRUD
def get_coin_packages(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CoinPackage).filter(CoinPackage.is_active == True).offset(skip).limit(limit).all()

def get_coin_package(db: Session, coin_package_id: str):
    return db.query(CoinPackage).filter(CoinPackage.id == coin_package_id).first()

def create_coin_package(db: Session, coin_package: CoinPackageCreate):
    db_coin_package = CoinPackage(
        name=coin_package.name,
        coins=coin_package.coins,
        price=coin_package.price,
        currency=coin_package.currency,
        is_active=coin_package.is_active
    )
    db.add(db_coin_package)
    db.commit()
    db.refresh(db_coin_package)
    return db_coin_package

def update_coin_package(db: Session, coin_package_id: str, coin_package: CoinPackageUpdate):
    db_coin_package = db.query(CoinPackage).filter(CoinPackage.id == coin_package_id).first()
    if db_coin_package:
        update_data = coin_package.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_coin_package, field, value)
        db.commit()
        db.refresh(db_coin_package)
    return db_coin_package

def delete_coin_package(db: Session, coin_package_id: str):
    db_coin_package = db.query(CoinPackage).filter(CoinPackage.id == coin_package_id).first()
    if db_coin_package:
        db.delete(db_coin_package)
        db.commit()
    return db_coin_package

# Coin Transaction CRUD
def get_coin_transactions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CoinTransaction).order_by(CoinTransaction.created_at.desc()).offset(skip).limit(limit).all()

def get_user_coin_transactions(db: Session, user_id: str):
    return db.query(CoinTransaction).filter(CoinTransaction.user_id == user_id).order_by(CoinTransaction.created_at.desc()).all()

def create_coin_transaction(db: Session, transaction: CoinTransactionCreate):
    db_transaction = CoinTransaction(
        user_id=transaction.user_id,
        coin_package_id=transaction.coin_package_id,
        transaction_type=transaction.transaction_type,
        coins=transaction.coins,
        amount=transaction.amount
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# Subscription Reminder CRUD
def get_subscription_reminders(db: Session, skip: int = 0, limit: int = 100):
    reminders = db.query(SubscriptionReminder).order_by(SubscriptionReminder.created_at.desc()).offset(skip).limit(limit).all()
    
    # Convert to dict to avoid serialization issues
    result = []
    for reminder in reminders:
        reminder_dict = {
            'id': reminder.id,
            'user_id': reminder.user_id,
            'subscription_id': reminder.subscription_id,
            'type': reminder.type,
            'message': reminder.message,
            'read': reminder.read,
            'sent': reminder.sent,
            'created_at': reminder.created_at
        }
        result.append(reminder_dict)
    
    return result

def get_unread_reminders(db: Session):
    return db.query(SubscriptionReminder).filter(SubscriptionReminder.read == False).order_by(SubscriptionReminder.created_at.desc()).all()

def create_subscription_reminder(db: Session, reminder: SubscriptionReminderCreate):
    db_reminder = SubscriptionReminder(
        user_id=reminder.user_id,
        subscription_id=reminder.subscription_id,
        type=reminder.type,
        message=reminder.message,
        read=reminder.read,
        sent=reminder.sent
    )
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder

def update_subscription_reminder(db: Session, reminder_id: str, reminder: SubscriptionReminderUpdate):
    db_reminder = db.query(SubscriptionReminder).filter(SubscriptionReminder.id == reminder_id).first()
    if db_reminder:
        update_data = reminder.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_reminder, field, value)
        db.commit()
        db.refresh(db_reminder)
    return db_reminder

def mark_reminder_read(db: Session, reminder_id: str):
    db_reminder = db.query(SubscriptionReminder).filter(SubscriptionReminder.id == reminder_id).first()
    if db_reminder:
        db_reminder.read = True
        db.commit()
        db.refresh(db_reminder)
    return db_reminder

def delete_subscription_reminder(db: Session, reminder_id: str):
    db_reminder = db.query(SubscriptionReminder).filter(SubscriptionReminder.id == reminder_id).first()
    if db_reminder:
        db.delete(db_reminder)
        db.commit()
    return db_reminder

# System Stats
def get_system_stats(db: Session):
    total_users = db.query(SystemUser).count()
    active_users = db.query(SystemUser).filter(SystemUser.status == "active").count()
    active_subscriptions = db.query(Subscription).filter(Subscription.status == "active").count()
    
    # Expiring subscriptions (within 7 days)
    seven_days_from_now = datetime.utcnow() + timedelta(days=7)
    expiring_subscriptions = db.query(Subscription).filter(
        and_(
            Subscription.end_date <= seven_days_from_now,
            Subscription.end_date > datetime.utcnow(),
            Subscription.status == "active"
        )
    ).count()
    
    expired_subscriptions = db.query(Subscription).filter(
        and_(
            Subscription.end_date <= datetime.utcnow(),
            Subscription.status == "active"
        )
    ).count()
    
    # Update expired subscriptions
    db.query(Subscription).filter(
        and_(
            Subscription.end_date <= datetime.utcnow(),
            Subscription.status == "active"
        )
    ).update({"status": "expired"})
    db.commit()
    
    total_revenue = db.query(Subscription).filter(Subscription.status != "cancelled").with_entities(
        db.func.sum(Subscription.amount)
    ).scalar() or 0
    
    # Monthly revenue (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    monthly_revenue = db.query(Subscription).filter(
        Subscription.created_at >= thirty_days_ago
    ).with_entities(
        db.func.sum(Subscription.amount)
    ).scalar() or 0
    
    total_packages = db.query(Package).filter(Package.is_active == True).count()
    
    total_coins_in_system = db.query(SystemUser).with_entities(
        db.func.sum(SystemUser.coin_balance)
    ).scalar() or 0
    
    total_coins_redeemed = db.query(SystemUser).with_entities(
        db.func.sum(SystemUser.total_coins_redeemed)
    ).scalar() or 0
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "active_subscriptions": active_subscriptions,
        "expiring_subscriptions": expiring_subscriptions,
        "expired_subscriptions": expired_subscriptions,
        "total_revenue": total_revenue,
        "monthly_revenue": monthly_revenue,
        "total_packages": total_packages,
        "total_coins_in_system": total_coins_in_system,
        "total_coins_redeemed": total_coins_redeemed
    }

def get_expiring_subscriptions(db: Session, days: int = 7):
    cutoff_date = datetime.utcnow() + timedelta(days=days)
    return db.query(Subscription).filter(
        and_(
            Subscription.end_date <= cutoff_date,
            Subscription.end_date > datetime.utcnow(),
            Subscription.status == "active"
        )
    ).all()
