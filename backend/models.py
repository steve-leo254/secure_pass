from sqlalchemy import create_engine, Column, String, DateTime, Boolean, Text, Integer, ForeignKey, Float, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime
import uuid
import enum
import json

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: f"usr-{uuid.uuid4().hex[:8]}")
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    
    # Relationships
    registered_visitors = relationship("Visitor", foreign_keys="Visitor.registered_by_id", back_populates="registered_by")
    checked_out_visitors = relationship("Visitor", foreign_keys="Visitor.checked_out_by_id", back_populates="checked_out_by")
    audit_logs = relationship("AuditLog", back_populates="performed_by_user")

class Visitor(Base):
    __tablename__ = "visitors"
    
    id = Column(String, primary_key=True, default=lambda: f"vis-{uuid.uuid4().hex[:8]}")
    full_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    id_number = Column(String, nullable=False)
    category = Column(String, nullable=False)
    purpose = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    unit_visited = Column(String, nullable=False)
    tools = Column(Text, default="[]")  # Store as JSON string
    custom_tools = Column(Text, default="[]")  # Store as JSON string
    time_in = Column(DateTime, default=datetime.utcnow)
    time_out = Column(DateTime, nullable=True)
    status = Column(String, default="checked-in")
    registered_by_id = Column(String, ForeignKey("users.id"))
    checked_out_by_id = Column(String, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    registered_by = relationship("User", foreign_keys=[registered_by_id], back_populates="registered_visitors")
    checked_out_by = relationship("User", foreign_keys=[checked_out_by_id], back_populates="checked_out_visitors")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True, default=lambda: f"audit-{uuid.uuid4().hex[:8]}")
    action = Column(String, nullable=False)
    performed_by_id = Column(String, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String, nullable=False)
    category = Column(String, nullable=True)
    
    # Relationships
    performed_by_user = relationship("User", back_populates="audit_logs")

class Tool(Base):
    __tablename__ = "tools"
    
    id = Column(String, primary_key=True, default=lambda: f"tool-{uuid.uuid4().hex[:8]}")
    name = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(String, primary_key=True, default=lambda: f"cat-{uuid.uuid4().hex[:8]}")
    name = Column(String, nullable=False)
    value = Column(String, nullable=False)
    color = Column(String, nullable=False)
    icon = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SystemUser(Base):
    __tablename__ = "system_users"
    
    id = Column(String, primary_key=True, default=lambda: f"sys-{uuid.uuid4().hex[:8]}")
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(String, nullable=False)  # admin, security, superadmin
    status = Column(String, default="active")  # active, suspended, inactive
    company = Column(String, nullable=True)
    property = Column(String, nullable=True)
    total_visitors = Column(Integer, default=0)
    coin_balance = Column(Integer, default=0)
    total_coins_purchased = Column(Integer, default=0)
    total_coins_redeemed = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    subscriptions = relationship("Subscription", back_populates="user")
    coin_transactions = relationship("CoinTransaction", back_populates="user")
    reminders = relationship("SubscriptionReminder", back_populates="user")

class Package(Base):
    __tablename__ = "packages"
    
    id = Column(String, primary_key=True, default=lambda: f"pkg-{uuid.uuid4().hex[:8]}")
    name = Column(String, nullable=False)
    billing = Column(String, nullable=False)  # monthly, yearly, etc.
    price = Column(Float, nullable=False)
    currency = Column(String, default="KES")
    coin_cost = Column(Integer, default=0)
    max_users = Column(Integer, default=5)
    max_visitors_per_day = Column(Integer, default=100)
    features = Column(Text, default="[]")  # JSON array
    is_popular = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Property to handle JSON conversion for features
    @property
    def features_list(self):
        try:
            return json.loads(self.features) if self.features else []
        except (json.JSONDecodeError, TypeError):
            return []
    
    # Relationships
    subscriptions = relationship("Subscription", back_populates="package")

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(String, primary_key=True, default=lambda: f"sub-{uuid.uuid4().hex[:8]}")
    user_id = Column(String, ForeignKey("system_users.id"))
    package_id = Column(String, ForeignKey("packages.id"))
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    status = Column(String, default="active")  # active, expired, cancelled, suspended
    auto_renew = Column(Boolean, default=True)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("SystemUser", back_populates="subscriptions")
    package = relationship("Package", back_populates="subscriptions")

class CoinPackage(Base):
    __tablename__ = "coin_packages"
    
    id = Column(String, primary_key=True, default=lambda: f"coin-{uuid.uuid4().hex[:8]}")
    name = Column(String, nullable=False)
    coins = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    currency = Column(String, default="KES")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    transactions = relationship("CoinTransaction", back_populates="coin_package")

class CoinTransaction(Base):
    __tablename__ = "coin_transactions"
    
    id = Column(String, primary_key=True, default=lambda: f"tx-{uuid.uuid4().hex[:8]}")
    user_id = Column(String, ForeignKey("system_users.id"))
    coin_package_id = Column(String, ForeignKey("coin_packages.id"))
    transaction_type = Column(String, nullable=False)  # purchase, redeem
    coins = Column(Integer, nullable=False)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("SystemUser", back_populates="coin_transactions")
    coin_package = relationship("CoinPackage", back_populates="transactions")

class SubscriptionReminder(Base):
    __tablename__ = "subscription_reminders"
    
    id = Column(String, primary_key=True, default=lambda: f"rem-{uuid.uuid4().hex[:8]}")
    user_id = Column(String, ForeignKey("system_users.id"))
    subscription_id = Column(String, ForeignKey("subscriptions.id"))
    type = Column(String, nullable=False)  # expiring_soon, expired, payment_due
    message = Column(String, nullable=False)
    read = Column(Boolean, default=False)
    sent = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("SystemUser", back_populates="reminders")
    subscription = relationship("Subscription")

# Database configuration
DATABASE_URL = "sqlite:///./securepass.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)
